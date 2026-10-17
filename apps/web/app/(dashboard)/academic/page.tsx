"use client";

import { motion } from "framer-motion";
import {
  GraduationCap,
  Award,
  BookOpen,
  TrendingUp,
  ArrowRight,
  FileText,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  Lightbulb,
  Sparkles,
} from "lucide-react";
import { AnimatedCounter } from "@/components/animated-counter";
import { AnimatedPage, AnimatedSection } from "@/components/animated-page";
import { mockExams, mockTopicDiagnostics } from "@/lib/mock-data";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ModuleSubNav } from "@/components/layout/module-sub-nav";
import { academicNavItems } from "@/lib/sub-nav-items";

export default function AcademicPage() {
  const academicKpis = [
    {
      title: "Average Exam Mark",
      value: 74.8,
      suffix: "%",
      change: "+4.2% vs previous term",
      gradient: "from-blue-500 to-cyan-400",
      bg: "from-blue-500/10 to-cyan-500/5",
    },
    {
      title: "Batch Pass Rate",
      value: 86.4,
      suffix: "%",
      change: "Minimum 40 Marks",
      gradient: "from-emerald-500 to-teal-400",
      bg: "from-emerald-500/10 to-teal-500/5",
    },
    {
      title: "Topics Evaluated",
      value: 38,
      change: "Calculus, Dynamics, Organic",
      gradient: "from-violet-500 to-purple-400",
      bg: "from-violet-500/10 to-purple-500/5",
    },
    {
      title: "Remediation Topics",
      value: 3,
      change: "Flagged below 65% mastery",
      gradient: "from-amber-500 to-orange-400",
      bg: "from-amber-500/10 to-orange-500/5",
    },
  ];

  return (
    <AnimatedPage className="space-y-6">
      {/* Breadcrumbs & Navigation */}
      <Breadcrumbs items={[{ label: "Academic" }]} />

      {/* Header */}
      <AnimatedSection>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="flex h-2 w-2 rounded-full bg-violet-500" />
              <span className="text-[11px] font-bold text-violet-500 uppercase tracking-widest">
                Curriculum Analytics & Exam Performance
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
              Academic <span className="gradient-text">Intelligence</span>
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Topic-level diagnostic breakdown, exam distributions, and attendance-to-marks correlation.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/academic/exams">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-violet-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-primary/25"
              >
                <FileText className="h-4 w-4" />
                Exams & Results
              </motion.button>
            </Link>
          </div>
        </div>

        {/* Academic Sub-Navigation Bar */}
        <div className="pt-2">
          <ModuleSubNav items={academicNavItems} />
        </div>
      </AnimatedSection>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {academicKpis.map((kpi) => (
          <AnimatedSection key={kpi.title}>
            <motion.div
              whileHover={{ y: -4, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={`rounded-3xl border border-border/60 bg-gradient-to-br ${kpi.bg} p-5 shadow-sm`}
            >
              <span className="text-xs font-bold text-muted-foreground uppercase">{kpi.title}</span>
              <div className="mt-2 text-2xl font-black text-foreground">
                <AnimatedCounter value={kpi.value} />
                {kpi.suffix}
              </div>
              <p className="text-[11px] font-semibold text-emerald-500 mt-0.5">{kpi.change}</p>
            </motion.div>
          </AnimatedSection>
        ))}
      </div>

      {/* Correlation Insight Card: Attendance vs Marks */}
      <AnimatedSection>
        <div className="glass-card rounded-3xl p-6 border border-border/60 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h3 className="text-sm font-bold text-foreground">Deterministic Correlation: Attendance vs Academic Outcomes</h3>
            </div>
            <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              P-Value &lt; 0.001 Verified
            </span>
          </div>

          <p className="text-xs text-muted-foreground">
            Analysis of 1,284 students shows a direct mathematical link between hall check-in consistency and term test pass rates.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-500">
                <span>&gt; 90% QR Attendance</span>
                <span>84.6% Avg Score</span>
              </div>
              <div className="h-2 w-full bg-muted/60 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: "85%" }} />
              </div>
              <p className="text-[10px] text-muted-foreground">96.8% Pass Rate in A/L Paper Tests</p>
            </div>

            <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-500/5 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-amber-500">
                <span>75% - 90% Attendance</span>
                <span>68.2% Avg Score</span>
              </div>
              <div className="h-2 w-full bg-muted/60 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: "68%" }} />
              </div>
              <p className="text-[10px] text-muted-foreground">81.2% Pass Rate with topic gaps</p>
            </div>

            <div className="p-4 rounded-2xl border border-red-500/30 bg-red-500/5 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-red-500">
                <span>&lt; 75% Attendance</span>
                <span>49.5% Avg Score</span>
              </div>
              <div className="h-2 w-full bg-muted/60 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 rounded-full" style={{ width: "50%" }} />
              </div>
              <p className="text-[10px] text-muted-foreground">High risk of course disengagement</p>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Direct Module Links */}
      <div className="grid gap-4 md:grid-cols-2">
        <AnimatedSection>
          <Link href="/academic/exams" className="block h-full">
            <div className="glass-card rounded-3xl p-6 border border-border/60 hover:border-primary/40 transition-all shadow-sm hover:shadow-xl group h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <FileText className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                    2 Evaluations Conducted
                  </span>
                </div>
                <h4 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                  Exams & Student Results
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Grade boundaries (A/B/C/S/F), pass percentages, mark entries, and PDPA anonymized rank views.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs font-bold text-primary">
                <span>View Exam Evaluations</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </AnimatedSection>

        <AnimatedSection>
          <Link href="/academic/topics" className="block h-full">
            <div className="glass-card rounded-3xl p-6 border border-border/60 hover:border-primary/40 transition-all shadow-sm hover:shadow-xl group h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                    <Lightbulb className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md">
                    3 Focus Areas Flagged
                  </span>
                </div>
                <h4 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                  Topic-Level Diagnostics
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Sub-topic mastery rates, identifying whether Calculus, Organic Chemistry, or Mechanics require teacher remediation.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs font-bold text-primary">
                <span>Inspect Topic Mastery</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </AnimatedSection>
      </div>
    </AnimatedPage>
  );
}
