/** Dashboard KPIs and attendance rollups. */
import { prisma } from "../db";
import { ALL_INSTITUTES, isAll, scoped } from "../http";
import { attendanceOut, expenseOut } from "../mappers";
import { currentPeriod } from "../lib/calendar";
import {
  loadAdvances,
  loadCharges,
  loadClasses,
  loadPayments,
  loadPayouts,
} from "./data";
import { paidByCharge } from "./fees";
import { teacherPayoutSummaries } from "./payroll";
import { averageMarkByClass } from "./academic";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** The seven "YYYY-MM" cycles ending with the current one, oldest first. */
function trendPeriods(): string[] {
  const [y, m] = currentPeriod().split("-").map(Number);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.UTC(y, m - 1 - (6 - i), 1));
    return d.toISOString().slice(0, 7);
  });
}

/**
 * KPIs for an institute (or all): head-counts, money in and out, fee
 * collection, a seven-month income / expense trend and per-class performance.
 */
export async function dashboard(scope?: string) {
  const where = scoped(scope);
  const [students, teachers, institutes, classes, charges, payments, expenses, attendance, payouts, advances] =
    await Promise.all([
      prisma.student.count({ where }),
      prisma.teacher.count({ where }),
      prisma.institute.findMany({ select: { id: true, name: true } }),
      loadClasses(where),
      loadCharges(where),
      loadPayments(where),
      prisma.expense.findMany({ where }).then((rows) => rows.map(expenseOut)),
      prisma.attendance.findMany({ where }).then((rows) => rows.map(attendanceOut)),
      loadPayouts(where),
      loadAdvances(where),
    ]);

  const paid = paidByCharge(payments);
  const income = payments.reduce((s, p) => s + p.amount, 0);
  const billed = charges.reduce((s, c) => s + c.net_amount, 0);
  const collected = charges.reduce((s, c) => s + Math.min(c.net_amount, paid.get(c.id) ?? 0), 0);

  // Per-student balances, so one student's credit doesn't hide another's due.
  const balances = new Map<string, number>();
  for (const c of charges) balances.set(c.student_id, (balances.get(c.student_id) ?? 0) + c.net_amount);
  for (const p of payments) balances.set(p.student_id, (balances.get(p.student_id) ?? 0) - p.amount);
  const outstanding = [...balances.values()].reduce((s, b) => s + Math.max(0, b), 0);
  const credit = [...balances.values()].reduce((s, b) => s + Math.max(0, -b), 0);

  const expenseBills = expenses.reduce((s, e) => s + e.amount, 0);
  // Still owed on bills, and salary actually handed over (instalments count as paid).
  const expenseUnpaid = expenses.reduce((s, e) => s + Math.max(0, e.amount - (e.amount_paid ?? 0)), 0);
  const payrollPaid = payouts.reduce((s, p) => s + (p.amount_paid ?? p.net), 0);
  const paidAdvances = advances.filter((a) => a.status === "paid");
  const advancesPaid = paidAdvances.reduce((s, a) => s + a.amount, 0);
  const totalExpenses = expenseBills + payrollPaid + advancesPaid;

  const stats = new Map<string, { present: number; marks: number; billed: number; paid: number }>();
  const stat = (id: string) => stats.get(id) ?? stats.set(id, { present: 0, marks: 0, billed: 0, paid: 0 }).get(id)!;
  for (const a of attendance) {
    const s = stat(a.class_id);
    s.marks += 1;
    if (a.status === "present" || a.status === "late") s.present += 1;
  }
  for (const c of charges) {
    const s = stat(c.class_id);
    s.billed += c.net_amount;
    s.paid += Math.min(c.net_amount, paid.get(c.id) ?? 0);
  }

  const trend = trendPeriods().map((period) => {
    const inMonth = (date: string) => date.startsWith(period);
    const monthIncome = payments.filter((p) => inMonth(p.created_at)).reduce((s, p) => s + p.amount, 0);
    const monthExpenses =
      expenses.filter((e) => inMonth(e.date)).reduce((s, e) => s + e.amount, 0) +
      payouts.filter((p) => inMonth(p.paid_on)).reduce((s, p) => s + p.net, 0) +
      paidAdvances.filter((a) => inMonth(a.date)).reduce((s, a) => s + a.amount, 0);
    return {
      month: MONTHS[Number(period.slice(5)) - 1],
      income: monthIncome,
      expenses: monthExpenses,
      net: monthIncome - monthExpenses,
    };
  });

  const examMarks = await averageMarkByClass(scope);
  const present = attendance.filter((a) => a.status === "present").length;
  const all = isAll(scope);
  return {
    institute_id: all ? ALL_INSTITUTES : scope,
    institute_name: all ? null : (institutes.find((i) => i.id === scope)?.name ?? null),
    total_students: students,
    total_teachers: teachers,
    total_classes: classes.length,
    total_institutes: institutes.length,
    income,
    expenses: totalExpenses,
    expense_bills: expenseBills,
    expense_unpaid: expenseUnpaid,
    payroll_paid: payrollPaid,
    advances_paid: advancesPaid,
    profit: income - totalExpenses,
    billed,
    collected,
    outstanding,
    credit,
    collection_rate: billed === 0 ? 0 : Math.round((collected / billed) * 100),
    attendance_rate: attendance.length ? Math.round((present / attendance.length) * 100) : 0,
    total_attendance_records: attendance.length,
    trend,
    performance: classes.map((c) => {
      const s = stats.get(c.id);
      return {
        class_id: c.id,
        attendance_rate: s?.marks ? Math.round((s.present / s.marks) * 100) : 0,
        fee_collection_rate: s?.billed ? Math.round((s.paid / s.billed) * 100) : 0,
        average_exam_mark: examMarks.get(c.id) ?? 0,
      };
    }),
    teacher_payouts: await teacherPayoutSummaries(scope),
  };
}

/** Per-class attendance rollup. */
export async function attendanceSummary(scope?: string) {
  const where = scoped(scope);
  const [rows, classes] = await Promise.all([
    prisma.attendance.findMany({ where }).then((r) => r.map(attendanceOut)),
    prisma.class.findMany({ where, select: { id: true, name: true } }),
  ]);
  const className = new Map(classes.map((c) => [c.id, c.name]));
  const isPresent = (s: string) => s === "present" || s === "late";

  const bucket = <K>(map: Map<K, { present: number; total: number }>, key: K, present: boolean) => {
    const b = map.get(key) ?? { present: 0, total: 0 };
    b.total += 1;
    if (present) b.present += 1;
    map.set(key, b);
  };
  const byClass = new Map<string, { present: number; total: number }>();
  const byDate = new Map<string, { present: number; total: number }>();
  const byStudent = new Map<string, { absent: number; total: number }>();
  for (const r of rows) {
    bucket(byClass, r.class_id, isPresent(r.status));
    bucket(byDate, r.date, isPresent(r.status));
    const s = byStudent.get(r.student_id) ?? { absent: 0, total: 0 };
    s.total += 1;
    if (r.status === "absent") s.absent += 1;
    byStudent.set(r.student_id, s);
  }
  const presentTotal = rows.filter((r) => isPresent(r.status)).length;
  const latest = [...byDate.keys()].sort().pop();

  return {
    institute_id: scope ?? ALL_INSTITUTES,
    total_records: rows.length,
    average_rate: rows.length ? Math.round((presentTotal / rows.length) * 100) : 0,
    today: latest ? { date: latest, present: byDate.get(latest)!.present, total: byDate.get(latest)!.total } : null,
    consecutive_absences: [...byStudent.values()].filter((b) => b.total >= 3 && b.absent / b.total >= 0.6).length,
    low_attendance_classes: [...byClass.values()].filter((b) => (b.total ? b.present / b.total < 0.75 : false))
      .length,
    by_class: [...byClass.entries()]
      .filter(([id]) => className.has(id))
      .map(([id, b]) => ({
        class_id: id,
        class_name: className.get(id) ?? id,
        present: b.present,
        total: b.total,
        rate: b.total ? Math.round((b.present / b.total) * 100) : 0,
      }))
      .sort((a, b) => b.rate - a.rate),
  };
}
