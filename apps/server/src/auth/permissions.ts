/**
 * Roles, permissions and the pages each permission unlocks.
 *
 * The Super Admin always has every permission across every institute. Other
 * accounts (teachers, class admins) are created from access codes and get
 * exactly the permissions chosen when the code was generated, optionally
 * limited to one institute and, for teachers, to their own classes.
 *
 * Mirrors apps/web/lib/auth/permissions.ts; keep the two in step.
 */

export const PERMISSIONS = [
  "dashboard.view",
  "institutes.manage",
  "classes.view",
  "classes.manage",
  "teachers.manage",
  "students.view",
  "students.manage",
  "enrollments.manage",
  "staff.manage",
  "attendance.view",
  "attendance.mark",
  "fees.view",
  "fees.collect",
  "fees.billing",
  "expenses.manage",
  "payroll.manage",
  "academic.manage",
  "reports.view",
  "settings.manage",
  "users.manage",
] as const;

export type Permission = (typeof PERMISSIONS)[number];
export type AuthRole = "super_admin" | "teacher" | "class_admin";
export type InvitableRole = Exclude<AuthRole, "super_admin">;

/** Permission checkboxes, grouped as shown when generating a code. */
export const PERMISSION_GROUPS: Array<{ key: string; permissions: Permission[] }> = [
  { key: "general", permissions: ["dashboard.view", "reports.view"] },
  { key: "classes", permissions: ["classes.view", "classes.manage", "teachers.manage"] },
  { key: "students", permissions: ["students.view", "students.manage", "enrollments.manage"] },
  { key: "attendance", permissions: ["attendance.view", "attendance.mark"] },
  { key: "fees", permissions: ["fees.view", "fees.collect", "fees.billing"] },
  { key: "operations", permissions: ["expenses.manage", "payroll.manage", "staff.manage", "academic.manage"] },
  { key: "system", permissions: ["institutes.manage", "settings.manage"] },
];

/** Never granted through a code: only the Super Admin manages accounts. */
export const SUPER_ADMIN_ONLY: Permission[] = ["users.manage"];

/** Starting permissions for each invitable role (editable before generating). */
export const ROLE_PRESETS: Record<InvitableRole, Permission[]> = {
  teacher: ["dashboard.view", "classes.view", "attendance.view", "attendance.mark"],
  class_admin: [
    "dashboard.view",
    "classes.view",
    "students.view",
    "students.manage",
    "enrollments.manage",
    "attendance.view",
    "attendance.mark",
    "fees.view",
    "fees.collect",
  ],
};

/** A signed-in account, as returned by the auth service. */
export interface AuthUser {
  id: string;
  username: string;
  display_name: string;
  role: AuthRole;
  permissions: Permission[];
  /** Institute the account is limited to; null = every institute. */
  institute_id: string | null;
  /** Teacher record the account belongs to (teachers). */
  teacher_id: string | null;
  /** Only the linked teacher's classes are visible and markable. */
  own_classes_only: boolean;
  status: "active" | "disabled";
  created_at: string;
  last_login_at?: string;
}

export interface AuthSession {
  token: string;
  expires_at: string;
  user: AuthUser;
}

/** An access code (the code itself is only shown once, when generated). */
export interface Invitation {
  id: string;
  /** Last characters of the code, to tell codes apart. */
  code_hint: string;
  role: InvitableRole;
  display_name: string;
  permissions: Permission[];
  institute_id: string | null;
  teacher_id: string | null;
  own_classes_only: boolean;
  expires_at: string;
  status: "pending" | "used" | "revoked" | "expired";
  created_at: string;
  used_by?: string;
  used_at?: string;
}

export interface InvitationInput {
  role: InvitableRole;
  display_name: string;
  permissions: Permission[];
  institute_id: string | null;
  teacher_id: string | null;
  own_classes_only: boolean;
  /** Days until the code expires. */
  expires_in_days: number;
}

export type UserAccessPatch = Partial<
  Pick<AuthUser, "display_name" | "permissions" | "institute_id" | "teacher_id" | "own_classes_only" | "status">
>;

export const isSuperAdmin = (user: Pick<AuthUser, "role"> | null | undefined) => user?.role === "super_admin";

export function hasPermission(user: Pick<AuthUser, "role" | "permissions"> | null | undefined, permission: Permission) {
  if (!user) return false;
  return user.role === "super_admin" || user.permissions.includes(permission);
}

export const hasAny = (user: Pick<AuthUser, "role" | "permissions"> | null | undefined, permissions: Permission[]) =>
  permissions.length === 0 || permissions.some((p) => hasPermission(user, p));

/** Keeps only known permissions that may be granted through a code. */
export const sanitizePermissions = (list: readonly string[]): Permission[] =>
  [...new Set(list)].filter(
    (p): p is Permission => (PERMISSIONS as readonly string[]).includes(p) && !SUPER_ADMIN_ONLY.includes(p as Permission),
  );

/** Rules for passwords chosen at setup, redemption and change. */
export function passwordProblem(password: string): string | null {
  if (password.length < 8) return "auth.errPasswordLength";
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) return "auth.errPasswordMix";
  return null;
}

/** Usernames: 3-32 characters, letters, numbers, dot, dash, underscore. */
export const usernameProblem = (username: string): string | null =>
  /^[a-z0-9._-]{3,32}$/.test(username) ? null : "auth.errUsername";

export const normalizeUsername = (value: string) => value.trim().toLowerCase();

/** Access codes look like CEY-7KQ2-M9XD; spaces, dashes and case are ignored when entered. */
export const normalizeCode = (value: string) => value.toUpperCase().replace(/[^A-Z0-9]/g, "");
