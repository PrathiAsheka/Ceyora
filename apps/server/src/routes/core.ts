/**
 * CRUD for institutes, subjects, teachers, staff, classes, students and
 * enrolments. Every list requires `?instituteId=` (an id or "all"); single
 * records accept it too and answer 404 when the record is in another
 * institute. Linked records (class -> subject / teacher, enrolment -> student
 * / class) must belong to the same institute.
 */
import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db";
import { ALL_INSTITUTES, assertInScope, badRequest, handle, notFound, optionalScope, scopeOf, scoped } from "../http";
import {
  classIn,
  enrollmentOut,
  instituteIn,
  instituteOut,
  staffIn,
  staffOut,
  studentIn,
  studentOut,
  subjectOut,
  teacherIn,
  teacherOut,
  toDate,
  upper,
} from "../mappers";
import { loadClasses, loadStudents } from "../services/data";
import { ensureInScope, homeInstitute, ownClassIds } from "../auth/guard";
import { billNewEnrollment } from "../services/fees";
import type { Class, Institute, Staff, Student, Subject, Teacher } from "../dto";

export const core = Router();

/** Throws unless the institute exists (records never belong to "all"). */
async function requireInstitute(id: unknown): Promise<string> {
  if (typeof id !== "string" || !id || id === ALL_INSTITUTES || !(await prisma.institute.findUnique({ where: { id } }))) {
    throw badRequest("Choose the institute this record belongs to.");
  }
  return id;
}

function requireSame(instituteId: string, linked: { instituteId: string } | null, what: string) {
  if (!linked) throw badRequest(`${what} not found.`);
  if (linked.instituteId !== instituteId) throw badRequest(`${what} belongs to a different institute.`);
}

/** Next free student card number (CEY-STU-NNNN); never reuses a deleted one. */
async function nextQrCode(): Promise<string> {
  const codes = await prisma.student.findMany({ select: { qrCode: true } });
  const max = codes.reduce((m, s) => Math.max(m, Number(s.qrCode.replace(/\D+/g, "")) || 0), 0);
  return `CEY-STU-${String(max + 1).padStart(4, "0")}`;
}

const teacherCreate = (row: Partial<Teacher>) => {
  if (!row.first_name || !row.phone || !row.compensation_type) {
    throw badRequest("first_name, phone and compensation_type are required.");
  }
  return teacherIn(row) as ReturnType<typeof teacherIn> & { firstName: string; lastName: string; name: string };
};

/* ------------------------------- institutes ------------------------------- */

/** Institutes the account can see: all of them, or just its own. */
core.get(
  "/institutes",
  handle(async (req) => {
    const home = homeInstitute(req);
    const rows = await prisma.institute.findMany({ where: home ? { id: home } : {}, orderBy: { createdAt: "asc" } });
    return rows.map(instituteOut);
  }),
);

core.get(
  "/institutes/:id",
  handle(async (req) => {
    const home = homeInstitute(req);
    if (home && req.params.id !== home) return null;
    const row = await prisma.institute.findUnique({ where: { id: req.params.id } });
    return row ? instituteOut(row) : null;
  }),
);

const instituteSchema = z.object({ name: z.string().min(1) }).passthrough();

/** Creates an institute, optionally with its first subjects, teachers, students and classes. */
core.post(
  "/institutes",
  handle(async (req) => {
    const body = instituteSchema.parse(req.body) as unknown as Partial<Institute> & {
      initial?: {
        subjects?: Array<Partial<Subject>>;
        teachers?: Array<Partial<Teacher>>;
        students?: Array<Partial<Student>>;
        classes?: Array<Partial<Class>>;
      };
    };
    const created = await prisma.$transaction(async (tx) => {
      const inst = await tx.institute.create({ data: { ...instituteIn(body), name: body.name! } });
      const initial = body.initial;
      if (!initial) return inst;

      const subjectIds: string[] = [];
      for (const s of initial.subjects ?? []) {
        const row = await tx.subject.create({ data: { instituteId: inst.id, name: s.name ?? "Subject", code: s.code ?? null } });
        subjectIds.push(row.id);
      }
      const teacherIds: string[] = [];
      for (const t of initial.teachers ?? []) {
        const row = await tx.teacher.create({
          data: {
            instituteId: inst.id,
            ...teacherIn({ compensation_type: "percentage", compensation_value: 0, phone: "", subjects: [], ...t }),
          } as never,
        });
        teacherIds.push(row.id);
      }
      for (const s of initial.students ?? []) {
        const codes = await tx.student.findMany({ select: { qrCode: true } });
        const max = codes.reduce((m, r) => Math.max(m, Number(r.qrCode.replace(/\D+/g, "")) || 0), 0);
        await tx.student.create({
          data: {
            instituteId: inst.id,
            qrCode: `CEY-STU-${String(max + 1).padStart(4, "0")}`,
            ...studentIn({ guardian_name: "", guardian_phone: "", ...s }),
          } as never,
        });
      }
      for (const c of initial.classes ?? []) {
        // The starter form only collects names: link to the first subject /
        // teacher seeded above when none (or a foreign one) is given.
        const subject = c.subject_id ? await tx.subject.findUnique({ where: { id: c.subject_id } }) : null;
        const teacher = c.teacher_id ? await tx.teacher.findUnique({ where: { id: c.teacher_id } }) : null;
        const subjectId = subject?.instituteId === inst.id ? subject.id : subjectIds[0];
        if (!subjectId) continue;
        await tx.class.create({
          data: {
            instituteId: inst.id,
            ...classIn({ day_of_week: "Monday", time_slot: "", monthly_fee: 0, medium: "sinhala", ...c }),
            name: c.name ?? "Class",
            subjectId,
            teacherId: teacher?.instituteId === inst.id ? teacher.id : (teacherIds[0] ?? null),
          } as never,
        });
      }
      return inst;
    });
    return instituteOut(created);
  }),
);

core.patch(
  "/institutes/:id",
  handle(async (req) => {
    const row = await prisma.institute.update({ where: { id: req.params.id }, data: instituteIn(req.body ?? {}) });
    return instituteOut(row);
  }),
);

/** Deletes an institute and, by cascade, everything scoped to it. */
core.delete(
  "/institutes/:id",
  handle(async (req) => (await prisma.institute.deleteMany({ where: { id: req.params.id } })).count > 0),
);

/* -------------------------------- subjects -------------------------------- */

core.get(
  "/subjects",
  handle(async (req) =>
    (await prisma.subject.findMany({ where: scoped(scopeOf(req)), orderBy: { id: "asc" } })).map(subjectOut),
  ),
);

core.post(
  "/subjects",
  handle(async (req) => {
    const body = req.body as Partial<Subject>;
    const instituteId = await requireInstitute(body.institute_id);
    if (!body.name) throw badRequest("name is required.");
    return subjectOut(await prisma.subject.create({ data: { instituteId, name: body.name, code: body.code ?? null } }));
  }),
);

core.patch(
  "/subjects/:id",
  handle(async (req) => {
    const body = req.body as Partial<Subject>;
    assertInScope(await prisma.subject.findUnique({ where: { id: req.params.id } }), optionalScope(req), "Subject");
    const row = await prisma.subject.update({
      where: { id: req.params.id },
      data: { ...(body.name !== undefined && { name: body.name }), ...(body.code !== undefined && { code: body.code || null }) },
    });
    return subjectOut(row);
  }),
);

core.delete(
  "/subjects/:id",
  handle(async (req) => (await prisma.subject.deleteMany({ where: { id: req.params.id, ...scoped(optionalScope(req)) } })).count > 0),
);

/* -------------------------------- teachers -------------------------------- */

core.get(
  "/teachers",
  handle(async (req) =>
    (await prisma.teacher.findMany({ where: scoped(scopeOf(req)), orderBy: { id: "asc" } })).map(teacherOut),
  ),
);

core.get(
  "/teachers/:id",
  handle(async (req) => {
    const row = await prisma.teacher.findUnique({ where: { id: req.params.id } });
    return row && assertInScope(row, optionalScope(req), "Teacher") ? teacherOut(row) : null;
  }),
);

core.post(
  "/teachers",
  handle(async (req) => {
    const body = req.body as Partial<Teacher>;
    const instituteId = await requireInstitute(body.institute_id);
    return teacherOut(await prisma.teacher.create({ data: { instituteId, ...teacherCreate(body) } as never }));
  }),
);

core.patch(
  "/teachers/:id",
  handle(async (req) => {
    const current = assertInScope(
      await prisma.teacher.findUnique({ where: { id: req.params.id } }),
      optionalScope(req),
      "Teacher",
    );
    const row = await prisma.teacher.update({ where: { id: current.id }, data: teacherIn(req.body ?? {}, current) });
    return teacherOut(row);
  }),
);

/** Removes a teacher; their classes stay, unassigned (teacher_id SET NULL). */
core.delete(
  "/teachers/:id",
  handle(async (req) => (await prisma.teacher.deleteMany({ where: { id: req.params.id, ...scoped(optionalScope(req)) } })).count > 0),
);

/* --------------------------------- staff ---------------------------------- */

core.get(
  "/staff",
  handle(async (req) => {
    const status = req.query.status === "active" || req.query.status === "inactive" ? upper(req.query.status) : undefined;
    const rows = (
      await prisma.staff.findMany({ where: { ...scoped(scopeOf(req)), ...(status && { status: status as "ACTIVE" }) } })
    ).map(staffOut);
    return rows.sort(
      (a, b) =>
        Number(a.status === "inactive") - Number(b.status === "inactive") ||
        `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`),
    );
  }),
);

core.get(
  "/staff/:id",
  handle(async (req) => {
    const row = await prisma.staff.findUnique({ where: { id: req.params.id } });
    return row && assertInScope(row, optionalScope(req), "Staff member") ? staffOut(row) : null;
  }),
);

core.post(
  "/staff",
  handle(async (req) => {
    const body = req.body as Partial<Staff>;
    const instituteId = await requireInstitute(body.institute_id);
    if (!body.first_name || !body.role || !body.phone || !body.pay_type || body.pay_rate === undefined) {
      throw badRequest("first_name, role, phone, pay_type and pay_rate are required.");
    }
    const row = await prisma.staff.create({
      data: {
        instituteId,
        ...staffIn({ status: "active", joined_on: new Date().toISOString().slice(0, 10), ...body }),
      } as never,
    });
    return staffOut(row);
  }),
);

core.patch(
  "/staff/:id",
  handle(async (req) => {
    const current = assertInScope(
      await prisma.staff.findUnique({ where: { id: req.params.id } }),
      optionalScope(req),
      "Staff member",
    );
    return staffOut(await prisma.staff.update({ where: { id: current.id }, data: staffIn(req.body ?? {}, current) }));
  }),
);

core.delete(
  "/staff/:id",
  handle(async (req) => (await prisma.staff.deleteMany({ where: { id: req.params.id, ...scoped(optionalScope(req)) } })).count > 0),
);

/* -------------------------------- classes --------------------------------- */

core.get(
  "/classes",
  handle(async (req) => {
    const where = scoped(scopeOf(req));
    const grade = typeof req.query.grade === "string" ? req.query.grade : undefined;
    const own = await ownClassIds(req);
    return loadClasses({ ...where, ...(grade && { grade }), ...(own && { id: { in: [...own] } }) });
  }),
);

core.get(
  "/classes/:id",
  handle(async (req) => {
    const [row] = await loadClasses({ id: req.params.id });
    if (!row) return null;
    assertInScope({ instituteId: row.institute_id }, optionalScope(req), "Class");
    return row;
  }),
);

/** Creates a class; its subject and (optional) teacher must be in the same institute. */
core.post(
  "/classes",
  handle(async (req) => {
    const body = req.body as Partial<Class>;
    const instituteId = await requireInstitute(body.institute_id);
    if (!body.name || !body.subject_id || !body.medium || !body.day_of_week || body.monthly_fee === undefined) {
      throw badRequest("name, subject_id, medium, day_of_week and monthly_fee are required.");
    }
    requireSame(instituteId, await prisma.subject.findUnique({ where: { id: body.subject_id } }), "Subject");
    if (body.teacher_id) requireSame(instituteId, await prisma.teacher.findUnique({ where: { id: body.teacher_id } }), "Teacher");
    const row = await prisma.class.create({
      data: { instituteId, ...classIn({ time_slot: "", ...body }) } as never,
    });
    return (await loadClasses({ id: row.id }))[0];
  }),
);

core.patch(
  "/classes/:id",
  handle(async (req) => {
    const body = req.body as Partial<Class>;
    const current = assertInScope(
      await prisma.class.findUnique({ where: { id: req.params.id } }),
      optionalScope(req),
      "Class",
    );
    if (body.subject_id) requireSame(current.instituteId, await prisma.subject.findUnique({ where: { id: body.subject_id } }), "Subject");
    if (body.teacher_id) requireSame(current.instituteId, await prisma.teacher.findUnique({ where: { id: body.teacher_id } }), "Teacher");
    await prisma.class.update({ where: { id: current.id }, data: classIn(body) });
    return (await loadClasses({ id: current.id }))[0];
  }),
);

/** Removes a class with its enrolments, attendance and bills (cascade). */
core.delete(
  "/classes/:id",
  handle(async (req) => (await prisma.class.deleteMany({ where: { id: req.params.id, ...scoped(optionalScope(req)) } })).count > 0),
);

/* -------------------------------- students -------------------------------- */

core.get(
  "/students",
  handle(async (req) => {
    const where = scoped(scopeOf(req));
    const classId = typeof req.query.classId === "string" ? req.query.classId : undefined;
    // "Own classes only" teachers see just the students in their classes.
    const own = await ownClassIds(req);
    if (own && classId && !own.has(classId)) return [];
    const classFilter = classId ? { classId } : own ? { classId: { in: [...own] } } : null;
    return loadStudents({
      ...where,
      ...(classFilter && { enrollments: { some: { ...classFilter, status: "ACTIVE" as const } } }),
    });
  }),
);

core.get(
  "/students/:id",
  handle(async (req) => {
    const [row] = await loadStudents({ id: req.params.id });
    if (!row) return null;
    assertInScope({ instituteId: row.institute_id }, optionalScope(req), "Student");
    return row;
  }),
);

core.post(
  "/students",
  handle(async (req) => {
    const body = req.body as Partial<Student> & { class_id?: string };
    const instituteId = await requireInstitute(body.institute_id);
    if (!body.first_name || !body.guardian_name || !body.guardian_phone) {
      throw badRequest("first_name, guardian_name and guardian_phone are required.");
    }
    const row = await prisma.student.create({
      data: { instituteId, qrCode: await nextQrCode(), ...studentIn(body) } as never,
    });
    if (body.class_id) {
      requireSame(instituteId, await prisma.class.findUnique({ where: { id: body.class_id } }), "Class");
      await enroll(row.id, body.class_id, "active", new Date().toISOString().slice(0, 10));
    }
    return (await loadStudents({ id: row.id }))[0];
  }),
);

/** Updates profile fields. A student can't move institute (their records live there). */
core.patch(
  "/students/:id",
  handle(async (req) => {
    const current = assertInScope(
      await prisma.student.findUnique({ where: { id: req.params.id } }),
      optionalScope(req),
      "Student",
    );
    await prisma.student.update({ where: { id: current.id }, data: studentIn(req.body ?? {}, current) });
    return (await loadStudents({ id: current.id }))[0];
  }),
);

/** Removes a student with their enrolments, attendance, bills and payments (cascade). */
core.delete(
  "/students/:id",
  handle(async (req) => (await prisma.student.deleteMany({ where: { id: req.params.id, ...scoped(optionalScope(req)) } })).count > 0),
);

/* ------------------------------- enrolments ------------------------------- */

/**
 * Enrols a student (re-activating an old enrolment if there is one). When the
 * current month has already been billed for the institute, the student is
 * billed for it straight away and any credit they hold is applied.
 */
async function enroll(studentId: string, classId: string, status: string, enrolledAt: string) {
  return prisma.$transaction(async (tx) => {
    const existing = await tx.enrollment.findUnique({ where: { studentId_classId: { studentId, classId } } });
    if (existing?.status === "ACTIVE") return existing;
    const klass = await tx.class.findUniqueOrThrow({ where: { id: classId } });
    const row = existing
      ? await tx.enrollment.update({ where: { id: existing.id }, data: { status: upper(status) } })
      : await tx.enrollment.create({
          data: {
            instituteId: klass.instituteId,
            studentId,
            classId,
            enrolledAt: toDate(enrolledAt),
            status: upper(status),
          } as never,
        });
    await tx.student.updateMany({ where: { id: studentId, classId: null }, data: { classId } });
    if (row.status === "ACTIVE") await billNewEnrollment(tx, studentId, classId);
    return row;
  });
}

core.get(
  "/enrollments",
  handle(async (req) =>
    (await prisma.enrollment.findMany({ where: scoped(scopeOf(req)), orderBy: { id: "asc" } })).map(enrollmentOut),
  ),
);

core.post(
  "/enrollments",
  handle(async (req) => {
    const body = req.body as { student_id?: string; class_id?: string; status?: string; enrolled_at?: string };
    if (!body.student_id || !body.class_id) throw badRequest("student_id and class_id are required.");
    const klass = await prisma.class.findUnique({ where: { id: body.class_id } });
    if (!klass) throw notFound("Class");
    ensureInScope(req, klass.instituteId);
    requireSame(klass.instituteId, await prisma.student.findUnique({ where: { id: body.student_id } }), "Student");
    const row = await enroll(
      body.student_id,
      body.class_id,
      body.status ?? "active",
      body.enrolled_at ?? new Date().toISOString().slice(0, 10),
    );
    return enrollmentOut(row);
  }),
);

core.patch(
  "/enrollments/:id",
  handle(async (req) => {
    const status = (req.body as { status?: string }).status;
    if (!status) throw badRequest("status is required.");
    assertInScope(await prisma.enrollment.findUnique({ where: { id: req.params.id } }), optionalScope(req), "Enrolment");
    return enrollmentOut(await prisma.enrollment.update({ where: { id: req.params.id }, data: { status: upper(status) } }));
  }),
);

core.delete(
  "/enrollments/:id",
  handle(async (req) => (await prisma.enrollment.deleteMany({ where: { id: req.params.id, ...scoped(optionalScope(req)) } })).count > 0),
);
