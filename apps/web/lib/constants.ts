export const APP_NAME = "Ceyora";
export const APP_DESCRIPTION = "Tuition BI & Operations Platform";
export const DEFAULT_LOCALE = "en";
export const SUPPORTED_LOCALES = ["en", "si"] as const;

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

export const FEE_STATUS = {
  PAID: "paid",
  PARTIAL: "partial",
  UNPAID: "unpaid",
  OVERDUE: "overdue",
} as const;

export const CURRENCY = "LKR";
