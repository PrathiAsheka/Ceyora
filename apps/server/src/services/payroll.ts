/**
 * Payroll for teachers and non-academic staff.
 *
 * Gross pay per cycle:
 *   - teachers, per class: % of the cycle's billed fees (or expected fees when
 *     not billed yet), a flat rate per enrolled student, or an hourly rate x
 *     the hours actually scheduled (weekly sessions x slot length);
 *   - staff: fixed monthly salary, or daily / hourly wage x units per month.
 * Net pay = gross - advances recovered. Only approved ("paid") advances dated
 * on or before the payment date are deducted, oldest first, capped at the
 * gross; anything left stays on the advance for a later payout.
 */
import { randomUUID } from "node:crypto";
import { prisma } from "../db";
import { assertInScope, badRequest, notFound, scoped } from "../http";
import { asJson, staffOut, teacherOut, toDate, upper } from "../mappers";
import { sessionDates, weekdayIndex } from "../lib/calendar";
import type {
  Class,
  EarningLine,
  Institute,
  PartPayment,
  PayeeType,
  Payment,
  PayoutDeduction,
  PayrollAdvance,
  PayrollPayout,
  PayrollReceipt,
  PayrollRow,
  Staff,
  Teacher,
} from "../dto";
import {
  loadAdvances,
  loadCharges,
  loadClasses,
  loadEnrollments,
  loadInstitutes,
  loadPayouts,
  loadStaff,
  loadTeachers,
} from "./data";
import { partyFromInstitute } from "./fees";

const rupees = (value: number) => `Rs ${Math.round(value).toLocaleString("en-US")}`;
const DEFAULT_UNITS = { daily: 26, hourly: 160 } as const;

/** "08:00 - 10:00" -> 2. Falls back to 2 hours when the slot cannot be read. */
export function slotHours(timeSlot: string): number {
  const times = [...timeSlot.matchAll(/(\d{1,2})[:.](\d{2})/g)].map((m) => Number(m[1]) + Number(m[2]) / 60);
  if (times.length >= 2 && times[1] > times[0]) return Math.round((times[1] - times[0]) * 100) / 100;
  return 2;
}

export function teacherRateLabel(teacher: Teacher): string {
  switch (teacher.compensation_type) {
    case "percentage":
      return `${teacher.compensation_value}% of class fees`;
    case "flat_student":
      return `${rupees(teacher.compensation_value)} / student`;
    default:
      return `${rupees(teacher.compensation_value)} / hour`;
  }
}

function staffRateLabel(member: Staff): string {
  if (member.pay_type === "monthly") return `${rupees(member.pay_rate)} / month`;
  const unit = member.pay_type === "daily" ? "day" : "hour";
  const units = member.units_per_month ?? DEFAULT_UNITS[member.pay_type];
  return `${rupees(member.pay_rate)} / ${unit} · ${units} ${unit}s`;
}

/** What gross pay is computed from for one cycle. */
export interface EarningsData {
  classes: Class[];
  /** Active students per class. */
  students: Map<string, number>;
  /** Billed fees per class for the cycle. */
  billed: Map<string, number>;
}

async function earningsData(scope: string | undefined, period: string): Promise<EarningsData> {
  const where = scoped(scope);
  const [classes, enrollments, charges] = await Promise.all([
    loadClasses(where),
    loadEnrollments({ ...where, status: "ACTIVE" }),
    loadCharges({ ...where, billingCycle: period }),
  ]);
  const students = new Map<string, number>();
  for (const e of enrollments) students.set(e.class_id, (students.get(e.class_id) ?? 0) + 1);
  const billed = new Map<string, number>();
  for (const c of charges) billed.set(c.class_id, (billed.get(c.class_id) ?? 0) + c.net_amount);
  return { classes, students, billed };
}

export function teacherEarnings(teacher: Teacher, period: string, data: EarningsData): EarningLine[] {
  const [year, month] = period.split("-").map(Number);
  return data.classes
    .filter((c) => c.teacher_id === teacher.id)
    .map((klass): EarningLine => {
      const students = data.students.get(klass.id) ?? 0;
      const sessions = sessionDates(year, month, weekdayIndex(klass.day_of_week)).length;
      const hours = Math.round(sessions * slotHours(klass.time_slot) * 100) / 100;
      const billed = data.billed.get(klass.id) ?? 0;
      const feeBase = billed > 0 ? billed : klass.monthly_fee * students;
      const rate = teacher.compensation_value;

      let amount: number;
      let basis: string;
      if (teacher.compensation_type === "percentage") {
        amount = (feeBase * rate) / 100;
        basis = `${rate}% of ${rupees(feeBase)} ${billed > 0 ? "billed" : "expected"} fees`;
      } else if (teacher.compensation_type === "flat_student") {
        amount = students * rate;
        basis = `${students} student${students === 1 ? "" : "s"} × ${rupees(rate)}`;
      } else {
        amount = hours * rate;
        basis = `${sessions} session${sessions === 1 ? "" : "s"} · ${hours} h × ${rupees(rate)}`;
      }
      return {
        key: klass.id,
        label: klass.name,
        basis,
        amount: Math.round(amount),
        students,
        sessions,
        hours,
        fee_base: feeBase,
      };
    })
    .sort((a, b) => a.label.localeCompare(b.label));
}

function staffEarnings(member: Staff): EarningLine[] {
  if (member.pay_type === "monthly") {
    return [{ key: "salary", label: "Monthly salary", basis: "Fixed monthly salary", amount: member.pay_rate }];
  }
  const units = member.units_per_month ?? DEFAULT_UNITS[member.pay_type];
  const unit = member.pay_type === "daily" ? "day" : "hour";
  return [
    {
      key: "wages",
      label: member.pay_type === "daily" ? "Daily wages" : "Hourly wages",
      basis: `${units} ${unit}${units === 1 ? "" : "s"} × ${rupees(member.pay_rate)}`,
      amount: Math.round(units * member.pay_rate),
    },
  ];
}

/** Advances to recover when paying on `paidOn` (see the module comment). */
export function deductionsFor(
  advances: PayrollAdvance[],
  payeeType: PayeeType,
  payeeId: string,
  paidOn: string,
  gross: number,
): PayoutDeduction[] {
  let room = gross;
  const result: PayoutDeduction[] = [];
  const eligible = advances
    .filter(
      (a) =>
        a.payee_type === payeeType &&
        a.payee_id === payeeId &&
        a.status === "paid" &&
        a.date <= paidOn &&
        a.amount - a.deducted > 0,
    )
    .sort((a, b) => a.date.localeCompare(b.date) || a.created_at.localeCompare(b.created_at));
  for (const advance of eligible) {
    if (room <= 0) break;
    const amount = Math.min(advance.amount - advance.deducted, room);
    result.push({ advance_id: advance.id, date: advance.date, amount, note: advance.note });
    room -= amount;
  }
  return result;
}

interface PayeeProfile {
  type: PayeeType;
  id: string;
  institute_id: string;
  name: string;
  role: string;
  phone: string;
  whatsapp: string;
  email?: string;
  rate_label: string;
  earnings: (period: string, data: EarningsData) => EarningLine[];
}

const teacherPayee = (t: Teacher): PayeeProfile => ({
  type: "teacher",
  id: t.id,
  institute_id: t.institute_id,
  name: `${t.first_name} ${t.last_name}`.trim(),
  role: "Teacher",
  phone: t.phone,
  whatsapp: t.whatsapp ?? t.phone,
  email: t.email,
  rate_label: teacherRateLabel(t),
  earnings: (period, data) => teacherEarnings(t, period, data),
});

const staffPayee = (m: Staff): PayeeProfile => ({
  type: "staff",
  id: m.id,
  institute_id: m.institute_id,
  name: `${m.first_name} ${m.last_name}`.trim(),
  role: m.role,
  phone: m.phone,
  whatsapp: m.whatsapp ?? m.phone,
  email: m.email,
  rate_label: staffRateLabel(m),
  earnings: () => staffEarnings(m),
});

async function findPayee(type: PayeeType, id: string): Promise<PayeeProfile | null> {
  if (type === "teacher") {
    const teacher = await prisma.teacher.findUnique({ where: { id } });
    return teacher ? teacherPayee(teacherOut(teacher)) : null;
  }
  const member = await prisma.staff.findUnique({ where: { id } });
  return member ? staffPayee(staffOut(member)) : null;
}

function payrollRow(
  payee: PayeeProfile,
  period: string,
  paidOn: string,
  data: EarningsData,
  advances: PayrollAdvance[],
  payouts: PayrollPayout[],
): PayrollRow {
  const payout = payouts.find((p) => p.payee_type === payee.type && p.payee_id === payee.id && p.period === period);
  const lines = payout?.lines ?? payee.earnings(period, data);
  const gross = payout?.gross ?? lines.reduce((s, l) => s + l.amount, 0);
  const deductible = payout ? payout.deductions : deductionsFor(advances, payee.type, payee.id, paidOn, gross);
  const advanceDeduction = deductible.reduce((s, d) => s + d.amount, 0);
  const own = advances.filter((a) => a.payee_type === payee.type && a.payee_id === payee.id);
  return {
    payee_type: payee.type,
    payee_id: payee.id,
    institute_id: payee.institute_id,
    name: payee.name,
    role: payee.role,
    phone: payee.phone,
    whatsapp: payee.whatsapp,
    email: payee.email,
    rate_label: payee.rate_label,
    lines,
    gross,
    deductible,
    advance_deduction: advanceDeduction,
    later_advances: own
      .filter((a) => a.status === "paid" && a.date > paidOn && a.amount - a.deducted > 0)
      .reduce((s, a) => s + (a.amount - a.deducted), 0),
    pending_requests: own.filter((a) => a.status === "requested").length,
    net: payout?.net ?? Math.max(0, gross - advanceDeduction),
    payout,
  };
}

/**
 * Payroll for a cycle: every teacher and active staff member in scope (plus
 * anyone already paid that cycle), previewed for a payment date.
 */
export async function payroll(scope: string | undefined, period: string, paidOn: string): Promise<PayrollRow[]> {
  const where = scoped(scope);
  const [teachers, staff, advances, payouts, data] = await Promise.all([
    loadTeachers(scope),
    loadStaff(scope),
    loadAdvances(where),
    loadPayouts({ ...where, period }),
    earningsData(scope, period),
  ]);
  const paidStaff = new Set(payouts.filter((p) => p.payee_type === "staff").map((p) => p.payee_id));
  const payees = [
    ...teachers.map(teacherPayee),
    ...staff.filter((m) => m.status === "active" || paidStaff.has(m.id)).map(staffPayee),
  ];
  return payees
    .map((p) => payrollRow(p, period, paidOn, data, advances, payouts))
    .sort((a, b) => a.payee_type.localeCompare(b.payee_type) || a.name.localeCompare(b.name));
}

export const listAdvances = async (scope?: string) =>
  (await loadAdvances(scoped(scope))).sort(
    (a, b) => b.date.localeCompare(a.date) || b.created_at.localeCompare(a.created_at),
  );

const payeeFk = (type: PayeeType, id: string) =>
  type === "teacher" ? { payeeType: "TEACHER" as const, teacherId: id } : { payeeType: "STAFF" as const, staffId: id };

/** Records an advance request, or an advance handed over immediately ("paid"). */
export async function createAdvance(
  row: Pick<PayrollAdvance, "payee_type" | "payee_id" | "amount" | "date" | "status" | "method" | "note">,
) {
  const payee = await findPayee(row.payee_type, row.payee_id);
  if (!payee) throw notFound("Payee");
  if (!(Number(row.amount) > 0)) throw badRequest("Advance amount must be positive.");
  const created = await prisma.teacherAdvance.create({
    data: {
      instituteId: payee.institute_id,
      ...payeeFk(payee.type, payee.id),
      amount: Math.round(Number(row.amount)),
      date: toDate(row.date),
      status: upper(row.status ?? "requested"),
      method: row.method ? upper(row.method) : null,
      note: row.note || null,
    },
  });
  return (await loadAdvances({ id: created.id }))[0];
}

/** Approves (disburses, dated the hand-over day) or rejects a requested advance. */
export async function decideAdvance(
  id: string,
  decision: "paid" | "rejected",
  details: { date?: string; method?: Payment["payment_method"] } = {},
) {
  const advance = await prisma.teacherAdvance.findUnique({ where: { id } });
  if (!advance) return null;
  if (advance.status === "REQUESTED") {
    await prisma.teacherAdvance.update({
      where: { id },
      data: {
        status: upper(decision),
        ...(decision === "paid" && {
          date: toDate(details.date ?? new Date().toISOString().slice(0, 10)),
          method: details.method ? upper(details.method) : null,
        }),
      },
    });
  }
  return (await loadAdvances({ id }))[0];
}

async function buildPayoutReceipt(payout: PayrollPayout): Promise<PayrollReceipt> {
  const payee = await findPayee(payout.payee_type, payout.payee_id);
  const institute: Institute | undefined = (await loadInstitutes()).find((i) => i.id === payout.institute_id);
  return {
    receipt_no: payout.receipt_no,
    period: payout.period,
    paid_on: payout.paid_on,
    currency: institute?.currency ?? "LKR",
    institute: institute ? partyFromInstitute(institute) : { name: "Ceyora360" },
    payee: {
      type: payout.payee_type,
      id: payout.payee_id,
      name: payee?.name ?? payout.payee_name ?? "-",
      role: payee?.role ?? payout.payee_role ?? (payout.payee_type === "teacher" ? "Teacher" : "Staff"),
      phone: payee?.phone ?? "",
      whatsapp: payee?.whatsapp ?? "",
      email: payee?.email,
    },
    rate_label: payee?.rate_label ?? "-",
    lines: payout.lines,
    gross: payout.gross,
    deductions: payout.deductions,
    advance_total: payout.advance_total,
    net: payout.net,
    method: payout.method,
    reference: payout.reference,
    amount_paid: payout.amount_paid ?? payout.net,
    balance: Math.max(0, payout.net - (payout.amount_paid ?? payout.net)),
    payments: payout.payments ?? [],
  };
}

/**
 * Settles a payee's salary for a cycle: recomputes gross, deducts approved
 * advances dated on or before `paid_on`, records the payout with a TP-YYYY-NNNN
 * slip number and marks the advances recovered. Once per payee and cycle.
 */
export async function settlePayout(input: {
  payee_type: PayeeType;
  payee_id: string;
  period: string;
  paid_on: string;
  method: Payment["payment_method"];
  reference?: string;
  /** Paid now; defaults to the full net. Anything less stays owed. */
  amount?: number;
}): Promise<PayrollReceipt> {
  const payee = await findPayee(input.payee_type, input.payee_id);
  if (!payee) throw notFound("Payee");
  const [existing] = await loadPayouts({
    payeeType: upper(payee.type),
    payeeId: payee.id,
    period: input.period,
  });
  if (existing) return buildPayoutReceipt(existing);

  const data = await earningsData(payee.institute_id, input.period);
  const lines = payee.earnings(input.period, data);
  const gross = lines.reduce((s, l) => s + l.amount, 0);

  const payoutId = await prisma.$transaction(async (tx) => {
    const advances = await loadAdvances({ ...payeeFk(payee.type, payee.id) }, tx);
    const deductions = deductionsFor(advances, payee.type, payee.id, input.paid_on, gross);
    const advanceTotal = deductions.reduce((s, d) => s + d.amount, 0);
    const net = Math.max(0, gross - advanceTotal);
    const paidNow = input.amount === undefined ? net : Math.round(input.amount);
    if (paidNow > net) throw badRequest(`Pay between Rs 0 and Rs ${net.toLocaleString("en-US")}.`);
    if (paidNow === 0 && net > 0) throw badRequest("Enter the amount paid now.");
    const year = input.paid_on.slice(0, 4);
    const sequence = (await tx.payout.count({ where: { receiptNo: { startsWith: `TP-${year}-` } } })) + 1;

    const created = await tx.payout.create({
      data: {
        instituteId: payee.institute_id,
        ...payeeFk(payee.type, payee.id),
        payeeId: payee.id,
        payeeName: payee.name,
        payeeRole: payee.role,
        period: input.period,
        lines: asJson(lines),
        gross,
        deductions: asJson(deductions),
        advanceTotal,
        net,
        paidOn: toDate(input.paid_on),
        method: upper(input.method),
        reference: input.reference || null,
        amountPaid: paidNow,
        payments: asJson(
          paidNow > 0
            ? [
                {
                  id: `paypay_${randomUUID().slice(0, 8)}`,
                  date: input.paid_on,
                  amount: paidNow,
                  method: input.method,
                  ...(input.reference && { reference: input.reference }),
                },
              ]
            : [],
        ),
        receiptNo: `TP-${year}-${String(sequence).padStart(4, "0")}`,
      },
    });
    for (const d of deductions) {
      const advance = await tx.teacherAdvance.findUniqueOrThrow({ where: { id: d.advance_id } });
      const deducted = advance.deducted + d.amount;
      await tx.teacherAdvance.update({
        where: { id: d.advance_id },
        data: { deducted, settled: deducted >= advance.amount },
      });
    }
    return created.id;
  });
  const [payout] = await loadPayouts({ id: payoutId });
  return buildPayoutReceipt(payout);
}

/** Pays some or all of what is still owed on a part-paid salary; returns the updated slip. */
export async function payPayoutBalance(
  payoutId: string,
  payment: { amount: number; paid_on: string; method: Payment["payment_method"]; reference?: string },
  scope?: string,
) {
  await prisma.$transaction(async (tx) => {
    const current = await tx.payout.findUnique({ where: { id: payoutId } });
    assertInScope(current, scope, "Payout");
    const owed = current!.net - current!.amountPaid;
    const amount = Math.round(payment.amount);
    if (amount > owed) throw badRequest(`Only Rs ${owed.toLocaleString("en-US")} is still owed.`);
    const payments = [
      ...(current!.payments as unknown as PartPayment[]),
      {
        id: `paypay_${randomUUID().slice(0, 8)}`,
        date: payment.paid_on,
        amount,
        method: payment.method,
        ...(payment.reference && { reference: payment.reference }),
      },
    ];
    await tx.payout.update({
      where: { id: payoutId },
      data: { payments: asJson(payments), amountPaid: current!.amountPaid + amount },
    });
  });
  const [payout] = await loadPayouts({ id: payoutId });
  return buildPayoutReceipt(payout);
}

export async function payoutReceipt(id: string, scope?: string) {
  const [payout] = await loadPayouts({ id });
  assertInScope(payout ? { instituteId: payout.institute_id } : null, scope, "Payout");
  return buildPayoutReceipt(payout);
}

/** Settled teacher payouts in the summary shape used by reports and profiles. */
export async function teacherPayoutSummaries(scope?: string) {
  return (await loadPayouts({ ...scoped(scope), payeeType: "TEACHER" }))
    .map((p) => ({
      id: p.id,
      institute_id: p.institute_id,
      teacher_id: p.payee_id,
      student_count: p.lines.reduce((s, l) => s + (l.students ?? 0), 0),
      amount: p.amount_paid ?? p.net,
      gross: p.gross,
      advance_total: p.advance_total,
      status: "paid" as const,
      month: p.period,
      paid_on: p.paid_on,
      receipt_no: p.receipt_no,
    }))
    .sort((a, b) => b.paid_on.localeCompare(a.paid_on));
}
