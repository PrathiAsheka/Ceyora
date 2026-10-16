import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

/** An error with an HTTP status; the message is sent to the client. */
export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export const badRequest = (message: string) => new HttpError(400, message);
export const notFound = (what: string) => new HttpError(404, `${what} not found.`);

/** Scope value meaning "every institute" (aggregate views). */
export const ALL_INSTITUTES = "all";

/**
 * The institute a request is scoped to, from `?instituteId=`. List and report
 * endpoints require it: either a concrete institute id or "all" for the
 * cross-institute views. Nothing is ever returned unscoped by accident.
 */
export function scopeOf(req: Request): string {
  const value = req.query.instituteId;
  if (typeof value !== "string" || value.trim() === "") {
    throw badRequest("instituteId query parameter is required (an institute id or \"all\").");
  }
  return lockScope(req, value.trim());
}

/** Optional scope for single-record endpoints; undefined when not given. */
export function optionalScope(req: Request): string | undefined {
  const value = req.query.instituteId;
  const requested = typeof value === "string" && value.trim() !== "" ? value.trim() : undefined;
  // Accounts limited to one institute only ever see records from it.
  return lockedInstitute(req) ? lockScope(req, requested ?? ALL_INSTITUTES) : requested;
}

/** The institute a signed-in account is limited to; null for full access. */
function lockedInstitute(req: Request): string | null {
  const user = req.auth?.user;
  return user && user.role !== "super_admin" ? user.institute_id : null;
}

/** "all" becomes the account's institute; any other institute is refused. */
function lockScope(req: Request, requested: string): string {
  const locked = lockedInstitute(req);
  if (!locked) return requested;
  if (requested === ALL_INSTITUTES || requested === locked) return locked;
  throw new HttpError(403, "auth.errForbidden");
}

export const isAll = (scope: string | undefined) => !scope || scope === ALL_INSTITUTES;

/** Prisma `where` fragment for a scope. */
export const scoped = (scope: string | undefined) => (isAll(scope) ? {} : { instituteId: scope as string });

/** 404 when a record exists but sits outside the requested institute. */
export function assertInScope<T extends { instituteId: string }>(
  row: T | null,
  scope: string | undefined,
  what: string,
): T {
  if (!row || (!isAll(scope) && row.instituteId !== scope)) throw notFound(what);
  return row;
}

/** Wraps an async route: resolves to JSON, errors go to the error handler. */
export const handle =
  (fn: (req: Request, res: Response) => Promise<unknown>) =>
  (req: Request, res: Response, next: NextFunction) => {
    fn(req, res)
      .then((value) => {
        if (!res.headersSent) res.json(value === undefined ? null : value);
      })
      .catch(next);
  };

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof HttpError) {
    res.status(error.status).json({ error: error.message });
    return;
  }
  if (error instanceof ZodError) {
    res.status(400).json({ error: "Invalid request body.", issues: error.issues });
    return;
  }
  const code = (error as { code?: string })?.code;
  if (code === "P2025") {
    res.status(404).json({ error: "Record not found." });
    return;
  }
  if (code === "P2002") {
    res.status(409).json({ error: "A record with these details already exists." });
    return;
  }
  if (code === "P2003") {
    res.status(400).json({ error: "A linked record does not exist." });
    return;
  }
  console.error(error);
  res.status(500).json({ error: "Internal server error." });
}
