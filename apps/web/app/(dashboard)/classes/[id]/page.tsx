"use client";

import { use } from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  GraduationCap,
  Users,
  DollarSign,
  Clock,
  MapPin,
  Calendar,
  CreditCard,
  QrCode,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Edit,
  FileText,
  User,
} from "lucide-react";
import { AnimatedPage, AnimatedSection } from "@/components/animated-page";
import { mockClasses, mockTeachers, mockStudents, mockExams } from "@/lib/mock-data";
import Link from "next/link";
import toast from "react-hot-toast";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";

export default function ClassDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const classItem = mockClasses.find((c) => c.id === resolvedParams.id) || mockClasses[0];
  const teacher = mockTeachers.find((t) => t.id === classItem.teacherId);

  // Enrolled students in this class
  const enrolledStudents = mockStudents.filter((s) => s.enrolledClassIds.includes(classItem.id));
  const classExams = mockExams.filter((e) => e.classId === classItem.id);

  // Financial calculations
  const expectedRevenue = classItem.enrolledStudentsCount * classItem.monthlyFee;
  const collectedRevenue = classItem.monthlyCollection;
  const outstandingRevenue = Math.max(0, expectedRevenue - collectedRevenue);
  const teacherNetPayout = Math.round(
    (collectedRevenue * (classItem.teacherSharePercentage / 100)) - classItem.hallChargesDeduction
  );
  const instituteNetProfit = Math.round(
    (collectedRevenue * (classItem.instituteSharePercentage / 100)) + classItem.hallChargesDeduction
  );

  return (
    <AnimatedPage className="space-y-6">
      {/* Breadcrumbs Navigation */}
      <Breadcrumbs items={[{ label: "Classes", href: "/classes" }, { label: classItem.name }]} />

      {/* Header */}
      <AnimatedSection>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                {classItem.code}
              </span>
              <span className="text-xs font-bold text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-full">
                {classItem.grade}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-foreground mt-1">
              {classItem.name}
            </h1>
            <p className="text-xs text-muted-foreground">{classItem.medium} Medium • {classItem.subject}</p>
          </div>

          <div className="flex items-center gap-2">
            <Link href={`/attendance/scan?classId=${classItem.id}`}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-primary to-violet-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-primary/25"
              >
                <QrCode className="h-3.5 w-3.5" /> Scan Attendance
              </motion.button>
            </Link>
          </div>
        </div>
      </AnimatedSection>

      {/* KPI Financial & Attendance Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AnimatedSection>
          <div className="glass-card rounded-2xl p-5 border border-border/60">
            <span className="text-xs font-bold text-muted-foreground uppercase">Enrolled Students</span>
            <p className="text-2xl font-black text-foreground mt-1">{classItem.enrolledStudentsCount} Students</p>
            <p className="text-[11px] text-emerald-500 font-semibold mt-0.5">
              {classItem.presentLastClass} Present last session ({Math.round((classItem.presentLastClass / classItem.enrolledStudentsCount) * 100)}%)
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div className="glass-card rounded-2xl p-5 border border-border/60">
            <span className="text-xs font-bold text-muted-foreground uppercase">Monthly Fee</span>
            <p className="text-2xl font-black text-foreground mt-1">LKR {classItem.monthlyFee.toLocaleString()}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Billed on 10th of every month</p>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div className="glass-card rounded-2xl p-5 border border-border/60">
            <span className="text-xs font-bold text-muted-foreground uppercase">Collected Revenue</span>
            <p className="text-2xl font-black text-emerald-500 mt-1">LKR {(collectedRevenue / 1000).toLocaleString()}k</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Arrears: LKR {(outstandingRevenue / 1000).toLocaleString()}k</p>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div className="glass-card rounded-2xl p-5 border border-border/60">
            <span className="text-xs font-bold text-muted-foreground uppercase">Teacher Share (Net)</span>
            <p className="text-2xl font-black text-primary mt-1">LKR {(teacherNetPayout / 1000).toLocaleString()}k</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {classItem.teacherSharePercentage}% Split (- LKR {classItem.hallChargesDeduction.toLocaleString()} Hall)
            </p>
          </div>
        </AnimatedSection>
      </div>

      {/* Main Grid: Class Details & Enrolled Students */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column: Schedule, Teacher & Split */}
        <AnimatedSection className="lg:col-span-5 space-y-5">
          {/* Class Spec Card */}
          <div className="glass-card rounded-3xl p-6 border border-border/60 space-y-4">
            <h3 className="text-sm font-bold text-foreground">Schedule & Hall Assignment</h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-2 border-b border-border/40">
                <span className="text-muted-foreground">Lecture Hall:</span>
                <span className="font-bold text-foreground">{classItem.hall}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border/40">
                <span className="text-muted-foreground">Time Slot:</span>
                <span className="font-bold text-primary">{classItem.timeSlot}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border/40">
                <span className="text-muted-foreground">Class Medium:</span>
                <span className="font-semibold text-foreground">{classItem.medium}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border/40">
                <span className="text-muted-foreground">Institute Share:</span>
                <span className="font-bold text-foreground">{classItem.instituteSharePercentage}% (LKR {instituteNetProfit.toLocaleString()})</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-muted-foreground">Hall Maintenance Deduction:</span>
                <span className="font-bold text-red-500">- LKR {classItem.hallChargesDeduction.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Assigned Teacher Card */}
          <div className="glass-card rounded-3xl p-6 border border-border/60 space-y-3">
            <h3 className="text-sm font-bold text-foreground">Assigned Faculty Member</h3>
            {teacher && (
              <div className="p-4 rounded-2xl border border-border/50 bg-muted/20 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-foreground">{teacher.name}</h4>
                    <p className="text-[11px] text-muted-foreground">{teacher.title}</p>
                  </div>
                  <Link href={`/teachers/${teacher.id}`}>
                    <button className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                      Profile <ExternalLink className="h-3 w-3" />
                    </button>
                  </Link>
                </div>
                <div className="pt-2 border-t border-border/40 text-[11px] text-muted-foreground space-y-1">
                  <p>Bank: <strong className="text-foreground">{teacher.bankName}</strong></p>
                  <p>Account: <strong className="font-mono text-foreground">{teacher.bankAccount}</strong></p>
                </div>
              </div>
            )}
          </div>

          {/* Recent Exam Card */}
          <div className="glass-card rounded-3xl p-6 border border-border/60 space-y-3">
            <h3 className="text-sm font-bold text-foreground">Class Evaluation Exams</h3>
            {classExams.length > 0 ? (
              classExams.map((ex) => (
                <div key={ex.id} className="p-3.5 rounded-2xl border border-border/40 bg-muted/20 space-y-2 text-xs">
                  <p className="font-bold text-foreground">{ex.name}</p>
                  <div className="flex items-center justify-between text-muted-foreground text-[11px]">
                    <span>Average: <strong className="text-foreground">{ex.averageScore}/100</strong></span>
                    <span>Pass Rate: <strong className="text-emerald-500">{ex.passPercentage}%</strong></span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-muted-foreground">No evaluation exams recorded yet.</p>
            )}
          </div>
        </AnimatedSection>

        {/* Right Column: Enrolled Students List */}
        <AnimatedSection className="lg:col-span-7">
          <div className="glass-card rounded-3xl p-6 border border-border/60 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-foreground">Enrolled Students in this Batch</h3>
                  <p className="text-xs text-muted-foreground">Students registered with active biometric QR badges</p>
                </div>
                <Link href="/students">
                  <span className="text-xs font-semibold text-primary hover:underline">Enroll New</span>
                </Link>
              </div>

              <div className="space-y-2.5">
                {enrolledStudents.map((s) => (
                  <div
                    key={s.id}
                    className="p-3.5 rounded-2xl border border-border/40 bg-muted/20 hover:bg-muted/40 transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-violet-500 text-white font-bold text-xs">
                        {s.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground">{s.name}</p>
                        <p className="text-[10px] text-muted-foreground font-mono">{s.studentId} • {s.school}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-[10px] text-muted-foreground font-semibold">Attendance</p>
                        <p className="text-xs font-bold text-emerald-500">{s.attendanceRate}%</p>
                      </div>

                      {s.paymentStatus === "paid" ? (
                        <span className="rounded-full bg-emerald-500/10 text-emerald-500 px-2 py-0.5 text-[10px] font-bold">
                          PAID
                        </span>
                      ) : (
                        <span className="rounded-full bg-red-500/10 text-red-500 px-2 py-0.5 text-[10px] font-bold">
                          ARREARS
                        </span>
                      )}

                      <Link href={`/students/${s.id}`}>
                        <button className="rounded-lg p-1 text-muted-foreground hover:text-foreground">
                          <ExternalLink className="h-3.5 w-3.5" />
                        </button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
              <span>Showing sample batch roster</span>
              <span className="font-bold text-foreground">Apex Tuition BI</span>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </AnimatedPage>
  );
}
