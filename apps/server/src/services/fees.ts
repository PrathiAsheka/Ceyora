/**
 * Fee ledger: monthly billing, partial payments, and balance rollovers.
 *
 * - A bill (`Payment` model) is raised per active enrolment per "YYYY-MM"
 *   cycle, due on the institute's cut-off day.
 * - Money received (`PaymentTransaction`) is applied to the student's bills
 *   oldest due date first. Paying less leaves the remainder owing on the
 *   oldest bills, so it is carried into the next month as a due. Paying more
 *   leaves part of the transaction unapplied: that is a credit, applied
 *   automatically to the next bills raised.
 * - A student's account per month is opening (brought forward) + billed -
 *   received = closing (carried forward). Positive = due, negative = credit.
 * - Bill statuses: PAID when fully applied, PARTIAL when part-paid, PENDING
 *   when nothing is paid yet, OVERDUE once an unsettled bill passes its due
 *   date.
 */
import type { Prisma } from "../generated/prisma";
import { prisma, type Db } from "../db";
import { assertInScope, badRequest, notFound, scoped } from "../http";
import { chargeOut, toDate, upper } from "../mappers";
import { currentPeriod, daysPastDue, dueDateFor, nextPeriod } from "../lib/calendar";
import type {
  Class,
  DocumentParty,
  DocumentStudent,
  FeeCharge,
  FeeStatement,
  Institute,
  LedgerChargeLine,
  LedgerMonth,
  OverdueStudentSummary,
  Payment,
  PaymentHistoryRow,
  PaymentReceipt,
  ReceiptLine,
  StatementLine,
  Student,
  StudentAccount,
  StudentFeeLine,
  StudentFeeStatusRow,
  Subject,
  Teacher,
} from "../dto";
import {
  loadCharges,
  loadClasses,
  loadEnrollments,
  loadInstitutes,
  loadPayments,
  loadStudents,
  loadSubjects,
  loadTeachers,
} from "./data";
import type { Enrollment } from "../dto";

/* ----------------------------- pure helpers ------------------------------ */

const sum = <T>(rows: T[], value: (row: T) => number) => rows.reduce((s, r) => s + value(r), 0);

/** Billing month a payment counts towards (the month it was received). */
export const paymentMonth = (payment: Payment) => payment.created_at.slice(0, 7);

/** Order payments are applied in: earliest due first. */
export const chargeOrder = (a: FeeCharge, b: FeeCharge) =>
  a.due_date.localeCompare(b.due_date) ||
  a.billing_period.localeCompare(b.billing_period) ||
  a.created_at.localeCompare(b.created_at) ||
  a.id.localeCompare(b.id);

export const allocated = (payment: Payment) => sum(payment.allocations, (a) => a.amount);

/** Amount applied to each bill across the given payments. */
export function paidByCharge(payments: Payment[]): Map<string, number> {
  const paid = new Map<string, number>();
  for (const payment of payments) {
    for (const a of payment.allocations) {
      paid.set(a.fee_charge_id, (paid.get(a.fee_charge_id) ?? 0) + a.amount);
    }
  }
  return paid;
}

/** What is still owed on a bill after earlier (partial) payments. */
export const balanceOf = (charge: FeeCharge, paid: Map<string, number>) =>
  charge.status === "paid" ? 0 : Math.max(0, charge.net_amount - (paid.get(charge.id) ?? 0));

/** Stable receipt number derived from the payment. */
export const receiptNumber = (payment: Payment) => {
  const paidAt = new Date(payment.created_at);
  return `RC-${paidAt.getFullYear()}-${String(payment.id).slice(-4).toUpperCase()}-${String(
    paidAt.getTime(),
  ).slice(-6)}`;
};

const fullName = (s: { first_name: string; last_name: string }) => `${s.first_name} ${s.last_name}`;

export const partyFromStudent = (student: Student): DocumentStudent => ({
  id: student.id,
  name: fullName(student),
  guardian: student.guardian_name,
  phone: student.guardian_phone,
  whatsapp: student.guardian_whatsapp ?? student.guardian_phone,
  qr_code: student.qr_code,
});

export const partyFromInstitute = (institute: Institute): DocumentParty => ({
  name: institute.name,
  address: institute.address,
  phone: institute.phone,
  email: institute.email,
  logo_url: institute.logo_url,
});

/** Enrolled subjects behind a student's bill, one per class, by class name. */
function feeSubjectsFor(
  studentId: string,
  enrollments: Enrollment[],
  classes: Class[],
  subjects: Subject[],
  teachers: Teacher[],
): StudentFeeLine[] {
  const seen = new Set<string>();
  const lines: StudentFeeLine[] = [];
  for (const e of enrollments) {
    if (e.student_id !== studentId || e.status !== "active") continue;
    const klass = classes.find((c) => c.id === e.class_id);
    if (!klass || seen.has(klass.id)) continue;
    seen.add(klass.id);
    const subject = subjects.find((s) => s.id === klass.subject_id);
    const teacher = teachers.find((t) => t.id === klass.teacher_id);
    lines.push({
      class_id: klass.id,
      class_name: klass.name,
      subject: subject?.name ?? klass.name,
      teacher: teacher ? fullName(teacher) : "-",
      medium: klass.medium,
      schedule: `${klass.day_of_week} ${klass.time_slot}`,
      monthly_fee: klass.monthly_fee,
    });
  }
  return lines.sort((a, b) => a.class_name.localeCompare(b.class_name));
}

function ledgerLine(
  charge: FeeCharge,
  applied: Map<string, number>,
  classes: Map<string, Class>,
  subjects: Map<string, Subject>,
): LedgerChargeLine {
  const klass = classes.get(charge.class_id);
  const paid = Math.min(charge.net_amount, applied.get(charge.id) ?? 0);
  const outstanding = charge.net_amount - paid;
  return {
    charge_id: charge.id,
    billing_period: charge.billing_period,
    class_name: klass?.name ?? "-",
    subject: subjects.get(klass?.subject_id ?? "")?.name ?? klass?.name ?? "-",
    net_amount: charge.net_amount,
    applied: paid,
    outstanding,
    due_date: charge.due_date,
    status:
      outstanding === 0
        ? "paid"
        : daysPastDue(charge.due_date) > 0
          ? "overdue"
          : paid > 0
            ? "partial"
            : "unpaid",
  };
}

/**
 * A student's account month by month (brought forward, billed, received,
 * carried forward) from the first month with activity to the later of the
 * current month and the latest billed month.
 */
function studentLedger(
  studentCharges: FeeCharge[],
  studentPayments: Payment[],
  classes: Map<string, Class>,
  subjects: Map<string, Subject>,
) {
  const applied = paidByCharge(studentPayments);
  const charges = [...studentCharges].sort(chargeOrder);
  const payments = [...studentPayments].sort((a, b) => a.created_at.localeCompare(b.created_at));

  const periods = [
    ...new Set([...charges.map((c) => c.billing_period), ...payments.map(paymentMonth), currentPeriod()]),
  ].sort();
  const firstActive = [...charges.map((c) => c.billing_period), ...payments.map(paymentMonth)].sort()[0];

  let running = 0;
  const months: LedgerMonth[] = periods
    .filter((p) => !firstActive || p >= firstActive)
    .map((period) => {
      const lines = charges
        .filter((c) => c.billing_period === period)
        .map((c) => ledgerLine(c, applied, classes, subjects));
      const received = payments
        .filter((p) => paymentMonth(p) === period)
        .map((p) => ({
          payment_id: p.id,
          date: p.created_at.slice(0, 10),
          amount: p.amount,
          method: p.payment_method,
          receipt_no: receiptNumber(p),
          unapplied: Math.max(0, p.amount - allocated(p)),
        }));
      const opening = running;
      const chargesTotal = sum(lines, (l) => l.net_amount);
      const paymentsTotal = sum(received, (p) => p.amount);
      running = opening + chargesTotal - paymentsTotal;
      return {
        period,
        opening,
        charges_total: chargesTotal,
        payments_total: paymentsTotal,
        closing: running,
        lines,
        payments: received,
      };
    });

  return {
    months,
    balance: running,
    outstanding: charges.map((c) => ledgerLine(c, applied, classes, subjects)).filter((l) => l.outstanding > 0),
  };
}

/* ------------------------------ write paths ------------------------------ */

/**
 * Promotes unsettled bills whose due date has passed to OVERDUE, so stored
 * statuses never lag behind the calendar. Runs before every fee read.
 */
export async function syncOverdueStatuses(db: Db = prisma) {
  const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
  await db.payment.updateMany({
    where: { status: { in: ["PENDING", "PARTIAL"] }, dueDate: { lte: toDate(yesterday) } },
    data: { status: "OVERDUE" },
  });
}

/**
 * Applies every unapplied rupee on the students' payments (over-payments and
 * advance payments) to their oldest unpaid bills, then refreshes each touched
 * bill's paid amount, balance and status.
 */
export async function applyCredits(db: Db, studentIds: Iterable<string>) {
  const ids = [...new Set(studentIds)];
  if (ids.length === 0) return;
  const charges = (await loadCharges({ studentId: { in: ids } }, db)).sort(chargeOrder);
  const payments = await loadPayments({ studentId: { in: ids } }, db);
  const applied = paidByCharge(payments);

  const byStudent = new Map<string, FeeCharge[]>();
  for (const c of charges) byStudent.set(c.student_id, [...(byStudent.get(c.student_id) ?? []), c]);

  const newAllocations: Prisma.PaymentAllocationCreateManyInput[] = [];
  const touched = new Set<string>();
  for (const p of [...payments].sort((a, b) => a.created_at.localeCompare(b.created_at))) {
    let left = p.amount - allocated(p);
    if (left <= 0) continue;
    for (const charge of byStudent.get(p.student_id) ?? []) {
      if (left <= 0) break;
      const owing = charge.net_amount - (applied.get(charge.id) ?? 0);
      if (owing <= 0) continue;
      const amount = Math.min(owing, left);
      newAllocations.push({ transactionId: p.id, paymentId: charge.id, amount });
      applied.set(charge.id, (applied.get(charge.id) ?? 0) + amount);
      touched.add(charge.id);
      left -= amount;
    }
  }
  if (newAllocations.length === 0) return;

  await db.paymentAllocation.createMany({ data: newAllocations });
  for (const charge of charges) {
    if (!touched.has(charge.id)) continue;
    const paid = applied.get(charge.id) ?? 0;
    const status = paid >= charge.net_amount ? "paid" : paid > 0 ? "partial" : charge.status;
    await db.payment.update({
      where: { id: charge.id },
      data: {
        amountPaid: paid,
        balance: Math.max(0, charge.net_amount - paid),
        status: upper(status),
      },
    });
  }
}

/** Raises a bill for a student (institute taken from the student) and applies any credit. */
export async function createFeeCharge(row: Partial<FeeCharge> & { student_id: string; class_id: string }) {
  return prisma.$transaction(async (tx) => {
    const student = await tx.student.findUnique({ where: { id: row.student_id } });
    if (!student) throw notFound("Student");
    const klass = await tx.class.findUnique({ where: { id: row.class_id } });
    if (!klass || klass.instituteId !== student.instituteId) throw badRequest("Class belongs to a different institute.");
    const institute = await tx.institute.findUniqueOrThrow({ where: { id: student.instituteId } });
    const period = row.billing_period ?? currentPeriod();
    const amount = Math.round(row.amount ?? klass.monthlyFee);
    const discount = Math.round(row.discount ?? 0);
    const net = Math.round(row.net_amount ?? amount - discount);
    const created = await tx.payment.create({
      data: {
        instituteId: student.instituteId,
        studentId: student.id,
        classId: klass.id,
        billingCycle: period,
        grossAmount: amount,
        discount,
        discountType: upper(row.discount_type ?? "fixed"),
        discountReason: row.discount_reason ?? null,
        amountBilled: net,
        amountPaid: 0,
        balance: net,
        status: upper(row.status ?? "pending"),
        dueDate: toDate(row.due_date ?? dueDateFor(period, institute.cutOffDay)),
      },
    });
    await applyCredits(tx, [student.id]);
    return chargeOut(await tx.payment.findUniqueOrThrow({ where: { id: created.id } }));
  });
}

/**
 * Raises one bill per active enrolment for a cycle at the class's monthly
 * fee, due on the institute's cut-off day. Idempotent: enrolments already
 * billed for that cycle are skipped. Credits settle the new bills at once.
 */
export async function generateMonthlyCharges(scope: string | undefined, period: string) {
  return prisma.$transaction(
    async (tx) => {
      const enrollments = await tx.enrollment.findMany({
        where: { ...scoped(scope), status: "ACTIVE" },
        orderBy: { id: "asc" },
        include: { class: { include: { institute: true } } },
      });
      const existing = new Set(
        (
          await tx.payment.findMany({
            where: { billingCycle: period },
            select: { studentId: true, classId: true },
          })
        ).map((c) => `${c.studentId}:${c.classId}`),
      );

      let skipped = 0;
      const billed = new Set<string>();
      const data: Prisma.PaymentCreateManyInput[] = [];
      for (const e of enrollments) {
        const key = `${e.studentId}:${e.classId}`;
        if (existing.has(key)) {
          skipped += 1;
          continue;
        }
        data.push({
          instituteId: e.class.instituteId,
          studentId: e.studentId,
          classId: e.classId,
          billingCycle: period,
          grossAmount: e.class.monthlyFee,
          discount: 0,
          discountType: "FIXED",
          amountBilled: e.class.monthlyFee,
          amountPaid: 0,
          balance: e.class.monthlyFee,
          status: "PENDING",
          dueDate: toDate(dueDateFor(period, e.class.institute.cutOffDay)),
        });
        existing.add(key);
        billed.add(e.studentId);
      }
      if (data.length) await tx.payment.createMany({ data });
      await applyCredits(tx, billed);
      await syncOverdueStatuses(tx);
      return { period, created: data.length, skipped };
    },
    { timeout: 60_000 },
  );
}

/**
 * Bills a student joining a class mid-cycle, when the institute has already
 * been billed for the current month. Due on the cut-off day, or a week from
 * today when the cut-off has already passed.
 */
export async function billNewEnrollment(db: Db, studentId: string, classId: string) {
  const klass = await db.class.findUniqueOrThrow({ where: { id: classId }, include: { institute: true } });
  const period = currentPeriod();
  const billedThisMonth = await db.payment.count({
    where: { instituteId: klass.instituteId, billingCycle: period },
  });
  if (!billedThisMonth) return;
  const already = await db.payment.findUnique({
    where: { studentId_classId_billingCycle: { studentId, classId, billingCycle: period } },
  });
  if (already) return;
  const due = [
    dueDateFor(period, klass.institute.cutOffDay),
    new Date(Date.now() + 7 * 86_400_000).toISOString().slice(0, 10),
  ].sort()[1];
  await db.payment.create({
    data: {
      instituteId: klass.instituteId,
      studentId,
      classId,
      billingCycle: period,
      grossAmount: klass.monthlyFee,
      discount: 0,
      discountType: "FIXED",
      amountBilled: klass.monthlyFee,
      amountPaid: 0,
      balance: klass.monthlyFee,
      status: "PENDING",
      dueDate: toDate(due),
    },
  });
  await applyCredits(db, [studentId]);
}

/**
 * Records money received from a student. Any amount is accepted: it settles
 * the oldest bills first and the remainder is kept as credit.
 */
export async function recordFeePayment(row: {
  student_id: string;
  amount: number;
  payment_method: Payment["payment_method"];
  reference_number?: string;
}): Promise<PaymentReceipt> {
  if (!(Number(row.amount) > 0)) throw badRequest("Payment amount must be positive.");
  const id = await prisma.$transaction(async (tx) => {
    const student = await tx.student.findUnique({ where: { id: row.student_id } });
    if (!student) throw notFound("Student");
    const created = await tx.paymentTransaction.create({
      data: {
        instituteId: student.instituteId,
        studentId: student.id,
        amount: Math.round(Number(row.amount)),
        method: upper(row.payment_method),
        reference: row.reference_number || null,
      },
    });
    await applyCredits(tx, [student.id]);
    return created.id;
  });
  return buildReceipt(id);
}

/** Records a bare transaction (no allocation), as the old createPayment did. */
export async function createPayment(row: {
  student_id: string;
  amount: number;
  payment_method: Payment["payment_method"];
  reference_number?: string;
}) {
  const student = await prisma.student.findUnique({ where: { id: row.student_id } });
  if (!student) throw notFound("Student");
  const created = await prisma.paymentTransaction.create({
    data: {
      instituteId: student.instituteId,
      studentId: student.id,
      amount: Math.round(Number(row.amount)),
      method: upper(row.payment_method),
      reference: row.reference_number || null,
    },
  });
  return (await loadPayments({ id: created.id }))[0];
}

/* ------------------------------ read paths ------------------------------- */

/** Everything the per-student documents need, scoped to the student's institute. */
async function studentContext(studentId: string, scope?: string) {
  await syncOverdueStatuses();
  const [student] = await loadStudents({ id: studentId });
  assertInScope(student ? { ...student, instituteId: student.institute_id } : null, scope, "Student");
  const inst = student.institute_id;
  const [classes, subjects, teachers, enrollments, charges, payments, institutes] = await Promise.all([
    loadClasses({ instituteId: inst }),
    loadSubjects(inst),
    loadTeachers(inst),
    loadEnrollments({ studentId }),
    loadCharges({ studentId }),
    loadPayments({ studentId }),
    loadInstitutes(),
  ]);
  return {
    student,
    classes,
    subjects,
    teachers,
    enrollments,
    charges,
    payments,
    institute: institutes.find((i) => i.id === inst),
  };
}

/** Printable statement of everything a student still owes, with the last three months. */
export async function buildStatement(studentId: string, scope?: string): Promise<FeeStatement> {
  const ctx = await studentContext(studentId, scope);
  const paidSoFar = paidByCharge(ctx.payments);
  const ledger = studentLedger(
    ctx.charges,
    ctx.payments,
    new Map(ctx.classes.map((c) => [c.id, c])),
    new Map(ctx.subjects.map((s) => [s.id, s])),
  );

  const lines: StatementLine[] = ctx.charges
    .filter((c) => balanceOf(c, paidSoFar) > 0)
    .map((charge) => {
      const klass = ctx.classes.find((c) => c.id === charge.class_id);
      const subject = ctx.subjects.find((s) => s.id === klass?.subject_id);
      return {
        charge_id: charge.id,
        billing_period: charge.billing_period,
        class_id: charge.class_id,
        class_name: klass?.name ?? "-",
        subject: subject?.name ?? klass?.name ?? "-",
        amount: charge.amount,
        discount: charge.discount,
        discount_type: charge.discount_type,
        discount_reason: charge.discount_reason,
        net_amount: charge.net_amount,
        due_date: charge.due_date,
        days_overdue: daysPastDue(charge.due_date),
        status: charge.status,
      };
    })
    .sort((a, b) => a.due_date.localeCompare(b.due_date));

  const generatedAt = new Date();
  const paidOf = (id: string) => paidSoFar.get(id) ?? 0;
  return {
    statement_no: `ST-${generatedAt.getFullYear()}-${studentId.slice(-4).toUpperCase()}-${String(
      generatedAt.getTime(),
    ).slice(-6)}`,
    generated_at: generatedAt.toISOString(),
    currency: ctx.institute?.currency ?? "LKR",
    institute: ctx.institute ? partyFromInstitute(ctx.institute) : { name: "Ceyora360" },
    student: partyFromStudent(ctx.student),
    subjects: feeSubjectsFor(studentId, ctx.enrollments, ctx.classes, ctx.subjects, ctx.teachers),
    lines,
    totals: {
      gross: sum(lines, (l) => l.amount),
      discount: sum(lines, (l) => l.discount),
      net: sum(lines, (l) => l.net_amount),
      paid: sum(lines, (l) => paidOf(l.charge_id)),
      due: Math.max(0, ledger.balance),
      overdue: sum(
        lines.filter((l) => l.days_overdue > 0),
        (l) => Math.max(0, l.net_amount - paidOf(l.charge_id)),
      ),
      credit: Math.max(0, -ledger.balance),
    },
    max_days_overdue: lines.reduce((max, l) => Math.max(max, l.days_overdue), 0),
    balance: ledger.balance,
    months: ledger.months.slice(-3),
  };
}

/** Receipt for a recorded payment, resolving each allocation to its bill. */
export async function buildReceipt(paymentId: string, scope?: string): Promise<PaymentReceipt> {
  const [receipt] = await buildReceipts([paymentId], scope);
  if (!receipt) throw notFound("Payment");
  return receipt;
}

/**
 * Receipts for several payments in one pass (the payment history shows one
 * per row). Payments outside the scope, or unknown ids, are left out.
 */
export async function buildReceipts(paymentIds: string[], scope?: string): Promise<PaymentReceipt[]> {
  const wanted = (await loadPayments({ id: { in: paymentIds }, ...scoped(scope) })).sort(
    (a, b) => paymentIds.indexOf(a.id) - paymentIds.indexOf(b.id),
  );
  if (wanted.length === 0) return [];
  const studentIds = [...new Set(wanted.map((p) => p.student_id))];
  const instituteIds = [...new Set(wanted.map((p) => p.institute_id))];
  const [students, classes, subjects, charges, payments, institutes] = await Promise.all([
    loadStudents({ id: { in: studentIds } }),
    loadClasses({ instituteId: { in: instituteIds } }),
    prisma.subject.findMany({ where: { instituteId: { in: instituteIds } } }).then((rows) =>
      rows.map((s) => ({ id: s.id, name: s.name })),
    ),
    loadCharges({ studentId: { in: studentIds } }),
    loadPayments({ studentId: { in: studentIds } }),
    loadInstitutes(),
  ]);
  const studentById = new Map(students.map((s) => [s.id, s]));
  const classById = new Map(classes.map((c) => [c.id, c]));
  const subjectById = new Map(subjects.map((s) => [s.id, s]));
  const chargeById = new Map(charges.map((c) => [c.id, c]));
  const balance = new Map<string, number>();
  for (const c of charges) balance.set(c.student_id, (balance.get(c.student_id) ?? 0) + c.net_amount);
  for (const p of payments) balance.set(p.student_id, (balance.get(p.student_id) ?? 0) - p.amount);

  return wanted.map((payment) => {
    const student = studentById.get(payment.student_id);
    const lines: ReceiptLine[] = payment.allocations.map((a) => {
      const charge = chargeById.get(a.fee_charge_id);
      const klass = charge ? classById.get(charge.class_id) : undefined;
      const subject = klass ? subjectById.get(klass.subject_id) : undefined;
      return {
        charge_id: a.fee_charge_id,
        billing_period: charge?.billing_period ?? "-",
        class_name: klass?.name ?? "-",
        subject: subject?.name ?? klass?.name ?? "-",
        amount: a.amount,
      };
    });
    const institute = institutes.find((i) => i.id === payment.institute_id);
    const applied = allocated(payment);
    return {
      receipt_no: receiptNumber(payment),
      paid_at: payment.created_at,
      currency: institute?.currency ?? "LKR",
      institute: institute ? partyFromInstitute(institute) : { name: "Ceyora360" },
      student: student
        ? partyFromStudent(student)
        : { id: payment.student_id, name: "-", guardian: "-", phone: "", whatsapp: "", qr_code: "" },
      payment: {
        id: payment.id,
        method: payment.payment_method,
        reference: payment.reference_number,
        amount: payment.amount,
      },
      lines,
      applied,
      credit: Math.max(0, payment.amount - applied),
      balance_after: balance.get(payment.student_id) ?? 0,
    };
  });
}

/** A student's account for taking a payment. */
export async function studentAccount(studentId: string, scope?: string): Promise<StudentAccount> {
  const ctx = await studentContext(studentId, scope);
  const ledger = studentLedger(
    ctx.charges,
    ctx.payments,
    new Map(ctx.classes.map((c) => [c.id, c])),
    new Map(ctx.subjects.map((s) => [s.id, s])),
  );
  const s = ctx.student;
  return {
    student_id: s.id,
    qr_code: s.qr_code,
    student: fullName(s),
    guardian: s.guardian_name,
    phone: s.guardian_phone,
    whatsapp: s.guardian_whatsapp ?? s.guardian_phone,
    balance: ledger.balance,
    outstanding: ledger.outstanding,
    current_month_due: sum(
      ledger.outstanding.filter((l) => l.billing_period === currentPeriod()),
      (l) => l.outstanding,
    ),
    months: ledger.months,
  };
}

/** Billing cycles with bills, newest first, plus the current and next month. */
export async function billingPeriods(scope?: string): Promise<string[]> {
  const rows = await prisma.payment.findMany({
    where: scoped(scope),
    distinct: ["billingCycle"],
    select: { billingCycle: true },
  });
  const periods = new Set(rows.map((r) => r.billingCycle));
  periods.add(currentPeriod());
  periods.add(nextPeriod(currentPeriod()));
  return [...periods].sort().reverse();
}

/** Payments with the classes and cycles they settled, optionally for one cycle. */
export async function paymentHistory(scope?: string, period?: string): Promise<PaymentHistoryRow[]> {
  const where = scoped(scope);
  const [payments, students, classes, charges] = await Promise.all([
    loadPayments(where),
    loadStudents(where),
    loadClasses(where),
    loadCharges(where),
  ]);
  const studentById = new Map(students.map((s) => [s.id, s]));
  const classById = new Map(classes.map((c) => [c.id, c]));
  const chargeById = new Map(charges.map((c) => [c.id, c]));

  return payments
    .map((payment): PaymentHistoryRow => {
      const student = studentById.get(payment.student_id);
      const settled = payment.allocations
        .map((a) => chargeById.get(a.fee_charge_id))
        .filter((c): c is NonNullable<typeof c> => !!c);
      const periods = [...new Set(settled.map((c) => c.billing_period))].sort();
      return {
        id: payment.id,
        student_id: payment.student_id,
        student: student ? fullName(student) : "-",
        guardian: student?.guardian_name ?? "-",
        whatsapp: student?.guardian_whatsapp ?? student?.guardian_phone ?? "",
        amount: payment.amount,
        method: payment.payment_method,
        reference: payment.reference_number,
        paid_at: payment.created_at,
        receipt_no: receiptNumber(payment),
        billing_periods: periods.length ? periods : [payment.created_at.slice(0, 7)],
        classes: [...new Set(settled.map((c) => classById.get(c.class_id)?.name ?? "-"))],
      };
    })
    .filter((row) => !period || row.paid_at.startsWith(period) || row.billing_periods.includes(period))
    .sort((a, b) => b.paid_at.localeCompare(a.paid_at));
}

/**
 * Each student's account for one billing month (or across all months):
 * brought forward, billed, received, carried forward, overdue exposure and
 * totals for the summary cards.
 */
export async function studentFeeStatuses(scope?: string, period?: string) {
  await syncOverdueStatuses();
  const where = scoped(scope);
  const [students, classes, enrollments, allCharges, payments, institutes] = await Promise.all([
    loadStudents(where),
    loadClasses(where),
    loadEnrollments({ ...where, status: "ACTIVE" }),
    loadCharges(where),
    loadPayments(where),
    loadInstitutes(),
  ]);
  const paid = paidByCharge(payments);
  const classById = new Map(classes.map((c) => [c.id, c]));
  const instName = new Map(institutes.map((i) => [i.id, i.name]));

  const group = <T>(rows: T[], key: (r: T) => string) => {
    const map = new Map<string, T[]>();
    for (const r of rows) map.set(key(r), [...(map.get(key(r)) ?? []), r]);
    return map;
  };
  const chargesByStudent = group(allCharges, (c) => c.student_id);
  const paymentsByStudent = group(payments, (p) => p.student_id);
  const enrolledByStudent = group(enrollments, (e) => e.student_id);

  const rows: StudentFeeStatusRow[] = students
    .map((student): StudentFeeStatusRow | null => {
      const charges = chargesByStudent.get(student.id) ?? [];
      const studentPayments = paymentsByStudent.get(student.id) ?? [];
      const enrolled = (enrolledByStudent.get(student.id) ?? []).map((e) => e.class_id);
      if (charges.length === 0 && enrolled.length === 0 && studentPayments.length === 0) return null;

      const before = (p: string) => !!period && p < period;
      const inPeriod = (p: string) => !period || p === period;
      const opening =
        sum(charges.filter((c) => before(c.billing_period)), (c) => c.net_amount) -
        sum(studentPayments.filter((p) => before(paymentMonth(p))), (p) => p.amount);
      const billedCharges = charges.filter((c) => inPeriod(c.billing_period));
      const billed = sum(billedCharges, (c) => c.net_amount);
      const received = sum(studentPayments.filter((p) => inPeriod(paymentMonth(p))), (p) => p.amount);
      const closing = opening + billed - received;

      const overdueCharges = charges.filter(
        (c) => (!period || c.billing_period <= period) && balanceOf(c, paid) > 0 && daysPastDue(c.due_date) > 0,
      );
      const overdueAmount = Math.min(Math.max(0, closing), sum(overdueCharges, (c) => balanceOf(c, paid)));

      const status: StudentFeeStatusRow["status"] =
        billedCharges.length === 0 && opening === 0 && received === 0
          ? "not_billed"
          : closing < 0
            ? "credit"
            : closing === 0
              ? "paid"
              : overdueAmount > 0
                ? "overdue"
                : received > 0 || opening < 0
                  ? "partial"
                  : "pending";

      return {
        student_id: student.id,
        qr_code: student.qr_code,
        institute_name: instName.get(student.institute_id) ?? "Ceyora360",
        student: fullName(student),
        guardian: student.guardian_name,
        phone: student.guardian_phone,
        whatsapp: student.guardian_whatsapp ?? student.guardian_phone,
        classes: [
          ...new Set(
            [...enrolled, ...billedCharges.map((c) => c.class_id)].map((id) => classById.get(id)?.name ?? "-"),
          ),
        ],
        opening,
        billed,
        paid: received,
        closing,
        balance: Math.max(0, closing),
        credit: Math.max(0, -closing),
        overdue_amount: overdueAmount,
        max_days_overdue:
          overdueAmount > 0 ? overdueCharges.reduce((max, c) => Math.max(max, daysPastDue(c.due_date)), 0) : 0,
        charge_count: billedCharges.length,
        last_payment_at: studentPayments.map((p) => p.created_at).sort().pop(),
        status,
      };
    })
    .filter((r): r is StudentFeeStatusRow => r !== null);

  const rank = { overdue: 0, partial: 1, pending: 2, not_billed: 3, credit: 4, paid: 5 } as const;
  rows.sort(
    (a, b) =>
      rank[a.status] - rank[b.status] ||
      b.max_days_overdue - a.max_days_overdue ||
      a.student.localeCompare(b.student),
  );

  return {
    period: period ?? null,
    rows,
    totals: {
      opening_due: sum(rows, (r) => Math.max(0, r.opening)),
      opening_credit: sum(rows, (r) => Math.max(0, -r.opening)),
      billed: sum(rows, (r) => r.billed),
      collected: sum(rows, (r) => r.paid),
      balance: sum(rows, (r) => r.balance),
      credit: sum(rows, (r) => r.credit),
      overdue: sum(rows, (r) => r.overdue_amount),
      overdue_students: rows.filter((r) => r.status === "overdue").length,
      credit_students: rows.filter((r) => r.status === "credit").length,
      unbilled_students: rows.filter((r) => r.status === "not_billed").length,
    },
  };
}

/** Unsettled bills (pending / partial / overdue) with student and class context. */
export async function outstandingFees(scope?: string) {
  await syncOverdueStatuses();
  const where = scoped(scope);
  const [charges, students, classes, payments] = await Promise.all([
    loadCharges({ ...where, status: { in: ["PENDING", "PARTIAL", "OVERDUE"] } }),
    loadStudents(where),
    loadClasses(where),
    loadPayments(where),
  ]);
  const paid = paidByCharge(payments);
  const now = Date.now();
  const rows = charges
    .map((c) => {
      const student = students.find((s) => s.id === c.student_id);
      const klass = classes.find((x) => x.id === c.class_id);
      return {
        id: c.id,
        student_id: c.student_id,
        student: student ? fullName(student) : "-",
        guardian: student?.guardian_name ?? "-",
        phone: student?.guardian_phone ?? "-",
        class_name: klass?.name ?? "-",
        net_amount: balanceOf(c, paid),
        due_date: c.due_date,
        status: c.status,
        days_overdue: Math.max(0, Math.floor((now - new Date(c.due_date).getTime()) / 86_400_000)),
      };
    })
    .sort((a, b) => b.days_overdue - a.days_overdue);

  return {
    total: sum(rows, (r) => r.net_amount),
    students_with_arrears: new Set(rows.map((r) => r.student_id)).size,
    avg_days_overdue: rows.length ? Math.round(sum(rows, (r) => r.days_overdue) / rows.length) : 0,
    rows,
  };
}

/** Per-student rollup of unpaid bills with the subjects behind them (reminders, alerts). */
export async function overdueStudents(scope?: string) {
  await syncOverdueStatuses();
  const where = scoped(scope);
  const [charges, students, classes, subjects, teachers, enrollments, payments, institutes] = await Promise.all([
    loadCharges(where),
    loadStudents(where),
    loadClasses(where),
    loadSubjects(scope),
    loadTeachers(scope),
    loadEnrollments({ ...where, status: "ACTIVE" }),
    loadPayments(where),
    loadInstitutes(),
  ]);
  const paid = paidByCharge(payments);

  const byStudent = new Map<string, FeeCharge[]>();
  for (const c of charges) {
    if (balanceOf(c, paid) === 0) continue;
    byStudent.set(c.student_id, [...(byStudent.get(c.student_id) ?? []), c]);
  }

  const rows: OverdueStudentSummary[] = [...byStudent.entries()]
    .map(([studentId, studentCharges]) => {
      const student = students.find((s) => s.id === studentId);
      if (!student) return null;
      const chargeRefs = studentCharges
        .map((c) => {
          const klass = classes.find((x) => x.id === c.class_id);
          const subject = subjects.find((s) => s.id === klass?.subject_id);
          return {
            charge_id: c.id,
            billing_period: c.billing_period,
            class_name: klass?.name ?? "-",
            subject: subject?.name ?? klass?.name ?? "-",
            net_amount: balanceOf(c, paid),
            due_date: c.due_date,
            days_overdue: daysPastDue(c.due_date),
            status: c.status,
          };
        })
        .sort((a, b) => a.due_date.localeCompare(b.due_date));
      const maxDays = studentCharges.reduce((max, c) => Math.max(max, daysPastDue(c.due_date)), 0);
      const hasPartial = studentCharges.some((c) => c.status === "partial" || (paid.get(c.id) ?? 0) > 0);
      return {
        student_id: studentId,
        institute_name: institutes.find((i) => i.id === student.institute_id)?.name ?? "Ceyora360",
        student: fullName(student),
        guardian: student.guardian_name,
        phone: student.guardian_phone,
        whatsapp: student.guardian_whatsapp ?? student.guardian_phone,
        qr_code: student.qr_code,
        subjects: feeSubjectsFor(studentId, enrollments, classes, subjects, teachers),
        charges: chargeRefs,
        total_due: sum(studentCharges, (c) => balanceOf(c, paid)),
        overdue_amount: sum(
          studentCharges.filter((c) => daysPastDue(c.due_date) > 0),
          (c) => balanceOf(c, paid),
        ),
        charge_count: studentCharges.length,
        max_days_overdue: maxDays,
        status: maxDays > 0 ? "overdue" : hasPartial ? "partial" : "pending",
      } satisfies OverdueStudentSummary;
    })
    .filter((r): r is OverdueStudentSummary => r !== null)
    .sort((a, b) => b.max_days_overdue - a.max_days_overdue || b.total_due - a.total_due);

  return {
    total: sum(rows, (r) => r.total_due),
    overdue_total: sum(rows, (r) => r.overdue_amount),
    students_with_arrears: rows.length,
    max_days_overdue: rows.reduce((max, r) => Math.max(max, r.max_days_overdue), 0),
    rows,
  };
}

/** Scoped bills, statuses refreshed first. */
export async function listFeeCharges(scope?: string) {
  await syncOverdueStatuses();
  return loadCharges(scoped(scope));
}

