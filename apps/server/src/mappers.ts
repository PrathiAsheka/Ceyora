/**
 * Database rows <-> API shapes. The database uses Prisma's camelCase models
 * and UPPERCASE enums; the API speaks the snake_case, lowercase shapes the web
 * app already renders (src/dto.ts). Optional columns that are NULL are left
 * out of the response, exactly like the old local store.
 */
import type {
  Attendance as DbAttendance,
  Class as DbClass,
  Enrollment as DbEnrollment,
  Expense as DbExpense,
  Institute as DbInstitute,
  Payment as DbBill,
  PaymentAllocation as DbAllocation,
  PaymentTransaction as DbTransaction,
  Payout as DbPayout,
  Prisma,
  Staff as DbStaff,
  Student as DbStudent,
  Subject as DbSubject,
  Teacher as DbTeacher,
  TeacherAdvance as DbAdvance,
} from "./generated/prisma";
import type {
  Attendance,
  Class,
  EarningLine,
  Enrollment,
  Expense,
  FeeCharge,
  Institute,
  PartPayment,
  Payment,
  PayoutDeduction,
  PayrollAdvance,
  PayrollPayout,
  Staff,
  Student,
  Subject,
  Teacher,
} from "./dto";

/** NULL -> undefined, so JSON omits the key. */
const opt = <T>(value: T | null | undefined): T | undefined => (value === null ? undefined : value);

/* Enum casing. The API's lowercase unions and Prisma's UPPERCASE enums list
 * the same members, so the converted value fits whichever side receives it. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyEnum = any;
/** Lowercase API enum value. */
export const lower = (value: string): AnyEnum => value.toLowerCase();
/** UPPERCASE database enum value. */
export const upper = (value: string): AnyEnum => value.toUpperCase();

/** "YYYY-MM-DD" for a DATE column. */
export const day = (value: Date) => value.toISOString().slice(0, 10);
/** DATE column value for a "YYYY-MM-DD" string (UTC midnight). */
export const toDate = (value: string) => new Date(`${value.slice(0, 10)}T00:00:00.000Z`);
const optDay = (value: Date | null) => (value ? day(value) : undefined);
const optDate = (value: string | undefined | null) => (value ? toDate(value) : null);

const splitName = (first: string, last: string) => `${first} ${last}`.trim();

/* ------------------------------- institutes ------------------------------- */

export const instituteOut = (r: DbInstitute): Institute => ({
  id: r.id,
  name: r.name,
  registration_number: opt(r.registrationNumber),
  phone: opt(r.phone),
  email: opt(r.email),
  address: opt(r.address),
  logo_url: opt(r.logo),
  billing_cut_off_day: r.cutOffDay,
  currency: r.currency,
  created_at: r.createdAt.toISOString(),
  updated_at: r.updatedAt.toISOString(),
});

export const instituteIn = (r: Partial<Institute>) => ({
  ...(r.name !== undefined && { name: r.name }),
  ...(r.registration_number !== undefined && { registrationNumber: r.registration_number || null }),
  ...(r.phone !== undefined && { phone: r.phone || null }),
  ...(r.email !== undefined && { email: r.email || null }),
  ...(r.address !== undefined && { address: r.address || null }),
  ...(r.logo_url !== undefined && { logo: r.logo_url || null }),
  ...(r.billing_cut_off_day !== undefined && { cutOffDay: Number(r.billing_cut_off_day) || 10 }),
  ...(r.currency !== undefined && { currency: r.currency || "LKR" }),
});

/* -------------------------------- subjects -------------------------------- */

export const subjectOut = (r: DbSubject): Subject => ({
  id: r.id,
  institute_id: r.instituteId,
  name: r.name,
  code: opt(r.code),
});

/* -------------------------------- teachers -------------------------------- */

export const teacherOut = (r: DbTeacher): Teacher => ({
  id: r.id,
  institute_id: r.instituteId,
  first_name: r.firstName,
  last_name: r.lastName,
  nic: opt(r.nic),
  phone: r.phone,
  whatsapp: opt(r.whatsapp),
  email: opt(r.email),
  subjects: r.subjectIds,
  compensation_type: lower(r.rateType),
  compensation_value: r.rate,
  bank_name: opt(r.bankName),
  bank_account: opt(r.bankAccount),
  created_at: r.createdAt.toISOString(),
});

export function teacherIn(r: Partial<Teacher>, current?: DbTeacher) {
  const first = r.first_name ?? current?.firstName ?? "";
  const last = r.last_name ?? current?.lastName ?? "";
  return {
    ...((r.first_name !== undefined || r.last_name !== undefined || !current) && {
      firstName: first,
      lastName: last,
      name: splitName(first, last),
    }),
    ...(r.phone !== undefined && { phone: r.phone }),
    ...(r.whatsapp !== undefined && { whatsapp: r.whatsapp || null }),
    ...(r.email !== undefined && { email: r.email || null }),
    ...(r.nic !== undefined && { nic: r.nic || null }),
    ...(r.subjects !== undefined && { subjectIds: r.subjects }),
    ...(r.compensation_type !== undefined && { rateType: upper(r.compensation_type) }),
    ...(r.compensation_value !== undefined && { rate: Number(r.compensation_value) }),
    ...(r.bank_name !== undefined && { bankName: r.bank_name || null }),
    ...(r.bank_account !== undefined && { bankAccount: r.bank_account || null }),
  };
}

/* --------------------------------- staff ---------------------------------- */

export const staffOut = (r: DbStaff): Staff => ({
  id: r.id,
  institute_id: r.instituteId,
  first_name: r.firstName,
  last_name: r.lastName,
  role: r.role,
  phone: r.phone,
  whatsapp: opt(r.whatsapp),
  email: opt(r.email),
  nic: opt(r.nic),
  status: lower(r.status),
  pay_type: lower(r.payType),
  pay_rate: r.salary,
  units_per_month: opt(r.unitsPerMonth),
  joined_on: day(r.joinedOn),
  created_at: r.createdAt.toISOString(),
});

export function staffIn(r: Partial<Staff>, current?: DbStaff) {
  const first = r.first_name ?? current?.firstName ?? "";
  const last = r.last_name ?? current?.lastName ?? "";
  return {
    ...((r.first_name !== undefined || r.last_name !== undefined || !current) && {
      firstName: first,
      lastName: last,
      name: splitName(first, last),
    }),
    ...(r.role !== undefined && { role: r.role }),
    ...(r.phone !== undefined && { phone: r.phone }),
    ...(r.whatsapp !== undefined && { whatsapp: r.whatsapp || null }),
    ...(r.email !== undefined && { email: r.email || null }),
    ...(r.nic !== undefined && { nic: r.nic || null }),
    ...(r.status !== undefined && { status: upper(r.status) }),
    ...(r.pay_type !== undefined && { payType: upper(r.pay_type) }),
    ...(r.pay_rate !== undefined && { salary: Number(r.pay_rate) }),
    ...("units_per_month" in r && { unitsPerMonth: r.units_per_month ?? null }),
    ...(r.joined_on !== undefined && { joinedOn: toDate(r.joined_on) }),
  };
}

/* -------------------------------- classes --------------------------------- */

export const classOut = (r: DbClass, studentCount: number): Class => ({
  id: r.id,
  institute_id: r.instituteId,
  name: r.name,
  subject_id: r.subjectId,
  teacher_id: r.teacherId ?? "",
  grade: opt(r.grade),
  medium: lower(r.medium),
  day_of_week: r.dayOfWeek,
  time_slot: r.timeSlot,
  hall: opt(r.hall),
  monthly_fee: r.monthlyFee,
  student_count: studentCount,
  created_at: r.createdAt.toISOString(),
});

export const classIn = (r: Partial<Class>) => ({
  ...(r.name !== undefined && { name: r.name }),
  ...(r.grade !== undefined && { grade: r.grade || null }),
  ...(r.subject_id !== undefined && { subjectId: r.subject_id }),
  ...(r.teacher_id !== undefined && { teacherId: r.teacher_id || null }),
  ...(r.medium !== undefined && { medium: upper(r.medium) }),
  ...(r.day_of_week !== undefined && { dayOfWeek: r.day_of_week }),
  ...(r.time_slot !== undefined && { timeSlot: r.time_slot }),
  ...(r.hall !== undefined && { hall: r.hall || null }),
  ...(r.monthly_fee !== undefined && { monthlyFee: Math.round(Number(r.monthly_fee)) }),
});

/* ------------------------------- students --------------------------------- */

export type StudentOut = Student & { phone?: string; address?: string; class_id?: string };

export const enrollmentOut = (r: DbEnrollment): Enrollment => ({
  id: r.id,
  institute_id: r.instituteId,
  student_id: r.studentId,
  class_id: r.classId,
  enrolled_at: day(r.enrolledAt),
  status: lower(r.status),
});

export const studentOut = (r: DbStudent, enrollments: DbEnrollment[] = []): StudentOut => ({
  id: r.id,
  institute_id: r.instituteId,
  first_name: r.firstName,
  last_name: r.lastName,
  date_of_birth: optDay(r.dateOfBirth),
  school: opt(r.school),
  guardian_name: r.parentName,
  guardian_phone: r.parentPhone,
  guardian_whatsapp: opt(r.parentWhatsapp),
  qr_code: r.qrCode,
  enrollments: enrollments.map(enrollmentOut),
  created_at: r.createdAt.toISOString(),
  phone: opt(r.phone),
  address: opt(r.address),
  class_id: opt(r.classId),
});

export function studentIn(r: Partial<StudentOut>, current?: DbStudent) {
  const first = r.first_name ?? current?.firstName ?? "";
  const last = r.last_name ?? current?.lastName ?? "";
  return {
    ...((r.first_name !== undefined || r.last_name !== undefined || !current) && {
      firstName: first,
      lastName: last,
      name: splitName(first, last),
    }),
    ...(r.date_of_birth !== undefined && { dateOfBirth: optDate(r.date_of_birth) }),
    ...(r.school !== undefined && { school: r.school || null }),
    ...(r.guardian_name !== undefined && { parentName: r.guardian_name }),
    ...(r.guardian_phone !== undefined && { parentPhone: r.guardian_phone }),
    ...(r.guardian_whatsapp !== undefined && { parentWhatsapp: r.guardian_whatsapp || null }),
    ...(r.phone !== undefined && { phone: r.phone || null }),
    ...(r.address !== undefined && { address: r.address || null }),
  };
}

/* ------------------------------- attendance ------------------------------- */

export const attendanceOut = (r: DbAttendance): Attendance => ({
  id: r.id,
  institute_id: r.instituteId,
  student_id: r.studentId,
  class_id: r.classId,
  date: day(r.date),
  status: lower(r.status),
  marked_by: lower(r.markedBy),
  created_at: r.createdAt.toISOString(),
});

/* ---------------------------- bills & payments ---------------------------- */

/** A bill in the web app's FeeCharge shape, plus its paid / balance columns. */
export type FeeChargeOut = FeeCharge & { amount_paid: number; balance: number };

export const chargeOut = (r: DbBill): FeeChargeOut => ({
  id: r.id,
  institute_id: r.instituteId,
  student_id: r.studentId,
  class_id: r.classId,
  amount: r.grossAmount,
  discount: r.discount,
  discount_type: lower(r.discountType),
  discount_reason: opt(r.discountReason),
  net_amount: r.amountBilled,
  due_date: day(r.dueDate),
  billing_period: r.billingCycle,
  status: lower(r.status),
  created_at: r.createdAt.toISOString(),
  amount_paid: r.amountPaid,
  balance: r.balance,
});

export const paymentOut = (r: DbTransaction & { allocations: DbAllocation[] }): Payment => ({
  id: r.id,
  institute_id: r.instituteId,
  student_id: r.studentId,
  amount: r.amount,
  payment_method: lower(r.method),
  reference_number: opt(r.reference),
  allocations: r.allocations.map((a) => ({
    id: a.id,
    payment_id: a.transactionId,
    fee_charge_id: a.paymentId,
    amount: a.amount,
  })),
  created_at: r.receivedAt.toISOString(),
});

/* -------------------------------- expenses -------------------------------- */

export const expenseOut = (r: DbExpense): Expense => ({
  id: r.id,
  institute_id: r.instituteId,
  category: r.category,
  description: r.title,
  amount: r.amount,
  date: day(r.date),
  status: lower(r.status),
  due_date: optDay(r.dueDate),
  paid_on: optDay(r.paidOn),
  amount_paid: r.amountPaid,
  payments: r.payments as unknown as PartPayment[],
  vendor: opt(r.vendor),
  payment_method: r.method ? lower(r.method) : undefined,
  class_id: opt(r.classId),
  teacher_id: opt(r.teacherId),
  created_at: r.createdAt.toISOString(),
});

export const expenseIn = (r: Partial<Expense>) => ({
  ...(r.category !== undefined && { category: r.category }),
  ...(r.description !== undefined && { title: r.description }),
  ...(r.amount !== undefined && { amount: Math.round(Number(r.amount)) }),
  ...(r.date !== undefined && { date: toDate(r.date) }),
  ...(r.status !== undefined && { status: upper(r.status) }),
  ...("due_date" in r && { dueDate: optDate(r.due_date) }),
  ...("paid_on" in r && { paidOn: optDate(r.paid_on) }),
  ...(r.vendor !== undefined && { vendor: r.vendor || null }),
  ...("payment_method" in r && {
    method: r.payment_method ? upper(r.payment_method) : null,
  }),
  ...(r.class_id !== undefined && { classId: r.class_id || null }),
  ...(r.teacher_id !== undefined && { teacherId: r.teacher_id || null }),
});

/* -------------------------------- payroll --------------------------------- */

export const advanceOut = (r: DbAdvance): PayrollAdvance => ({
  id: r.id,
  institute_id: r.instituteId,
  payee_type: lower(r.payeeType),
  payee_id: (r.payeeType === "TEACHER" ? r.teacherId : r.staffId) ?? "",
  amount: r.amount,
  date: day(r.date),
  status: lower(r.status),
  deducted: r.deducted,
  method: r.method ? lower(r.method) : undefined,
  note: opt(r.note),
  created_at: r.createdAt.toISOString(),
});

export const payoutOut = (r: DbPayout): PayrollPayout => ({
  id: r.id,
  institute_id: r.instituteId,
  payee_type: lower(r.payeeType),
  payee_id: r.payeeId,
  payee_name: opt(r.payeeName),
  payee_role: opt(r.payeeRole),
  period: r.period,
  lines: r.lines as unknown as EarningLine[],
  gross: r.gross,
  deductions: r.deductions as unknown as PayoutDeduction[],
  advance_total: r.advanceTotal,
  net: r.net,
  paid_on: day(r.paidOn),
  method: lower(r.method),
  reference: opt(r.reference),
  amount_paid: r.amountPaid,
  payments: r.payments as unknown as PartPayment[],
  receipt_no: r.receiptNo,
  created_at: r.createdAt.toISOString(),
});

export const asJson = (value: unknown) => value as Prisma.InputJsonValue;
