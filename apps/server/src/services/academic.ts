/** Exams, results, topics and the academic rollup (marks, pass rate, weak topics). */
import { prisma } from "../db";
import { scoped } from "../http";
import { day } from "../mappers";
import type { Exam, ExamResult, SupportTicket, Topic } from "../dto";
import type {
  Exam as DbExam,
  ExamResult as DbExamResult,
  SupportTicket as DbTicket,
  Topic as DbTopic,
} from "../generated/prisma";

export const examOut = (e: DbExam): Exam => ({
  id: e.id,
  institute_id: e.instituteId,
  name: e.name,
  class_id: e.classId,
  date: day(e.date),
  total_marks: e.totalMarks,
  passing_marks: e.passingMarks,
  created_at: e.createdAt.toISOString(),
});

export const examResultOut = (r: DbExamResult): ExamResult => ({
  id: r.id,
  institute_id: r.instituteId,
  exam_id: r.examId,
  student_id: r.studentId,
  marks: r.marks,
  grade: r.grade ?? undefined,
  created_at: r.createdAt.toISOString(),
});

export const topicOut = (t: DbTopic): Topic => ({
  id: t.id,
  institute_id: t.instituteId,
  name: t.name,
  subject_id: t.subjectId,
});

export const ticketOut = (t: DbTicket): SupportTicket => ({
  id: t.id,
  institute_id: t.instituteId,
  user_id: t.userId ?? "",
  subject: t.subject,
  description: t.description,
  status: t.status.toLowerCase() as SupportTicket["status"],
  priority: t.priority.toLowerCase() as SupportTicket["priority"],
  created_at: t.createdAt.toISOString(),
  updated_at: t.updatedAt.toISOString(),
});

/** Average exam mark (percent) per class, for the dashboard's class performance. */
export async function averageMarkByClass(scope?: string): Promise<Map<string, number>> {
  const exams = await prisma.exam.findMany({ where: scoped(scope), include: { results: { select: { marks: true } } } });
  const marks = new Map<string, number[]>();
  for (const exam of exams) {
    for (const r of exam.results) marks.set(exam.classId, [...(marks.get(exam.classId) ?? []), r.marks]);
  }
  return new Map([...marks].map(([classId, list]) => [classId, Math.round(list.reduce((a, b) => a + b, 0) / list.length)]));
}

/** Academic rollup for the scope: marks, pass rate, top performers, weak topics, exams. */
export async function academicSummary(scope?: string) {
  const where = scoped(scope);
  const [exams, results, students, classes, topics, subjects] = await Promise.all([
    prisma.exam.findMany({ where }),
    prisma.examResult.findMany({ where, orderBy: { id: "asc" }, include: { topicResults: true } }),
    prisma.student.findMany({ where, select: { id: true, firstName: true, lastName: true } }),
    prisma.class.findMany({ where, select: { id: true, name: true } }),
    prisma.topic.findMany({ where }),
    prisma.subject.findMany({ where, select: { id: true, name: true } }),
  ]);
  const examById = new Map(exams.map((e) => [e.id, e]));
  const studentName = new Map(students.map((s) => [s.id, `${s.firstName} ${s.lastName}`]));
  const className = new Map(classes.map((c) => [c.id, c.name]));

  const rows = results.map((r) => {
    const exam = examById.get(r.examId);
    const percentage = exam && exam.totalMarks > 0 ? Math.round((r.marks / exam.totalMarks) * 100) : 0;
    return {
      id: r.id,
      exam: exam?.name ?? "-",
      exam_date: exam ? day(exam.date) : "-",
      class_name: (exam && className.get(exam.classId)) ?? "-",
      student: studentName.get(r.studentId) ?? "-",
      marks: r.marks,
      total_marks: exam?.totalMarks ?? 0,
      percentage,
      passed: exam ? r.marks >= exam.passingMarks : false,
    };
  });

  const avgPercentage = rows.length ? Math.round(rows.reduce((s, r) => s + r.percentage, 0) / rows.length) : 0;
  const passRate = rows.length ? Math.round((rows.filter((r) => r.passed).length / rows.length) * 100) : 0;

  const byStudent = new Map<string, { name: string; total: number }>();
  for (const r of rows) {
    const entry = byStudent.get(r.student) ?? { name: r.student, total: 0 };
    entry.total += r.percentage;
    byStudent.set(r.student, entry);
  }
  const topPerformers = [...byStudent.values()]
    .map((e) => ({ student: e.name, average: Math.round(e.total / rows.length) }))
    .sort((a, b) => b.average - a.average)
    .slice(0, 5);

  const topicById = new Map(topics.map((t) => [t.id, t]));
  const subjectName = new Map(subjects.map((s) => [s.id, s.name]));
  const topicTotals = new Map<string, { marks: number; count: number }>();
  for (const r of results) {
    for (const tr of r.topicResults) {
      if (!topicById.has(tr.topicId)) continue;
      const entry = topicTotals.get(tr.topicId) ?? { marks: 0, count: 0 };
      entry.marks += tr.marks;
      entry.count += 1;
      topicTotals.set(tr.topicId, entry);
    }
  }
  const weakTopics = [...topicTotals.entries()]
    .map(([topicId, v]) => {
      const topic = topicById.get(topicId)!;
      return {
        id: topicId,
        name: topic.name,
        subject: subjectName.get(topic.subjectId) ?? "-",
        average: v.count ? Math.round((v.marks / v.count) * 10) / 10 : 0,
      };
    })
    .sort((a, b) => a.average - b.average)
    .slice(0, 6);

  const examRows = exams
    .map((e) => {
      const examResults = rows.filter((r) => r.exam === e.name);
      return {
        id: e.id,
        name: e.name,
        class_name: className.get(e.classId) ?? "-",
        date: day(e.date),
        total_marks: e.totalMarks,
        passing_marks: e.passingMarks,
        students: examResults.length,
        average: examResults.length
          ? Math.round(examResults.reduce((s, r) => s + r.percentage, 0) / examResults.length)
          : 0,
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  return {
    total_exams: exams.length,
    avg_percentage: avgPercentage,
    pass_rate: passRate,
    top_performers: topPerformers,
    weak_topics: weakTopics,
    recent_results: rows.slice(0, 8),
    exams: examRows,
  };
}
