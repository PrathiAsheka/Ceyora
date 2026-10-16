/**
 * Loads the web app's demo dataset (apps/web/lib/mock-data.ts: 4 institutes,
 * grades 6-11, September/October 2026 fees with rollovers, attendance,
 * expenses, staff and advances) into PostgreSQL with the same ids, so the
 * API and the local demo show identical numbers.
 *
 * Run with `npm run db:seed` (it resolves the web app's "@/..." imports via
 * the web tsconfig). Existing rows are wiped first.
 */
import { PrismaClient } from "../src/generated/prisma";
import * as seed from "../../web/lib/mock-data";

const prisma = new PrismaClient();
const U = (v: string) => v.toUpperCase() as never;
const date = (v: string) => new Date(`${v.slice(0, 10)}T00:00:00.000Z`);
const ts = (v: string) => new Date(v);
const nul = <T>(v: T | undefined) => (v === undefined || v === "" ? null : v);

async function chunked<T>(rows: T[], write: (batch: T[]) => Promise<unknown>, size = 1000) {
  for (let i = 0; i < rows.length; i += size) await write(rows.slice(i, i + size));
}

async function main() {
  console.log("Clearing existing data...");
  await prisma.institute.deleteMany();

  await prisma.institute.createMany({
    data: seed.institutes.map((i) => ({
      id: i.id,
      name: i.name,
      logo: nul(i.logo_url),
      address: nul(i.address),
      cutOffDay: i.billing_cut_off_day,
      registrationNumber: nul(i.registration_number),
      phone: nul(i.phone),
      email: nul(i.email),
      currency: i.currency,
      createdAt: ts(i.created_at),
      updatedAt: ts(i.updated_at),
    })),
  });

  await prisma.subject.createMany({
    data: seed.subjects.map((s) => ({ id: s.id, instituteId: s.institute_id, name: s.name, code: nul(s.code) })),
  });

  await prisma.teacher.createMany({
    data: seed.teachers.map((t) => ({
      id: t.id,
      instituteId: t.institute_id,
      name: `${t.first_name} ${t.last_name}`.trim(),
      firstName: t.first_name,
      lastName: t.last_name,
      phone: t.phone,
      whatsapp: nul(t.whatsapp),
      email: nul(t.email),
      nic: nul(t.nic),
      rateType: U(t.compensation_type),
      rate: t.compensation_value,
      subjectIds: t.subjects,
      bankName: nul(t.bank_name),
      bankAccount: nul(t.bank_account),
      createdAt: ts(t.created_at),
    })),
  });

  await prisma.staff.createMany({
    data: seed.staff.map((m) => ({
      id: m.id,
      instituteId: m.institute_id,
      name: `${m.first_name} ${m.last_name}`.trim(),
      firstName: m.first_name,
      lastName: m.last_name,
      role: m.role,
      phone: m.phone,
      whatsapp: nul(m.whatsapp),
      email: nul(m.email),
      nic: nul(m.nic),
      salary: m.pay_rate,
      payType: U(m.pay_type),
      unitsPerMonth: m.units_per_month ?? null,
      status: U(m.status),
      joinedOn: date(m.joined_on),
      createdAt: ts(m.created_at),
    })),
  });

  await prisma.class.createMany({
    data: seed.classes.map((c) => ({
      id: c.id,
      instituteId: c.institute_id,
      name: c.name,
      grade: nul(c.grade),
      subjectId: c.subject_id,
      medium: U(c.medium),
      teacherId: nul(c.teacher_id),
      dayOfWeek: c.day_of_week,
      timeSlot: c.time_slot,
      hall: nul(c.hall),
      monthlyFee: c.monthly_fee,
      createdAt: ts(c.created_at),
    })),
  });

  const firstClass = new Map<string, string>();
  for (const e of seed.enrollments) if (!firstClass.has(e.student_id)) firstClass.set(e.student_id, e.class_id);

  await chunked(seed.students, (batch) =>
    prisma.student.createMany({
      data: batch.map((s) => ({
        id: s.id,
        instituteId: s.institute_id,
        classId: firstClass.get(s.id) ?? null,
        name: `${s.first_name} ${s.last_name}`.trim(),
        firstName: s.first_name,
        lastName: s.last_name,
        parentName: s.guardian_name,
        parentPhone: s.guardian_phone,
        parentWhatsapp: nul(s.guardian_whatsapp),
        school: nul(s.school),
        dateOfBirth: s.date_of_birth ? date(s.date_of_birth) : null,
        qrCode: s.qr_code,
        createdAt: ts(s.created_at),
      })),
    }),
  );

  await chunked(seed.enrollments, (batch) =>
    prisma.enrollment.createMany({
      data: batch.map((e) => ({
        id: e.id,
        instituteId: e.institute_id,
        studentId: e.student_id,
        classId: e.class_id,
        enrolledAt: date(e.enrolled_at),
        status: U(e.status),
      })),
    }),
  );

  const applied = new Map<string, number>();
  for (const p of seed.payments) {
    for (const a of p.allocations) applied.set(a.fee_charge_id, (applied.get(a.fee_charge_id) ?? 0) + a.amount);
  }
  await chunked(seed.feeCharges, (batch) =>
    prisma.payment.createMany({
      data: batch.map((c) => {
        const paid = applied.get(c.id) ?? 0;
        return {
          id: c.id,
          instituteId: c.institute_id,
          studentId: c.student_id,
          classId: c.class_id,
          billingCycle: c.billing_period,
          grossAmount: c.amount,
          discount: c.discount,
          discountType: U(c.discount_type),
          discountReason: nul(c.discount_reason),
          amountBilled: c.net_amount,
          amountPaid: paid,
          balance: Math.max(0, c.net_amount - paid),
          status: U(c.status),
          dueDate: date(c.due_date),
          createdAt: ts(c.created_at),
        };
      }),
    }),
  );

  await chunked(seed.payments, (batch) =>
    prisma.paymentTransaction.createMany({
      data: batch.map((p) => ({
        id: p.id,
        instituteId: p.institute_id,
        studentId: p.student_id,
        amount: p.amount,
        method: U(p.payment_method),
        reference: nul(p.reference_number),
        receivedAt: ts(p.created_at),
      })),
    }),
  );
  await chunked(
    seed.payments.flatMap((p) => p.allocations),
    (batch) =>
      prisma.paymentAllocation.createMany({
        data: batch.map((a) => ({
          id: a.id,
          transactionId: a.payment_id,
          paymentId: a.fee_charge_id,
          amount: a.amount,
        })),
      }),
  );

  await chunked(seed.attendance, (batch) =>
    prisma.attendance.createMany({
      data: batch.map((a) => ({
        id: a.id,
        instituteId: a.institute_id,
        classId: a.class_id,
        studentId: a.student_id,
        date: date(a.date),
        status: U(a.status),
        markedBy: U(a.marked_by),
        createdAt: ts(a.created_at),
      })),
    }),
  );

  await prisma.expense.createMany({
    data: seed.expenses.map((e) => ({
      id: e.id,
      instituteId: e.institute_id,
      title: e.description,
      category: e.category,
      amount: e.amount,
      status: U(e.status ?? "paid"),
      date: date(e.date),
      dueDate: e.due_date ? date(e.due_date) : null,
      paidOn: e.paid_on ? date(e.paid_on) : null,
      amountPaid: (e.status ?? "paid") === "paid" ? e.amount : (e.amount_paid ?? 0),
      payments:
        (e.status ?? "paid") === "paid"
          ? [{ id: `${e.id}_p1`, date: e.paid_on ?? e.date, amount: e.amount, ...(e.payment_method && { method: e.payment_method }) }]
          : [],
      vendor: nul(e.vendor),
      method: e.payment_method ? U(e.payment_method) : null,
      classId: nul(e.class_id),
      teacherId: nul(e.teacher_id),
      createdAt: ts(e.created_at),
    })),
  });

  await prisma.teacherAdvance.createMany({
    data: seed.teacherAdvances.map((a) => ({
      id: a.id,
      instituteId: a.institute_id,
      payeeType: U(a.payee_type),
      teacherId: a.payee_type === "teacher" ? a.payee_id : null,
      staffId: a.payee_type === "staff" ? a.payee_id : null,
      amount: a.amount,
      date: date(a.date),
      status: U(a.status),
      deducted: a.deducted,
      settled: a.deducted >= a.amount,
      method: a.method ? U(a.method) : null,
      note: nul(a.note),
      createdAt: ts(a.created_at),
    })),
  });

  await prisma.topic.createMany({
    data: seed.topics.map((t) => ({ id: t.id, instituteId: t.institute_id, subjectId: t.subject_id, name: t.name })),
  });
  await prisma.exam.createMany({
    data: seed.exams.map((e) => ({
      id: e.id,
      instituteId: e.institute_id,
      classId: e.class_id,
      name: e.name,
      date: date(e.date),
      totalMarks: e.total_marks,
      passingMarks: e.passing_marks,
      createdAt: ts(e.created_at),
    })),
  });
  await chunked(seed.examResults, (batch) =>
    prisma.examResult.createMany({
      data: batch.map((r) => ({
        id: r.id,
        instituteId: r.institute_id,
        examId: r.exam_id,
        studentId: r.student_id,
        marks: r.marks,
        grade: nul(r.grade),
        createdAt: ts(r.created_at),
      })),
    }),
  );
  await chunked(seed.topicResults, (batch) =>
    prisma.topicResult.createMany({
      data: batch.map((r) => ({ id: r.id, examResultId: r.exam_result_id, topicId: r.topic_id, marks: r.marks })),
    }),
  );
  await prisma.supportTicket.createMany({
    data: seed.supportTickets.map((t) => ({
      id: t.id,
      instituteId: t.institute_id,
      userId: null,
      subject: t.subject,
      description: t.description,
      status: U(t.status),
      priority: U(t.priority),
      createdAt: ts(t.created_at),
      updatedAt: ts(t.updated_at),
    })),
  });

  const counts = {
    institutes: seed.institutes.length,
    classes: seed.classes.length,
    teachers: seed.teachers.length,
    staff: seed.staff.length,
    students: seed.students.length,
    bills: seed.feeCharges.length,
    transactions: seed.payments.length,
    attendance: seed.attendance.length,
    expenses: seed.expenses.length,
    advances: seed.teacherAdvances.length,
    exams: seed.exams.length,
    examResults: seed.examResults.length,
    tickets: seed.supportTickets.length,
  };
  console.log("Seeded:", counts);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
