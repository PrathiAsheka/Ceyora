"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  QrCode,
  Calendar,
  Clock,
  AlertTriangle,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Phone,
  Send,
  Building2,
  ChevronRight,
  ArrowRight,
  Wifi,
} from "lucide-react";
import { AnimatedPage, AnimatedSection } from "@/components/animated-page";
import { mockClasses, mockStudents } from "@/lib/mock-data";
import Link from "next/link";
import toast from "react-hot-toast";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ModuleSubNav } from "@/components/layout/module-sub-nav";
import { attendanceNavItems } from "@/lib/sub-nav-items";

export default function AttendancePage() {
  const atRiskStudents = mockStudents.filter((s) => s.attendanceRate < 75);

  const handleAlertParent = (studentName: string, phone: string) => {
    toast.success(`Dispatched attendance alert SMS to guardian of ${studentName} (${phone})`, {
      icon: "📲",
    });
  };

  return (
    <AnimatedPage className="space-y-6">
      {/* Breadcrumbs & Navigation */}
      <Breadcrumbs items={[{ label: "Attendance" }]} />

      {/* Header */}
      <AnimatedSection>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-[11px] font-bold text-emerald-500 uppercase tracking-widest">
                Biometric QR Gate Analytics & Retention Monitoring
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
              Attendance <span className="gradient-text">Intelligence</span>
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Monitor hall check-ins, detect consecutive absenteeism early, and prevent course dropout.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/attendance/scan">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-violet-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow"
              >
                <QrCode className="h-4 w-4" />
                Launch Live QR Scanner
              </motion.button>
            </Link>
          </div>
        </div>

        {/* Attendance Sub-Navigation Bar */}
        <div className="pt-2">
          <ModuleSubNav items={attendanceNavItems} />
        </div>
      </AnimatedSection>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AnimatedSection>
          <div className="glass-card rounded-2xl p-5 border border-border/60">
            <span className="text-xs font-bold text-muted-foreground uppercase">Campus Check-in Rate</span>
            <p className="text-2xl font-black text-emerald-500 mt-1">92.4%</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Biometric QR Verified</p>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div className="glass-card rounded-2xl p-5 border border-border/60">
            <span className="text-xs font-bold text-muted-foreground uppercase">Total Scanned Today</span>
            <p className="text-2xl font-black text-foreground mt-1">1,180 Scans</p>
            <p className="text-[11px] text-emerald-500 font-semibold mt-0.5">Sub-second gate flow</p>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div className="glass-card rounded-2xl p-5 border border-border/60">
            <span className="text-xs font-bold text-muted-foreground uppercase">Consecutive Absentees</span>
            <p className="text-2xl font-black text-red-500 mt-1">6 Students</p>
            <p className="text-[11px] text-red-500 font-semibold mt-0.5">Missed 2+ consecutive sessions</p>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div className="glass-card rounded-2xl p-5 border border-border/60">
            <span className="text-xs font-bold text-muted-foreground uppercase">Offline Buffer</span>
            <p className="text-2xl font-black text-primary mt-1">Zero Latency</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">IndexedDB local queue active</p>
          </div>
        </AnimatedSection>
      </div>

      {/* Attendance by Class Batch & At-Risk Deficit Alert */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left: Class Attendance Breakdown */}
        <AnimatedSection className="lg:col-span-7">
          <div className="glass-card rounded-3xl p-6 border border-border/60 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-foreground">Attendance Progression by Batch</h3>
                <p className="text-xs text-muted-foreground">Class-level participation rate against target threshold (85%)</p>
              </div>
              <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                Target: 85% Min
              </span>
            </div>

            <div className="space-y-3.5 pt-1">
              {mockClasses.map((cls) => {
                const percentage = Math.round((cls.presentLastClass / cls.enrolledStudentsCount) * 100);
                return (
                  <div key={cls.id} className="p-3.5 rounded-2xl border border-border/40 bg-muted/20 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-foreground">{cls.name}</p>
                        <p className="text-[10px] text-muted-foreground">{cls.hall} • {cls.timeSlot}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-emerald-500">{percentage}% Present</span>
                        <p className="text-[10px] text-muted-foreground font-mono">{cls.presentLastClass} / {cls.enrolledStudentsCount}</p>
                      </div>
                    </div>

                    <div className="h-2 w-full bg-muted/60 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-emerald-400 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </AnimatedSection>

        {/* Right: At-Risk Students Requiring Follow-Up */}
        <AnimatedSection className="lg:col-span-5">
          <div className="glass-card rounded-3xl p-6 border border-border/60 h-full flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-red-500/10 text-red-500">
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground">Retention Risk Alerts</h3>
                </div>
                <span className="text-[10px] font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full">
                  &lt; 75% Attendance
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                Students with significant attendance drop-offs correlated with exam score decline and disengagement.
              </p>

              <div className="space-y-3">
                {atRiskStudents.map((s) => (
                  <div
                    key={s.id}
                    className="p-3.5 rounded-2xl border border-red-500/30 bg-red-500/5 space-y-2.5 text-xs"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-foreground">{s.name}</h4>
                        <p className="text-[10px] text-muted-foreground font-mono">{s.studentId} • {s.school}</p>
                      </div>
                      <span className="text-xs font-black text-red-500">{s.attendanceRate}% Attendance</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-2 border-t border-red-500/20">
                      <span className="text-muted-foreground">Parent: {s.guardianName}</span>
                      <button
                        onClick={() => handleAlertParent(s.name, s.guardianPhone)}
                        className="flex items-center gap-1 font-bold text-emerald-500 bg-emerald-500/10 hover:bg-emerald-500/20 px-2.5 py-1 rounded-lg transition-colors"
                      >
                        <Send className="h-3 w-3" />
                        Alert Parent
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-2xl border border-border/50 bg-muted/20 text-xs flex items-center justify-between">
              <span className="text-muted-foreground">Predictive Drop-out Warning</span>
              <Link href="/recommendations">
                <span className="font-bold text-primary hover:underline flex items-center gap-1">
                  View Recommendations <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </AnimatedPage>
  );
}
