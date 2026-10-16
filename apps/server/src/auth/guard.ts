/**
 * Request authentication and authorisation for /api.
 *
 *  1. `authenticate` reads the bearer token, looks up its (hashed) session and
 *     attaches the account to `req.auth`. Only health, sign-in, first-time
 *     setup and code redemption work without a session.
 *  2. `authorize` checks the account's permissions against ROUTE_RULES: the
 *     first rule matching the method and path decides; anything unmatched is
 *     refused.
 *  3. Accounts limited to one institute are kept inside it (see scopeOf in
 *     ../http.ts and `ensureInScope`), and "own classes only" teachers are
 *     limited to their classes (`ownClassIds`).
 */
import type { NextFunction, Request, Response } from "express";
import { prisma } from "../db";
import { HttpError } from "../http";
import { sha256 } from "./crypto";
import { hasAny, type AuthUser, type Permission } from "./permissions";
import { userOut } from "./users";

export interface AuthContext {
  user: AuthUser;
  sessionId: string;
}

declare module "express-serve-static-core" {
  interface Request {
    auth?: AuthContext;
  }
}

const PUBLIC = [/^\/health$/, /^\/auth\/(status|setup|login|redeem)$/];

/** Sessions are touched at most this often (ms), to avoid a write per request. */
const TOUCH_INTERVAL = 5 * 60_000;

export async function authenticate(req: Request, _res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization ?? "";
    const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
    if (token) {
      const session = await prisma.session.findUnique({
        where: { tokenHash: sha256(token) },
        include: { user: true },
      });
      if (session && session.expiresAt > new Date() && session.user.status === "ACTIVE") {
        req.auth = { user: userOut(session.user), sessionId: session.id };
        if (Date.now() - session.lastSeenAt.getTime() > TOUCH_INTERVAL) {
          void prisma.session.update({ where: { id: session.id }, data: { lastSeenAt: new Date() } }).catch(() => undefined);
        }
      }
    }
    if (!req.auth && !PUBLIC.some((p) => p.test(req.path))) {
      throw new HttpError(401, "auth.errSessionExpired");
    }
    next();
  } catch (error) {
    next(error);
  }
}

type Rule = [method: string, path: RegExp, any: Permission[] | "signed-in"];

/** First match wins; paths are relative to /api. */
const ROUTE_RULES: Rule[] = [
  ["*", /^\/health$/, "signed-in"],
  ["*", /^\/auth\/(status|setup|login|redeem|logout|me|password)$/, "signed-in"],
  ["*", /^\/auth\//, ["users.manage"]],

  ["GET", /^\/institutes(\/[^/]+)?$/, "signed-in"],
  ["*", /^\/institutes/, ["institutes.manage"]],

  ["GET", /^\/subjects$/, "signed-in"],
  ["*", /^\/subjects/, ["classes.manage"]],

  ["GET", /^\/teachers(\/[^/]+)?$/, "signed-in"],
  ["*", /^\/teachers/, ["teachers.manage"]],

  ["GET", /^\/classes\/[^/]+\/attendance$/, ["attendance.view", "attendance.mark"]],
  ["GET", /^\/classes(\/[^/]+)?$/, ["classes.view", "attendance.view", "attendance.mark", "students.view", "fees.view", "fees.collect"]],
  ["*", /^\/classes/, ["classes.manage"]],

  ["GET", /^\/students\/[^/]+\/(account|statement)$/, ["fees.view", "fees.collect"]],
  ["GET", /^\/students(\/[^/]+)?$/, ["students.view", "fees.view", "fees.collect", "attendance.mark"]],
  ["*", /^\/students/, ["students.manage"]],

  ["GET", /^\/enrollments$/, ["students.view", "enrollments.manage"]],
  ["*", /^\/enrollments/, ["enrollments.manage"]],

  ["GET", /^\/staff/, ["staff.manage", "payroll.manage"]],
  ["*", /^\/staff/, ["staff.manage"]],

  ["GET", /^\/attendance/, ["attendance.view", "attendance.mark"]],
  ["*", /^\/attendance/, ["attendance.mark"]],

  ["GET", /^\/fees/, ["fees.view", "fees.collect"]],
  ["*", /^\/fees/, ["fees.billing"]],

  ["GET", /^\/payments/, ["fees.view", "fees.collect"]],
  ["POST", /^\/payments\/receipts$/, ["fees.view", "fees.collect"]],
  ["*", /^\/payments/, ["fees.collect"]],

  ["*", /^\/expenses/, ["expenses.manage"]],
  ["*", /^\/payroll/, ["payroll.manage"]],
  ["GET", /^\/dashboard$/, ["dashboard.view"]],

  ["GET", /^\/academic\/summary$/, ["academic.manage", "reports.view"]],
  ["GET", /^\/(exams|exam-results|topics)$/, ["academic.manage", "reports.view"]],
  ["*", /^\/(exams|topics)/, ["academic.manage"]],

  // Everyone can see and raise support tickets for their institute.
  ["GET", /^\/tickets$/, "signed-in"],
  ["POST", /^\/tickets$/, "signed-in"],
  ["PATCH", /^\/tickets\/[^/]+$/, ["settings.manage"]],
];

export function authorize(req: Request, _res: Response, next: NextFunction) {
  if (PUBLIC.some((p) => p.test(req.path))) return next();
  const rule = ROUTE_RULES.find(([method, path]) => (method === "*" || method === req.method) && path.test(req.path));
  if (!rule) return next(new HttpError(403, "auth.errForbidden"));
  const [, , needed] = rule;
  if (needed !== "signed-in" && !hasAny(req.auth?.user, needed)) return next(new HttpError(403, "auth.errForbidden"));
  // Accounts limited to one institute can't create records for another one.
  const home = homeInstitute(req);
  const bodyInstitute = (req.body as { institute_id?: unknown } | undefined)?.institute_id;
  if (home && req.method !== "GET" && typeof bodyInstitute === "string" && bodyInstitute !== home) {
    return next(new HttpError(403, "auth.errForbidden"));
  }
  next();
}

/** The institute a limited account is locked to; null for full access. */
export function homeInstitute(req: Request): string | null {
  const user = req.auth?.user;
  return user && user.role !== "super_admin" ? user.institute_id : null;
}

/** Refuses (403) when a record's institute is outside the account's institute. */
export function ensureInScope(req: Request, instituteId: string | null | undefined) {
  const home = homeInstitute(req);
  if (home && instituteId && instituteId !== home) throw new HttpError(403, "auth.errForbidden");
}

/** Classes an "own classes only" account may see, or null when unrestricted. */
export async function ownClassIds(req: Request): Promise<Set<string> | null> {
  const user = req.auth?.user;
  if (!user || user.role === "super_admin" || !user.own_classes_only) return null;
  if (!user.teacher_id) return new Set();
  const rows = await prisma.class.findMany({ where: { teacherId: user.teacher_id }, select: { id: true } });
  return new Set(rows.map((r) => r.id));
}
