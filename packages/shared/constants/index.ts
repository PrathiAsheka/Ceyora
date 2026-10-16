export const CURRENCY = "LKR";

export const CURRENCY_SYMBOL = "LKR";

export const FEE_STATUS = {
  PAID: "paid",
  PARTIAL: "partial",
  UNPAID: "unpaid",
  OVERDUE: "overdue",
} as const;

export const DAYS_OF_WEEK = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

export const MEDIUMS = {
  SINHALA: "sinhala",
  ENGLISH: "english",
} as const;

export const COMPENSATION_TYPES = {
  PERCENTAGE: "percentage",
  FLAT_STUDENT: "flat_student",
  HOURLY_RATE: "hourly_rate",
} as const;

export const EXPENSE_CATEGORIES = [
  "Hall Rental",
  "Equipment",
  "Utilities",
  "Marketing",
  "Staff Salary",
  "Maintenance",
  "Other",
] as const;

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: CURRENCY,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-LK", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}
