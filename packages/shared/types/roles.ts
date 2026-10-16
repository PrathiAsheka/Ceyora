export const ROLES = {
  SUPER_ADMIN: "super_admin",
  INSTITUTE_ADMIN: "institute_admin",
  TEACHER: "teacher",
  STAFF: "staff",
} as const;

export const ROLE_LABELS: Record<string, string> = {
  super_admin: "Super Admin",
  institute_admin: "Institute Admin",
  teacher: "Teacher",
  staff: "Staff / Cashier",
};

export const ROLE_HIERARCHY: Record<string, number> = {
  super_admin: 4,
  institute_admin: 3,
  teacher: 2,
  staff: 1,
};

export const hasPermission = (userRole: string, requiredRole: string): boolean => {
  return (ROLE_HIERARCHY[userRole] || 0) >= (ROLE_HIERARCHY[requiredRole] || 0);
};
