/** Database rows -> API shapes for accounts and access codes. */
import type { Invitation as DbInvitation, User as DbUser } from "../generated/prisma";
import { sanitizePermissions, type AuthRole, type AuthUser, type Invitation } from "./permissions";

const role = (value: string) => value.toLowerCase() as AuthRole;

export const userOut = (u: DbUser): AuthUser => ({
  id: u.id,
  username: u.username,
  display_name: u.displayName,
  role: role(u.role),
  permissions: u.role === "SUPER_ADMIN" ? [] : sanitizePermissions(u.permissions),
  institute_id: u.instituteId,
  teacher_id: u.teacherId,
  own_classes_only: u.ownClassesOnly,
  status: u.status === "ACTIVE" ? "active" : "disabled",
  created_at: u.createdAt.toISOString(),
  last_login_at: u.lastLoginAt?.toISOString(),
});

export const invitationOut = (i: DbInvitation): Invitation => ({
  id: i.id,
  code_hint: i.codeHint,
  role: role(i.role) as Invitation["role"],
  display_name: i.displayName,
  permissions: sanitizePermissions(i.permissions),
  institute_id: i.instituteId,
  teacher_id: i.teacherId,
  own_classes_only: i.ownClassesOnly,
  expires_at: i.expiresAt.toISOString(),
  status: i.status === "PENDING" && i.expiresAt < new Date() ? "expired" : (i.status.toLowerCase() as Invitation["status"]),
  created_at: i.createdAt.toISOString(),
  used_by: i.usedBy ?? undefined,
  used_at: i.usedAt?.toISOString(),
});
