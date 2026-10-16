/**
 * Response shapes shared with the web app. Mirrors apps/web/types/index.ts
 * (the API returns exactly what the frontend already renders); keep the two
 * in step when either changes.
 */

export interface User {
  id: string;
  email: string;
  role: "super_admin" | "institute_admin" | "teacher" | "staff";
  institute_id?: string;
  first_name: string;
  last_name: string;
}

export interface Institute {
  id: string;
  name: string;
  registration_number?: string;
  phone?: string;
  email?: string;
  address?: string;
  logo_url?: string;
  billing_cut_off_day: number;
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface Teacher {
  id: string;
  institute_id: string;
  first_name: string;
  last_name: string;
  nic?: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  subjects: string[];
  compensation_type: "percentage" | "flat_student" | "hourly_rate";
  compensation_value: number;
  bank_name?: string;
  bank_account?: string;
  created_at: string;
}

export interface Student {
  id: string;
  institute_id: string;
  first_name: string;
  last_name: string;
  date_of_birth?: string;
  school?: string;
  guardian_name: string;
  guardian_phone: string;
  guardian_whatsapp?: string;
  qr_code: string;
  enrollments: Enrollment[];
  created_at: string;
}

export interface Enrollment {
  id: string;
  institute_id: string;
  student_id: string;
  class_id: string;
  enrolled_at: string;
  status: "active" | "inactive" | "transferred";
}

export interface Class {
  id: string;
  institute_id: string;
  name: string;
  subject_id: string;
  teacher_id: string;
  grade?: string;
  medium: "sinhala" | "english" | "tamil";
  day_of_week: string;
  time_slot: string;
  hall?: string;
  monthly_fee: number;
  student_count: number;
  created_at: string;
}

export interface Subject {
  id: string;
  institute_id: string;
  name: string;
  code?: string;
}

export interface FeeCharge {
  id: string;
  institute_id: string;
  student_id: string;
  class_id: string;
  amount: number;
  discount: number;
  discount_type: "percentage" | "fixed";
  discount_reason?: string;
  net_amount: number;
  due_date: string;
  billing_period: string;
  status: "pending" | "partial" | "paid" | "overdue";
  created_at: string;
}

export interface Payment {
  id: string;
  institute_id: string;
  student_id: string;
  amount: number;
  payment_method: "cash" | "bank_transfer" | "card" | "mobile_wallet" | "online";
  reference_number?: string;
  allocations: PaymentAllocation[];
  created_at: string;
}

export interface PaymentAllocation {
  id: string;
  payment_id: string;
  fee_charge_id: string;
  amount: number;
}

/** One instalment towards an expense bill or a salary payout. */
export interface PartPayment {
  id: string;
  /** "YYYY-MM-DD" */
  date: string;
  amount: number;
  method?: Payment["payment_method"];
  reference?: string;
}

export interface Expense {
  id: string;
  institute_id: string;
  category: string;
  description: string;
  amount: number;
  /** Bill / invoice date; its month is the billing cycle the expense belongs to. */
  date: string;
  /** Whether the bill has been settled. Records saved before this existed count as paid. */
  status: "paid" | "unpaid";
  /** When an unpaid bill falls due, "YYYY-MM-DD". */
  due_date?: string;
  /** When it was paid in full, "YYYY-MM-DD". */
  paid_on?: string;
  /**
   * Paid so far. A bill can be settled in instalments: it stays "unpaid"
   * until this reaches `amount`; amount - amount_paid is still owed.
   */
  amount_paid?: number;
  /** Instalments paid towards the bill, oldest first. */
  payments?: PartPayment[];
  vendor?: string;
  payment_method?: Payment["payment_method"];
  class_id?: string;
  teacher_id?: string;
  created_at: string;
}

export interface Attendance {
  id: string;
  institute_id: string;
  student_id: string;
  class_id: string;
  date: string;
  status: "present" | "absent" | "late" | "excused";
  marked_by: "qr_scan" | "manual";
  created_at: string;
}

export interface Exam {
  id: string;
  institute_id: string;
  name: string;
  class_id: string;
  date: string;
  total_marks: number;
  passing_marks: number;
  created_at: string;
}

export interface ExamResult {
  id: string;
  institute_id: string;
  exam_id: string;
  student_id: string;
  marks: number;
  grade?: string;
  created_at: string;
}

export interface Topic {
  id: string;
  institute_id: string;
  name: string;
  subject_id: string;
}

export interface TopicResult {
  id: string;
  exam_result_id: string;
  topic_id: string;
  marks: number;
}

/* ------------------------------------------------------------------ *
 * Fee management: overdue alerts, payment statements and receipts.
 * ------------------------------------------------------------------ */

/** One enrolled class rendered as a fee line on statements and alerts. */
export interface StudentFeeLine {
  class_id: string;
  class_name: string;
  subject: string;
  teacher: string;
  medium: string;
  schedule: string;
  monthly_fee: number;
}

/** A single unpaid charge belonging to a student, selectable when taking payment. */
export interface UnpaidChargeRef {
  charge_id: string;
  billing_period: string;
  class_name: string;
  subject: string;
  net_amount: number;
  due_date: string;
  days_overdue: number;
  status: FeeCharge["status"];
}

/** Student-level rollup of unpaid or overdue charges. */
export interface OverdueStudentSummary {
  student_id: string;
  institute_name: string;
  student: string;
  guardian: string;
  phone: string;
  whatsapp: string;
  qr_code: string;
  subjects: StudentFeeLine[];
  charges: UnpaidChargeRef[];
  total_due: number;
  overdue_amount: number;
  charge_count: number;
  max_days_overdue: number;
  status: "pending" | "partial" | "overdue";
}

/** Header block shared by statements and receipts. */
export interface DocumentParty {
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  logo_url?: string;
}

export interface DocumentStudent {
  id: string;
  name: string;
  guardian: string;
  phone: string;
  whatsapp: string;
  qr_code: string;
}

/** A single charge line on a statement. */
export interface StatementLine {
  charge_id: string;
  billing_period: string;
  class_id: string;
  class_name: string;
  subject: string;
  amount: number;
  discount: number;
  discount_type: string;
  discount_reason?: string;
  net_amount: number;
  due_date: string;
  days_overdue: number;
  status: FeeCharge["status"];
}

/** Printable / downloadable fee statement for one student. */
export interface FeeStatement {
  statement_no: string;
  generated_at: string;
  currency: string;
  institute: DocumentParty;
  student: DocumentStudent;
  subjects: StudentFeeLine[];
  lines: StatementLine[];
  totals: {
    gross: number;
    discount: number;
    net: number;
    paid: number;
    due: number;
    overdue: number;
    /** Unapplied money held for future charges. */
    credit: number;
  };
  max_days_overdue: number;
  /** Account balance now: positive = owed, negative = credit. */
  balance: number;
  /** Month-by-month account summary (most recent last). */
  months: LedgerMonth[];
}

/* ------------------------------------------------------------------ *
 * Fee ledger: monthly opening balance, charges, payments, closing.
 * Positive balances are dues owed by the student; negative are credits.
 * ------------------------------------------------------------------ */

/** One class fee in a month, with how much of it has been paid. */
export interface LedgerChargeLine {
  charge_id: string;
  billing_period: string;
  class_name: string;
  subject: string;
  net_amount: number;
  /** Paid towards this charge so far (from any payment, including credits). */
  applied: number;
  outstanding: number;
  due_date: string;
  status: "paid" | "partial" | "unpaid" | "overdue";
}

/** A payment received in a month. */
export interface LedgerPaymentLine {
  payment_id: string;
  date: string;
  amount: number;
  method: Payment["payment_method"];
  receipt_no: string;
  /** Part of this payment not yet applied to any charge (held as credit). */
  unapplied: number;
}

/** A student's account for one billing month. */
export interface LedgerMonth {
  period: string;
  /** Brought forward: positive = due from earlier months, negative = credit. */
  opening: number;
  charges_total: number;
  payments_total: number;
  /** Carried forward to the next month. */
  closing: number;
  lines: LedgerChargeLine[];
  payments: LedgerPaymentLine[];
}

/** Everything needed to take a payment from a student. */
export interface StudentAccount {
  student_id: string;
  qr_code: string;
  student: string;
  guardian: string;
  phone: string;
  whatsapp: string;
  /** Positive = owed, negative = credit. */
  balance: number;
  /** Unpaid charges in the order payments are applied (oldest first). */
  outstanding: LedgerChargeLine[];
  /** Still unpaid on the current billing month's charges only. */
  current_month_due: number;
  months: LedgerMonth[];
}

/** One allocation row on a receipt. */
export interface ReceiptLine {
  charge_id: string;
  billing_period: string;
  class_name: string;
  subject: string;
  amount: number;
}

/** Printable / downloadable receipt for one recorded payment. */
export interface PaymentReceipt {
  receipt_no: string;
  paid_at: string;
  currency: string;
  institute: DocumentParty;
  student: DocumentStudent;
  payment: {
    id: string;
    method: string;
    reference?: string;
    amount: number;
  };
  lines: ReceiptLine[];
  /** Part of the payment applied to charges. */
  applied: number;
  /** Part of the payment kept as credit for future charges. */
  credit: number;
  /** Account balance after this payment: positive = still owed, negative = credit. */
  balance_after: number;
}

/** A recorded payment linked to the classes and billing cycles it settled. */
export interface PaymentHistoryRow {
  id: string;
  student_id: string;
  student: string;
  guardian: string;
  whatsapp: string;
  amount: number;
  method: Payment["payment_method"];
  reference?: string;
  paid_at: string;
  receipt_no: string;
  billing_periods: string[];
  classes: string[];
}

/** One student's fee position for a billing cycle (or across all cycles). */
export interface StudentFeeStatusRow {
  student_id: string;
  /** Student card / QR code, e.g. "CEY-STU-0042" - searchable alongside the id. */
  qr_code: string;
  institute_name: string;
  student: string;
  guardian: string;
  phone: string;
  whatsapp: string;
  classes: string[];
  /** Brought forward from earlier months: positive = due, negative = credit. */
  opening: number;
  /** Charges raised in the period. */
  billed: number;
  /** Payments received in the period. */
  paid: number;
  /** Carried forward: opening + billed - paid. */
  closing: number;
  /** max(closing, 0): what the student owes. */
  balance: number;
  /** max(-closing, 0): what the student has in credit. */
  credit: number;
  overdue_amount: number;
  max_days_overdue: number;
  charge_count: number;
  last_payment_at?: string;
  status: "paid" | "partial" | "pending" | "overdue" | "not_billed" | "credit";
}

/* ------------------------------------------------------------------ *
 * Non-academic staff and unified payroll (teachers + staff).
 * ------------------------------------------------------------------ */

/** Administrative, security, maintenance, cleaning and other support staff. */
export interface Staff {
  id: string;
  institute_id: string;
  first_name: string;
  last_name: string;
  /** Designation, e.g. "Administrative Assistant", "Security Officer". */
  role: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  nic?: string;
  status: "active" | "inactive";
  /** monthly: fixed salary; daily / hourly: wage x units_per_month. */
  pay_type: "monthly" | "daily" | "hourly";
  pay_rate: number;
  /** Working days (daily) or hours (hourly) paid per month. */
  units_per_month?: number;
  joined_on: string;
  created_at: string;
}

/** Who a payroll record belongs to. */
export type PayeeType = "teacher" | "staff";

/**
 * Money advanced to a teacher or staff member ahead of payday. A "requested"
 * advance needs approval; once "paid" it is deducted from the first payout
 * dated on or after it, oldest first, until `deducted` reaches `amount`.
 */
export interface PayrollAdvance {
  id: string;
  institute_id: string;
  payee_type: PayeeType;
  payee_id: string;
  amount: number;
  /** Date the money was (or is to be) handed over, "YYYY-MM-DD". */
  date: string;
  status: "requested" | "paid" | "rejected";
  /** Portion already recovered through payouts. */
  deducted: number;
  method?: Payment["payment_method"];
  note?: string;
  created_at: string;
}

/** One line of gross earnings: a class (teachers) or the base wage (staff). */
export interface EarningLine {
  key: string;
  label: string;
  /** Human-readable working, e.g. "35% of Rs 22,500" or "26 days × Rs 1,800". */
  basis: string;
  amount: number;
  students?: number;
  sessions?: number;
  hours?: number;
  fee_base?: number;
}

/** An advance recovered by a payout. */
export interface PayoutDeduction {
  advance_id: string;
  date: string;
  amount: number;
  note?: string;
}

/** A settled salary for one payee and billing cycle. */
export interface PayrollPayout {
  id: string;
  institute_id: string;
  payee_type: PayeeType;
  payee_id: string;
  /** Name/role at the time of payment, so slips survive edits and deletions. */
  payee_name?: string;
  payee_role?: string;
  /** Billing cycle, "YYYY-MM". */
  period: string;
  lines: EarningLine[];
  gross: number;
  deductions: PayoutDeduction[];
  advance_total: number;
  net: number;
  /** Date of the first payment; advances dated on/before it were deducted. */
  paid_on: string;
  method: Payment["payment_method"];
  reference?: string;
  /**
   * Handed over so far. A salary can be paid in parts: net - amount_paid is
   * still owed to the payee. Records saved before this existed were paid in full.
   */
  amount_paid?: number;
  /** Instalments paid, oldest first. */
  payments?: PartPayment[];
  receipt_no: string;
  created_at: string;
}

/** A payee's payroll position for a cycle, previewed for a payment date. */
export interface PayrollRow {
  payee_type: PayeeType;
  payee_id: string;
  institute_id: string;
  name: string;
  /** "Teacher" or the staff designation. */
  role: string;
  phone: string;
  whatsapp: string;
  email?: string;
  /** e.g. "35% of class fees", "Rs 45,000 / month", "Rs 1,800 / day". */
  rate_label: string;
  lines: EarningLine[];
  gross: number;
  /** Paid advances dated on/before the payment date, still unrecovered. */
  deductible: PayoutDeduction[];
  advance_deduction: number;
  /** Paid advances dated after the payment date (left for a later payout). */
  later_advances: number;
  pending_requests: number;
  net: number;
  payout?: PayrollPayout;
}

/** Printable salary slip for a settled payout. */
export interface PayrollReceipt {
  receipt_no: string;
  period: string;
  paid_on: string;
  currency: string;
  institute: DocumentParty;
  payee: {
    type: PayeeType;
    id: string;
    name: string;
    role: string;
    phone: string;
    whatsapp: string;
    email?: string;
  };
  rate_label: string;
  lines: EarningLine[];
  gross: number;
  deductions: PayoutDeduction[];
  advance_total: number;
  net: number;
  method: string;
  reference?: string;
  /** Paid so far, what is still owed, and each instalment. */
  amount_paid: number;
  balance: number;
  payments: PartPayment[];
}

/** @deprecated Teacher-only names kept for older imports; payroll covers staff too. */
export type TeacherAdvance = PayrollAdvance;
export type TeacherPayout = PayrollPayout;
export type TeacherPayrollRow = PayrollRow;
export type TeacherPayoutReceipt = PayrollReceipt;
export type TeacherEarningLine = EarningLine;

/** Marks rollup for one scheduled class session (attendance). */
export interface SessionSummary {
  date: string;
  present: number;
  absent: number;
  excused: number;
  late: number;
  marked: number;
  total: number;
  complete: boolean;
}

export interface SupportTicket {
  id: string;
  institute_id: string;
  user_id: string;
  subject: string;
  description: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  created_at: string;
  updated_at: string;
}

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
}

/** Sentinel meaning "no institute selected" - surfaces data across every institute. */
export const ALL_INSTITUTES = "all";

/** Active-institute selection: a concrete institute id, or ALL_INSTITUTES. */
export type InstituteScope = string;

/** Every persisted entity that can be attributed to exactly one institute. */
export interface InstituteScoped {
  institute_id: string;
}
