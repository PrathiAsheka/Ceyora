/**
 * /api/auth: first-time setup, sign-in/out, the current account, password
 * changes, access-code redemption, and (Super Admin) account and code
 * management. Errors carry translation keys the web app shows directly.
 */
import { timingSafeEqual } from "node:crypto";
import { Router, type Request } from "express";
import { z } from "zod";
import { prisma, type Db } from "../db";
import { HttpError, handle } from "../http";
import { DUMMY_HASH, hashPassword, newAccessCode, newToken, sha256, verifyPassword } from "../auth/crypto";
import {
  normalizeCode,
  normalizeUsername,
  passwordProblem,
  sanitizePermissions,
  usernameProblem,
} from "../auth/permissions";
import { invitationOut, userOut } from "../auth/users";

export const auth = Router();

const SESSION_DAYS = 7;
const MAX_INVITE_DAYS = 60;

/** Simple in-memory brake on password guessing: 10 failures per 15 minutes per username + IP. */
const failures = new Map<string, { count: number; first: number }>();
const WINDOW = 15 * 60_000;
function throttle(key: string) {
  const entry = failures.get(key);
  if (entry && Date.now() - entry.first < WINDOW && entry.count >= 10) {
    throw new HttpError(429, "auth.errTooManyAttempts");
  }
}
function recordFailure(key: string) {
  const entry = failures.get(key);
  if (!entry || Date.now() - entry.first >= WINDOW) failures.set(key, { count: 1, first: Date.now() });
  else entry.count += 1;
}

function checkCredentials(username: string, password: string) {
  const u = usernameProblem(username);
  if (u) throw new HttpError(400, u);
  const p = passwordProblem(password);
  if (p) throw new HttpError(400, p);
}

async function startSession(db: Db, userId: string) {
  const token = newToken();
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 86_400_000);
  await db.session.create({ data: { tokenHash: sha256(token), userId, expiresAt } });
  await db.session.deleteMany({ where: { expiresAt: { lt: new Date() } } });
  const user = await db.user.update({ where: { id: userId }, data: { lastLoginAt: new Date() } });
  return { token, expires_at: expiresAt.toISOString(), user: userOut(user) };
}

const me = (req: Request) => {
  if (!req.auth) throw new HttpError(401, "auth.errSessionExpired");
  return req.auth;
};

/* ------------------------------ public ------------------------------ */

/**
 * When SETUP_TOKEN is set (recommended for any public deployment), first-time
 * setup also needs that secret, so a stranger can't claim the Super Admin
 * account of a fresh deployment.
 */
const setupToken = () => process.env.SETUP_TOKEN?.trim() || "";

function checkSetupToken(given: string | undefined) {
  const expected = setupToken();
  if (!expected) return;
  const a = Buffer.from(given ?? "");
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) throw new HttpError(403, "auth.errSetupKey");
}

auth.get(
  "/status",
  handle(async () => ({
    needs_setup: (await prisma.user.count({ where: { role: "SUPER_ADMIN" } })) === 0,
    setup_key_required: !!setupToken(),
  })),
);

/** Creates the Super Admin. Only works while no Super Admin exists. */
auth.post(
  "/setup",
  handle(async (req) => {
    const body = z
      .object({
        username: z.string(),
        password: z.string(),
        display_name: z.string().default(""),
        setup_key: z.string().optional(),
      })
      .parse(req.body);
    const key = `setup|${req.ip}`;
    throttle(key);
    try {
      checkSetupToken(body.setup_key);
    } catch (error) {
      recordFailure(key);
      throw error;
    }
    const username = normalizeUsername(body.username);
    checkCredentials(username, body.password);
    const passwordHash = await hashPassword(body.password);
    return prisma.$transaction(async (tx) => {
      // Serialised check-and-create: a second setup can't slip in.
      await tx.$executeRaw`LOCK TABLE "users" IN SHARE ROW EXCLUSIVE MODE`;
      if (await tx.user.count({ where: { role: "SUPER_ADMIN" } })) throw new HttpError(409, "auth.errAlreadySetUp");
      const user = await tx.user.create({
        data: {
          username,
          displayName: body.display_name.trim() || "Super Admin",
          role: "SUPER_ADMIN",
          passwordHash,
          permissions: [],
        },
      });
      return startSession(tx, user.id);
    });
  }),
);

auth.post(
  "/login",
  handle(async (req) => {
    const body = z.object({ username: z.string(), password: z.string() }).parse(req.body);
    const username = normalizeUsername(body.username);
    const key = `${username}|${req.ip}`;
    throttle(key);
    const user = await prisma.user.findUnique({ where: { username } });
    // Compare against a dummy hash for unknown usernames so timing doesn't reveal them.
    const ok = await verifyPassword(body.password, user?.passwordHash ?? DUMMY_HASH);
    if (!user || !ok) {
      recordFailure(key);
      throw new HttpError(401, "auth.errInvalid");
    }
    if (user.status !== "ACTIVE") throw new HttpError(403, "auth.errDisabled");
    failures.delete(key);
    return startSession(prisma, user.id);
  }),
);

/** Creates an account from an access code, then signs it in. */
auth.post(
  "/redeem",
  handle(async (req) => {
    const body = z
      .object({ code: z.string(), username: z.string(), password: z.string(), display_name: z.string().optional() })
      .parse(req.body);
    const key = `redeem|${req.ip}`;
    throttle(key);
    const username = normalizeUsername(body.username);
    checkCredentials(username, body.password);
    const passwordHash = await hashPassword(body.password);
    const codeHash = sha256(normalizeCode(body.code));

    return prisma.$transaction(async (tx) => {
      const invite = await tx.invitation.findUnique({ where: { codeHash } });
      if (!invite || invite.status !== "PENDING" || invite.expiresAt < new Date()) {
        recordFailure(key);
        throw new HttpError(400, "auth.errCode");
      }
      if (await tx.user.findUnique({ where: { username } })) throw new HttpError(409, "auth.errUsernameTaken");
      // Claim the code first: two simultaneous redemptions can't both succeed.
      const claimed = await tx.invitation.updateMany({
        where: { id: invite.id, status: "PENDING" },
        data: { status: "USED", usedBy: username, usedAt: new Date() },
      });
      if (claimed.count !== 1) throw new HttpError(400, "auth.errCode");
      const user = await tx.user.create({
        data: {
          username,
          displayName: body.display_name?.trim() || invite.displayName,
          role: invite.role,
          passwordHash,
          permissions: sanitizePermissions(invite.permissions),
          instituteId: invite.instituteId,
          teacherId: invite.teacherId,
          ownClassesOnly: invite.ownClassesOnly,
        },
      });
      return startSession(tx, user.id);
    });
  }),
);

/* ---------------------------- signed in ----------------------------- */

auth.post(
  "/logout",
  handle(async (req) => {
    await prisma.session.deleteMany({ where: { id: me(req).sessionId } });
    return { ok: true };
  }),
);

auth.get("/me", handle(async (req) => me(req).user));

auth.post(
  "/password",
  handle(async (req) => {
    const { user, sessionId } = me(req);
    const body = z.object({ current_password: z.string(), new_password: z.string() }).parse(req.body);
    const row = await prisma.user.findUniqueOrThrow({ where: { id: user.id } });
    if (!(await verifyPassword(body.current_password, row.passwordHash))) throw new HttpError(400, "auth.errCurrentPassword");
    const problem = passwordProblem(body.new_password);
    if (problem) throw new HttpError(400, problem);
    await prisma.user.update({ where: { id: user.id }, data: { passwordHash: await hashPassword(body.new_password) } });
    // Other devices are signed out; this one keeps its session.
    await prisma.session.deleteMany({ where: { userId: user.id, id: { not: sessionId } } });
    return { ok: true };
  }),
);

/* ------------------------- Super Admin only -------------------------- */
// Guarded by the "users.manage" rule in ../auth/guard.ts.

auth.get(
  "/users",
  handle(async () => {
    const rows = await prisma.user.findMany({ orderBy: [{ role: "asc" }, { username: "asc" }] });
    return rows.map(userOut).sort((a, b) => Number(b.role === "super_admin") - Number(a.role === "super_admin"));
  }),
);

async function editableUser(req: Request, id: string) {
  const target = await prisma.user.findUnique({ where: { id } });
  if (!target) throw new HttpError(404, "auth.errNotFound");
  if (target.role === "SUPER_ADMIN" || target.id === me(req).user.id) throw new HttpError(403, "auth.errSuperAdminLocked");
  return target;
}

auth.patch(
  "/users/:id",
  handle(async (req) => {
    const target = await editableUser(req, req.params.id);
    const body = z
      .object({
        display_name: z.string().optional(),
        permissions: z.array(z.string()).optional(),
        institute_id: z.string().nullable().optional(),
        teacher_id: z.string().nullable().optional(),
        own_classes_only: z.boolean().optional(),
        status: z.enum(["active", "disabled"]).optional(),
      })
      .parse(req.body);
    const ownClasses = body.own_classes_only ?? target.ownClassesOnly;
    const teacherId = body.teacher_id !== undefined ? body.teacher_id : target.teacherId;
    if (ownClasses && !teacherId) throw new HttpError(400, "auth.errOwnClassesTeacher");
    const updated = await prisma.user.update({
      where: { id: target.id },
      data: {
        ...(body.display_name !== undefined && { displayName: body.display_name.trim() || target.displayName }),
        ...(body.permissions !== undefined && { permissions: sanitizePermissions(body.permissions) }),
        ...(body.institute_id !== undefined && { instituteId: body.institute_id }),
        ...(body.teacher_id !== undefined && { teacherId: body.teacher_id }),
        ...(body.own_classes_only !== undefined && { ownClassesOnly: body.own_classes_only }),
        ...(body.status !== undefined && { status: body.status === "active" ? "ACTIVE" : "DISABLED" }),
      },
    });
    if (updated.status === "DISABLED") await prisma.session.deleteMany({ where: { userId: updated.id } });
    return userOut(updated);
  }),
);

auth.delete(
  "/users/:id",
  handle(async (req) => {
    const target = await editableUser(req, req.params.id);
    await prisma.user.delete({ where: { id: target.id } });
    return { ok: true };
  }),
);

auth.get(
  "/invitations",
  handle(async () => (await prisma.invitation.findMany({ orderBy: { createdAt: "desc" } })).map(invitationOut)),
);

auth.post(
  "/invitations",
  handle(async (req) => {
    const body = z
      .object({
        role: z.enum(["teacher", "class_admin"]),
        display_name: z.string().min(1),
        permissions: z.array(z.string()),
        institute_id: z.string().nullable(),
        teacher_id: z.string().nullable(),
        own_classes_only: z.boolean(),
        expires_in_days: z.coerce.number(),
      })
      .parse(req.body);
    const permissions = sanitizePermissions(body.permissions);
    if (permissions.length === 0) throw new HttpError(400, "auth.errNoPermissions");
    if (body.own_classes_only && !body.teacher_id) throw new HttpError(400, "auth.errOwnClassesTeacher");
    if (body.institute_id && !(await prisma.institute.findUnique({ where: { id: body.institute_id } }))) {
      throw new HttpError(400, "auth.errNotFound");
    }
    if (body.teacher_id) {
      const teacher = await prisma.teacher.findUnique({ where: { id: body.teacher_id } });
      if (!teacher || (body.institute_id && teacher.instituteId !== body.institute_id)) throw new HttpError(400, "auth.errNotFound");
    }
    const days = Math.min(MAX_INVITE_DAYS, Math.max(1, Math.round(body.expires_in_days || 7)));
    const { display, normalized } = newAccessCode();
    const invite = await prisma.invitation.create({
      data: {
        codeHash: sha256(normalized),
        codeHint: display.slice(-4),
        role: body.role === "teacher" ? "TEACHER" : "CLASS_ADMIN",
        displayName: body.display_name.trim(),
        permissions,
        instituteId: body.institute_id,
        teacherId: body.teacher_id,
        ownClassesOnly: body.own_classes_only,
        expiresAt: new Date(Date.now() + days * 86_400_000),
        createdById: me(req).user.id,
      },
    });
    // The code itself is returned this once and never stored.
    return { invitation: invitationOut(invite), code: display };
  }),
);

auth.post(
  "/invitations/:id/revoke",
  handle(async (req) => {
    const invite = await prisma.invitation.findUnique({ where: { id: req.params.id } });
    if (!invite) throw new HttpError(404, "auth.errNotFound");
    const updated =
      invite.status === "PENDING"
        ? await prisma.invitation.update({ where: { id: invite.id }, data: { status: "REVOKED" } })
        : invite;
    return invitationOut(updated);
  }),
);
