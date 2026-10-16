/**
 * Attendance, fees (billing cycles, payments, rollovers), expenses, payroll
 * and dashboard endpoints. Lists and reports require `?instituteId=`.
 */
import { Router, type Request } from "express";
import { z } from "zod";
import { prisma } from "../db";
import { HttpError, assertInScope, badRequest, handle, isAll, notFound, optionalScope, scopeOf, scoped } from "../http";
import { attendanceOut, expenseIn, expenseOut, toDate, upper } from "../mappers";
import { currentPeriod, isDay, isPeriod, sessionDates, weekdayIndex } from "../lib/calendar";
import { loadPayments } from "../services/data";
import * as fees from "../services/fees";
import * as payroll from "../services/payroll";
import { attendanceSummary, dashboard } from "../services/reports";
import type { Expense, PartPayment, SessionSummary } from "../dto";
import { ensureInScope, ownClassIds } from "../auth/guard";
import { randomUUID } from "node:crypto";

const today = () => new Date().toISOString().slice(0, 10);
const instalmentId = () => `exppay_${randomUUID().slice(0, 8)}`;

/** Paid amount, status, full-payment date and method that follow from the instalments. */
function settleExpense(amount: number, payments: PartPayment[]) {
  const paid = payments.reduce((s, p) => s + p.amount, 0);
  const full = paid >= amount;
  const last = payments[payments.length - 1];
  return {
    payments: payments as never,
    amountPaid: paid,
    status: full ? ("PAID" as const) : ("UNPAID" as const),
    paidOn: full && last ? toDate(last.date) : null,
    method: full && last?.method ? upper(last.method) : null,
  };
}

export const operations = Router();

/** 403 unless the student belongs to the account's institute. */
async function studentInScope(req: Request, studentId: string) {
  const student = await prisma.student.findUnique({ where: { id: studentId }, select: { instituteId: true } });
  ensureInScope(req, student?.instituteId);
}

/** 403 unless the teacher / staff member belongs to the account's institute. */
async function payeeInScope(req: Request, type: "teacher" | "staff", id: string) {
  const row =
    type === "teacher"
      ? await prisma.teacher.findUnique({ where: { id }, select: { instituteId: true } })
      : await prisma.staff.findUnique({ where: { id }, select: { instituteId: true } });
  ensureInScope(req, row?.instituteId);
}

const methods = ["cash", "bank_transfer", "card", "mobile_wallet", "online"] as const;
const periodParam = (value: unknown, name = "period") => {
  if (value === undefined || value === "") return undefined;
  if (!isPeriod(value)) throw badRequest(`${name} must be YYYY-MM.`);
  return value;
};

/* ------------------------------- attendance ------------------------------- */

operations.get(
  "/attendance",
  handle(async (req) => {
    const where = scoped(scopeOf(req));
    const classId = typeof req.query.classId === "string" ? req.query.classId : undefined;
    const month = periodParam(req.query.month, "month");
    const own = await ownClassIds(req);
    if (own && classId && !own.has(classId)) return [];
    const rows = await prisma.attendance.findMany({
      where: {
        ...where,
        ...(classId ? { classId } : own ? { classId: { in: [...own] } } : {}),
        ...(month && { date: { gte: toDate(`${month}-01`), lt: toDate(`${month}-31`) } }),
      },
      orderBy: [{ date: "asc" }, { id: "asc" }],
    });
    return rows.map(attendanceOut).filter((r) => !month || r.date.startsWith(month));
  }),
);

operations.get("/attendance/summary", handle(async (req) => attendanceSummary(scopeOf(req))));

/** Roster, marks and weekly sessions for one class in one month. */
operations.get(
  "/classes/:id/attendance",
  handle(async (req) => {
    const scope = optionalScope(req);
    const month = periodParam(req.query.month, "month") ?? currentPeriod();
    const klass = await prisma.class.findUnique({
      where: { id: req.params.id },
      include: { subject: true, teacher: true },
    });
    const own = await ownClassIds(req);
    if (!klass || (!isAll(scope) && klass.instituteId !== scope) || (own && !own.has(klass.id))) {
      return { month, class: null, students: [], records: [], sessions: [] as SessionSummary[] };
    }
    const enrolled = await prisma.enrollment.findMany({
      where: { classId: klass.id, status: "ACTIVE" },
      include: { student: true },
    });
    const students = enrolled
      .map(({ student: s }) => ({
        id: s.id,
        name: `${s.firstName} ${s.lastName}`,
        guardian: s.parentName,
        qr_code: s.qrCode,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
    const records = (
      await prisma.attendance.findMany({
        where: { classId: klass.id, date: { gte: toDate(`${month}-01`), lt: toDate(`${month}-31`) } },
        orderBy: [{ date: "asc" }, { id: "asc" }],
      })
    )
      .map(attendanceOut)
      .filter((r) => r.date.startsWith(month));

    const byDate = new Map<string, typeof records>();
    for (const r of records) byDate.set(r.date, [...(byDate.get(r.date) ?? []), r]);
    const weekday = weekdayIndex(klass.dayOfWeek);
    const [year, monthNumber] = month.split("-").map(Number);
    const sessions: SessionSummary[] = sessionDates(year, monthNumber, weekday).map((date) => {
      const marks = byDate.get(date) ?? [];
      const count = (status: string) => marks.filter((m) => m.status === status).length;
      return {
        date,
        present: count("present"),
        absent: count("absent"),
        excused: count("excused"),
        late: count("late"),
        marked: marks.length,
        total: students.length,
        complete: students.length > 0 && marks.length >= students.length,
      };
    });

    return {
      month,
      class: {
        id: klass.id,
        name: klass.name,
        subject: klass.subject?.name ?? klass.name,
        teacher: klass.teacher ? `${klass.teacher.firstName} ${klass.teacher.lastName}` : "-",
        medium: klass.medium.toLowerCase(),
        schedule: `${klass.dayOfWeek} ${klass.timeSlot}`,
        day_of_week: klass.dayOfWeek,
        time_slot: klass.timeSlot,
        weekday,
        hall: klass.hall ?? "-",
        monthly_fee: klass.monthlyFee,
      },
      students,
      records,
      sessions,
    };
  }),
);

const markSchema = z.object({
  class_id: z.string(),
  student_id: z.string(),
  date: z.string().refine(isDay, "date must be YYYY-MM-DD"),
  status: z.enum(["present", "absent", "late", "excused"]).nullable(),
});

/**
 * Saves (or clears, with status null) attendance marks in one transaction.
 * Each mark is keyed on class + student + date; the institute comes from the
 * class, and marks for students outside that institute are ignored.
 */
operations.put(
  "/attendance/marks",
  handle(async (req) => {
    const marks = z.array(markSchema).parse(Array.isArray(req.body) ? req.body : req.body?.marks);
    const classIds = [...new Set(marks.map((m) => m.class_id))];
    const studentIds = [...new Set(marks.map((m) => m.student_id))];
    const [classes, students] = await Promise.all([
      prisma.class.findMany({ where: { id: { in: classIds } }, select: { id: true, instituteId: true } }),
      prisma.student.findMany({ where: { id: { in: studentIds } }, select: { id: true, instituteId: true } }),
    ]);
    const classInst = new Map(classes.map((c) => [c.id, c.instituteId]));
    const studentInst = new Map(students.map((s) => [s.id, s.instituteId]));
    for (const c of classes) ensureInScope(req, c.instituteId);
    const own = await ownClassIds(req);

    return prisma.$transaction(async (tx) => {
      const saved = [];
      for (const m of marks) {
        const instituteId = classInst.get(m.class_id);
        if (!instituteId || studentInst.get(m.student_id) !== instituteId) continue;
        if (own && !own.has(m.class_id)) continue;
        const key = { classId: m.class_id, studentId: m.student_id, date: toDate(m.date) };
        if (m.status === null) {
          await tx.attendance.deleteMany({ where: key });
          continue;
        }
        const row = await tx.attendance.upsert({
          where: { classId_studentId_date: key },
          update: { status: upper(m.status), markedBy: "MANUAL" },
          create: { ...key, instituteId, status: upper(m.status), markedBy: "MANUAL" },
        });
        saved.push(attendanceOut(row));
      }
      return saved;
    });
  }),
);

/** A QR scan: marks the student for today's session. */
operations.post(
  "/attendance/scan",
  handle(async (req) => {
    const body = z
      .object({
        student_id: z.string(),
        class_id: z.string(),
        status: z.enum(["present", "absent", "late", "excused"]).optional(),
      })
      .parse(req.body);
    const klass = await prisma.class.findUnique({ where: { id: body.class_id } });
    const student = await prisma.student.findUnique({ where: { id: body.student_id } });
    if (!klass || !student) throw notFound(!klass ? "Class" : "Student");
    if (klass.instituteId !== student.instituteId) throw badRequest("Student belongs to a different institute.");
    ensureInScope(req, klass.instituteId);
    const own = await ownClassIds(req);
    if (own && !own.has(klass.id)) throw new HttpError(403, "auth.errForbidden");
    const key = { classId: klass.id, studentId: student.id, date: toDate(new Date().toISOString()) };
    const status = upper(body.status ?? "present");
    const row = await prisma.attendance.upsert({
      where: { classId_studentId_date: key },
      update: { status, markedBy: "QR_SCAN" },
      create: { ...key, instituteId: klass.instituteId, status, markedBy: "QR_SCAN" },
    });
    return attendanceOut(row);
  }),
);

/* ---------------------------------- fees ---------------------------------- */

operations.get("/fees/charges", handle(async (req) => fees.listFeeCharges(scopeOf(req))));

operations.post(
  "/fees/charges",
  handle(async (req) => {
    const body = req.body ?? {};
    if (!body.student_id || !body.class_id) throw badRequest("student_id and class_id are required.");
    if (body.billing_period !== undefined) periodParam(body.billing_period, "billing_period");
    await studentInScope(req, body.student_id);
    return fees.createFeeCharge(body);
  }),
);

operations.get("/fees/periods", handle(async (req) => fees.billingPeriods(scopeOf(req))));

/** Raises the cycle's bills for every active enrolment (idempotent). */
operations.post(
  "/fees/cycles/:period/generate",
  handle(async (req) => {
    const period = periodParam(req.params.period)!;
    return fees.generateMonthlyCharges(scopeOf(req), period);
  }),
);

/**
 * Processes a billing cycle end to end: raises any missing bills, applies
 * credits brought forward, refreshes overdue statuses, and returns every
 * student's opening (brought forward) / billed / received / closing (carried
 * forward) position for the cycle.
 */
operations.post(
  "/fees/cycles/:period/process",
  handle(async (req) => {
    const period = periodParam(req.params.period)!;
    const scope = scopeOf(req);
    const generated = await fees.generateMonthlyCharges(scope, period);
    return { ...generated, statuses: await fees.studentFeeStatuses(scope, period) };
  }),
);

operations.get(
  "/fees/statuses",
  handle(async (req) => fees.studentFeeStatuses(scopeOf(req), periodParam(req.query.period))),
);
operations.get("/fees/outstanding", handle(async (req) => fees.outstandingFees(scopeOf(req))));
operations.get("/fees/overdue", handle(async (req) => fees.overdueStudents(scopeOf(req))));
operations.get(
  "/fees/history",
  handle(async (req) => fees.paymentHistory(scopeOf(req), periodParam(req.query.period))),
);

operations.get("/students/:id/account", handle(async (req) => fees.studentAccount(req.params.id, optionalScope(req))));
operations.get("/students/:id/statement", handle(async (req) => fees.buildStatement(req.params.id, optionalScope(req))));

/* -------------------------------- payments -------------------------------- */

operations.get("/payments", handle(async (req) => loadPayments(scoped(scopeOf(req)))));

const paymentSchema = z.object({
  student_id: z.string(),
  amount: z.coerce.number().positive(),
  payment_method: z.enum(methods),
  reference_number: z.string().optional(),
});

/** Records money received and applies it oldest bill first; returns the receipt. */
operations.post(
  "/payments",
  handle(async (req) => {
    const body = paymentSchema.parse(req.body);
    await studentInScope(req, body.student_id);
    return fees.recordFeePayment(body);
  }),
);

/** Records a transaction without applying it (legacy createPayment). */
operations.post(
  "/payments/unapplied",
  handle(async (req) => {
    const body = paymentSchema.parse(req.body);
    await studentInScope(req, body.student_id);
    return fees.createPayment(body);
  }),
);

/** Receipts for many payments at once: body { ids: string[] }. */
operations.post(
  "/payments/receipts",
  handle(async (req) => {
    const ids = z.array(z.string()).max(2000).parse(req.body?.ids);
    return fees.buildReceipts(ids, optionalScope(req));
  }),
);

operations.get("/payments/:id/receipt", handle(async (req) => fees.buildReceipt(req.params.id, optionalScope(req))));

/* -------------------------------- expenses -------------------------------- */

/** Expenses, newest bill first. Filters: ?status=paid|unpaid, ?month=YYYY-MM, ?category=. */
operations.get(
  "/expenses",
  handle(async (req) => {
    const where = scoped(scopeOf(req));
    const status = req.query.status;
    if (status !== undefined && status !== "paid" && status !== "unpaid") {
      throw badRequest("status must be paid or unpaid.");
    }
    const month = periodParam(req.query.month, "month");
    const category = typeof req.query.category === "string" ? req.query.category : undefined;
    const rows = await prisma.expense.findMany({
      where: {
        ...where,
        ...(status && { status: upper(status) }),
        ...(category && { category }),
        ...(month && { date: { gte: toDate(`${month}-01`), lt: toDate(`${month}-31`) } }),
      },
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
    });
    return rows.map(expenseOut).filter((e) => !month || e.date.startsWith(month));
  }),
);

/** Paid / unpaid totals (and overdue unpaid bills) for the expense cards. */
operations.get(
  "/expenses/summary",
  handle(async (req) => {
    const month = periodParam(req.query.month, "month");
    const rows = (await prisma.expense.findMany({ where: scoped(scopeOf(req)) }))
      .map(expenseOut)
      .filter((e) => !month || e.date.startsWith(month));
    const today = new Date().toISOString().slice(0, 10);
    const total = (list: Expense[]) => list.reduce((s, e) => s + e.amount, 0);
    const paidSoFar = (list: Expense[]) => list.reduce((s, e) => s + (e.amount_paid ?? 0), 0);
    const owed = (list: Expense[]) => total(list) - paidSoFar(list);
    const paid = rows.filter((e) => e.status === "paid");
    const unpaid = rows.filter((e) => e.status === "unpaid");
    const partly = unpaid.filter((e) => (e.amount_paid ?? 0) > 0);
    const overdue = unpaid.filter((e) => e.due_date && e.due_date < today);
    return {
      month: month ?? null,
      total: total(rows),
      /** Money actually paid out, including instalments on part-paid bills. */
      paid: paidSoFar(rows),
      /** Still owed (part-paid bills count only their balance). */
      unpaid: owed(unpaid),
      overdue: owed(overdue),
      counts: {
        total: rows.length,
        paid: paid.length,
        unpaid: unpaid.length,
        partly_paid: partly.length,
        overdue: overdue.length,
      },
    };
  }),
);

operations.post(
  "/expenses",
  handle(async (req) => {
    const body = req.body as Partial<Expense>;
    if (!body.institute_id || body.institute_id === "all" || !(await prisma.institute.findUnique({ where: { id: body.institute_id } }))) {
      throw badRequest("Choose the institute this record belongs to.");
    }
    if (!body.category || !body.description || !(Number(body.amount) > 0) || !isDay(body.date)) {
      throw badRequest("category, description, a positive amount and date (YYYY-MM-DD) are required.");
    }
    // "paid" pays the bill in full; otherwise amount_paid is a first instalment.
    const amount = Math.round(Number(body.amount));
    const paidNow =
      body.status === "paid" ? amount : Math.min(amount, Math.max(0, Math.round(Number(body.amount_paid ?? 0))));
    const payments: PartPayment[] = paidNow
      ? [{ id: instalmentId(), date: body.paid_on ?? today(), amount: paidNow, ...(body.payment_method && { method: body.payment_method }) }]
      : [];
    const { status: _s, paid_on: _p, payment_method: _m, amount_paid: _a, payments: _x, ...rest } = body;
    const row = await prisma.expense.create({
      data: { instituteId: body.institute_id, ...expenseIn(rest), ...settleExpense(amount, payments) } as never,
    });
    return expenseOut(row);
  }),
);

operations.patch(
  "/expenses/:id",
  handle(async (req) => {
    assertInScope(await prisma.expense.findUnique({ where: { id: req.params.id } }), optionalScope(req), "Expense");
    return expenseOut(await prisma.expense.update({ where: { id: req.params.id }, data: expenseIn(req.body ?? {}) }));
  }),
);

/**
 * Marks a bill paid (paying whatever is still owed, dated today unless
 * paid_on is given) or back to unpaid (clearing every instalment).
 */
operations.patch(
  "/expenses/:id/status",
  handle(async (req) => {
    const body = z
      .object({
        status: z.enum(["paid", "unpaid"]),
        paid_on: z.string().refine(isDay).optional(),
        payment_method: z.enum(methods).optional(),
      })
      .parse(req.body);
    const current = await prisma.expense.findUnique({ where: { id: req.params.id } });
    if (!current) return null;
    assertInScope(current, optionalScope(req), "Expense");
    const existing = current.payments as unknown as PartPayment[];
    const owed = current.amount - current.amountPaid;
    const payments: PartPayment[] =
      body.status === "paid"
        ? owed > 0
          ? [
              ...existing,
              { id: instalmentId(), date: body.paid_on ?? today(), amount: owed, ...(body.payment_method && { method: body.payment_method }) },
            ]
          : existing
        : [];
    const row = await prisma.expense.update({ where: { id: current.id }, data: settleExpense(current.amount, payments) });
    return expenseOut(row);
  }),
);

/**
 * Pays part (or the rest) of a bill. It turns PAID once the instalments reach
 * its amount; until then amount - amount_paid is still owed.
 */
operations.post(
  "/expenses/:id/payments",
  handle(async (req) => {
    const body = z
      .object({
        amount: z.coerce.number().positive(),
        paid_on: z.string().refine(isDay).optional(),
        payment_method: z.enum(methods).optional(),
      })
      .parse(req.body);
    return prisma.$transaction(async (tx) => {
      const current = await tx.expense.findUnique({ where: { id: req.params.id } });
      if (!current) return null;
      assertInScope(current, optionalScope(req), "Expense");
      const owed = current.amount - current.amountPaid;
      const amount = Math.round(body.amount);
      if (amount > owed) throw badRequest(`Only Rs ${owed.toLocaleString("en-US")} is still owed on this bill.`);
      const payments: PartPayment[] = [
        ...(current.payments as unknown as PartPayment[]),
        { id: instalmentId(), date: body.paid_on ?? today(), amount, ...(body.payment_method && { method: body.payment_method }) },
      ];
      const row = await tx.expense.update({ where: { id: current.id }, data: settleExpense(current.amount, payments) });
      return expenseOut(row);
    });
  }),
);

operations.delete(
  "/expenses/:id",
  handle(async (req) => (await prisma.expense.deleteMany({ where: { id: req.params.id, ...scoped(optionalScope(req)) } })).count > 0),
);

/* --------------------------------- payroll -------------------------------- */

/**
 * Payroll for a cycle, previewed for a payment date: gross per payee, the
 * advances that would be deducted if paid on `paidOn`, and the net.
 * ?payeeType=teacher|staff narrows it.
 */
operations.get(
  "/payroll",
  handle(async (req) => {
    const period = periodParam(req.query.period) ?? currentPeriod();
    const paidOn = isDay(req.query.paidOn) ? req.query.paidOn : new Date().toISOString().slice(0, 10);
    const rows = await payroll.payroll(scopeOf(req), period, paidOn);
    const type = req.query.payeeType;
    return type === "teacher" || type === "staff" ? rows.filter((r) => r.payee_type === type) : rows;
  }),
);

operations.get(
  "/payroll/advances",
  handle(async (req) => {
    const rows = await payroll.listAdvances(scopeOf(req));
    const type = req.query.payeeType;
    const status = req.query.status;
    return rows.filter(
      (a) => (!type || a.payee_type === type) && (!status || a.status === status),
    );
  }),
);

operations.post(
  "/payroll/advances",
  handle(async (req) => {
    const body = z
      .object({
        payee_type: z.enum(["teacher", "staff"]).default("teacher"),
        payee_id: z.string(),
        amount: z.coerce.number().positive(),
        date: z.string().refine(isDay, "date must be YYYY-MM-DD"),
        status: z.enum(["requested", "paid", "rejected"]).default("requested"),
        method: z.enum(methods).optional(),
        note: z.string().optional(),
      })
      .parse(req.body);
    await payeeInScope(req, body.payee_type, body.payee_id);
    return payroll.createAdvance(body);
  }),
);

operations.post(
  "/payroll/advances/:id/decision",
  handle(async (req) => {
    const body = z
      .object({
        decision: z.enum(["paid", "rejected"]),
        date: z.string().refine(isDay).optional(),
        method: z.enum(methods).optional(),
      })
      .parse(req.body);
    const advance = await prisma.teacherAdvance.findUnique({ where: { id: req.params.id } });
    ensureInScope(req, advance?.instituteId);
    return payroll.decideAdvance(req.params.id, body.decision, body);
  }),
);

operations.get("/payroll/payouts", handle(async (req) => payroll.teacherPayoutSummaries(scopeOf(req))));

/** Settles a payee's salary for a cycle (net of advances dated on/before paid_on). */
operations.post(
  "/payroll/payouts",
  handle(async (req) => {
    const body = z
      .object({
        payee_type: z.enum(["teacher", "staff"]),
        payee_id: z.string(),
        period: z.string().refine(isPeriod, "period must be YYYY-MM"),
        paid_on: z.string().refine(isDay, "paid_on must be YYYY-MM-DD"),
        method: z.enum(methods),
        reference: z.string().optional(),
        /** Paid now; defaults to the full net. */
        amount: z.coerce.number().min(0).optional(),
      })
      .parse(req.body);
    await payeeInScope(req, body.payee_type, body.payee_id);
    return payroll.settlePayout(body);
  }),
);

/** Pays some or all of what is still owed on a part-paid salary. */
operations.post(
  "/payroll/payouts/:id/payments",
  handle(async (req) => {
    const body = z
      .object({
        amount: z.coerce.number().positive(),
        paid_on: z.string().refine(isDay, "paid_on must be YYYY-MM-DD"),
        method: z.enum(methods),
        reference: z.string().optional(),
      })
      .parse(req.body);
    return payroll.payPayoutBalance(req.params.id, body, optionalScope(req));
  }),
);

operations.get("/payroll/payouts/:id/receipt", handle(async (req) => payroll.payoutReceipt(req.params.id, optionalScope(req))));

/* -------------------------------- dashboard ------------------------------- */

operations.get("/dashboard", handle(async (req) => dashboard(scopeOf(req))));
