/**
 * Scoped loaders that return rows already in API shape. Reports and the fee
 * ledger work on these plain arrays, so the business rules read the same as
 * they did in the web app's local store.
 */
import type { Prisma } from "../generated/prisma";
import { prisma, type Db } from "../db";
import { scoped } from "../http";
import {
  advanceOut,
  chargeOut,
  classOut,
  enrollmentOut,
  instituteOut,
  paymentOut,
  payoutOut,
  staffOut,
  studentOut,
  subjectOut,
  teacherOut,
} from "../mappers";

export const loadInstitutes = async (db: Db = prisma) =>
  (await db.institute.findMany({ orderBy: { createdAt: "asc" } })).map(instituteOut);

export const loadSubjects = async (scope?: string, db: Db = prisma) =>
  (await db.subject.findMany({ where: scoped(scope), orderBy: { id: "asc" } })).map(subjectOut);

export const loadTeachers = async (scope?: string, db: Db = prisma) =>
  (await db.teacher.findMany({ where: scoped(scope), orderBy: { id: "asc" } })).map(teacherOut);

export const loadStaff = async (scope?: string, db: Db = prisma) =>
  (await db.staff.findMany({ where: scoped(scope), orderBy: { id: "asc" } })).map(staffOut);

/** Classes with their head-count (active enrolments). */
export async function loadClasses(where: Prisma.ClassWhereInput = {}, db: Db = prisma) {
  const rows = await db.class.findMany({
    where,
    orderBy: { id: "asc" },
    include: { _count: { select: { enrollments: { where: { status: "ACTIVE" } } } } },
  });
  return rows.map((r) => classOut(r, r._count.enrollments));
}

export const loadEnrollments = async (where: Prisma.EnrollmentWhereInput = {}, db: Db = prisma) =>
  (await db.enrollment.findMany({ where, orderBy: { id: "asc" } })).map(enrollmentOut);

/** Students with their enrolments attached. */
export async function loadStudents(where: Prisma.StudentWhereInput = {}, db: Db = prisma) {
  const rows = await db.student.findMany({
    where,
    orderBy: { id: "asc" },
    include: { enrollments: { orderBy: { id: "asc" } } },
  });
  return rows.map((r) => studentOut(r, r.enrollments));
}

export const loadCharges = async (where: Prisma.PaymentWhereInput = {}, db: Db = prisma) =>
  (await db.payment.findMany({ where, orderBy: { id: "asc" } })).map(chargeOut);

/** Money received, each with its allocations to bills. */
export const loadPayments = async (where: Prisma.PaymentTransactionWhereInput = {}, db: Db = prisma) =>
  (
    await db.paymentTransaction.findMany({
      where,
      orderBy: { receivedAt: "asc" },
      include: { allocations: { orderBy: { id: "asc" } } },
    })
  ).map(paymentOut);

export const loadAdvances = async (where: Prisma.TeacherAdvanceWhereInput = {}, db: Db = prisma) =>
  (await db.teacherAdvance.findMany({ where, orderBy: { id: "asc" } })).map(advanceOut);

export const loadPayouts = async (where: Prisma.PayoutWhereInput = {}, db: Db = prisma) =>
  (await db.payout.findMany({ where, orderBy: { id: "asc" } })).map(payoutOut);
