export type UserRole = "super_admin" | "institute_admin" | "teacher" | "staff";

export type PaymentMethod = "cash" | "bank_transfer" | "card" | "mobile_wallet" | "online";

export type AttendanceStatus = "present" | "absent" | "late" | "excused";

export type EnrollmentStatus = "active" | "inactive" | "transferred";

export type FeeChargeStatus = "pending" | "partial" | "paid" | "overdue";

export type DiscountType = "percentage" | "fixed";

export type TicketStatus = "open" | "in_progress" | "resolved" | "closed";

export type TicketPriority = "low" | "medium" | "high" | "urgent";

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}
