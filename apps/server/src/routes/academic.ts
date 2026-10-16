/** Exams, exam results, topics, the academic summary, and support tickets. */
import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db";
import { assertInScope, badRequest, handle, optionalScope, scopeOf, scoped } from "../http";
import { isDay } from "../lib/calendar";
import { toDate } from "../mappers";
import { ensureInScope } from "../auth/guard";
import { academicSummary, examOut, examResultOut, ticketOut, topicOut } from "../services/academic";

export const academic = Router();

academic.get("/academic/summary", handle(async (req) => academicSummary(scopeOf(req))));

academic.get(
  "/exams",
  handle(async (req) =>
    (await prisma.exam.findMany({ where: scoped(scopeOf(req)), orderBy: { date: "desc" } })).map(examOut),
  ),
);

academic.post(
  "/exams",
  handle(async (req) => {
    const body = z
      .object({
        class_id: z.string(),
        name: z.string().min(1),
        date: z.string().refine(isDay, "date must be YYYY-MM-DD"),
        total_marks: z.coerce.number().positive(),
        passing_marks: z.coerce.number().min(0),
      })
      .parse(req.body);
    const klass = await prisma.class.findUnique({ where: { id: body.class_id } });
    if (!klass) throw badRequest("Class not found.");
    ensureInScope(req, klass.instituteId);
    if (body.passing_marks > body.total_marks) throw badRequest("Passing marks can't exceed total marks.");
    const exam = await prisma.exam.create({
      data: {
        instituteId: klass.instituteId,
        classId: klass.id,
        name: body.name.trim(),
        date: toDate(body.date),
        totalMarks: Math.round(body.total_marks),
        passingMarks: Math.round(body.passing_marks),
      },
    });
    return examOut(exam);
  }),
);

academic.delete(
  "/exams/:id",
  handle(async (req) => (await prisma.exam.deleteMany({ where: { id: req.params.id, ...scoped(optionalScope(req)) } })).count > 0),
);

academic.get(
  "/exam-results",
  handle(async (req) =>
    (await prisma.examResult.findMany({ where: scoped(scopeOf(req)), orderBy: { id: "asc" } })).map(examResultOut),
  ),
);

academic.get(
  "/topics",
  handle(async (req) => (await prisma.topic.findMany({ where: scoped(scopeOf(req)), orderBy: { id: "asc" } })).map(topicOut)),
);

academic.post(
  "/topics",
  handle(async (req) => {
    const body = z.object({ subject_id: z.string(), name: z.string().min(1) }).parse(req.body);
    const subject = await prisma.subject.findUnique({ where: { id: body.subject_id } });
    if (!subject) throw badRequest("Subject not found.");
    ensureInScope(req, subject.instituteId);
    return topicOut(
      await prisma.topic.create({ data: { instituteId: subject.instituteId, subjectId: subject.id, name: body.name.trim() } }),
    );
  }),
);

/* --------------------------------- support -------------------------------- */

academic.get(
  "/tickets",
  handle(async (req) =>
    (await prisma.supportTicket.findMany({ where: scoped(scopeOf(req)), orderBy: { createdAt: "desc" } })).map(ticketOut),
  ),
);

academic.post(
  "/tickets",
  handle(async (req) => {
    const body = z
      .object({
        institute_id: z.string(),
        subject: z.string().min(1),
        description: z.string().default(""),
        priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
      })
      .parse(req.body);
    ensureInScope(req, body.institute_id);
    if (!(await prisma.institute.findUnique({ where: { id: body.institute_id } }))) throw badRequest("Choose an institute.");
    const ticket = await prisma.supportTicket.create({
      data: {
        instituteId: body.institute_id,
        userId: req.auth?.user.id ?? null,
        subject: body.subject.trim(),
        description: body.description.trim(),
        priority: body.priority.toUpperCase() as "MEDIUM",
      },
    });
    return ticketOut(ticket);
  }),
);

academic.patch(
  "/tickets/:id",
  handle(async (req) => {
    const body = z.object({ status: z.enum(["open", "in_progress", "resolved", "closed"]) }).parse(req.body);
    assertInScope(await prisma.supportTicket.findUnique({ where: { id: req.params.id } }), optionalScope(req), "Ticket");
    return ticketOut(
      await prisma.supportTicket.update({
        where: { id: req.params.id },
        data: { status: body.status.toUpperCase() as "OPEN" },
      }),
    );
  }),
);
