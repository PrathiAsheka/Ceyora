"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  Sparkles,
  PieChart,
  LineChart,
  ArrowUpRight,
  ShieldCheck,
  Building2,
  CheckCircle2,
} from "lucide-react";
import { AnimatedPage, AnimatedSection } from "@/components/animated-page";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { mockClasses } from "@/lib/mock-data";

const classProfitability = mockClasses.map((c) => {
  const gross = c.monthlyCollection;
  const teacherShare = Math.round(gross * (c.teacherSharePercentage / 100)) - c.hallChargesDeduction;
  const netInstitute = gross - teacherShare;
  return {
    name: c.name.split(" ")[1] || c.name,
    fullName: c.name,
    gross,
    netInstitute,
    students: c.enrolledStudentsCount,
  };
});

const attendanceCorrelationData = [
  { bracket: "<60% Att", count: 4, avgMarks: 38, dropOutRisk: "High (82%)" },
  { bracket: "60-75%", count: 12, avgMarks: 58, dropOutRisk: "Medium (45%)" },
  { bracket: "75-90%", count: 340, avgMarks: 72, dropOutRisk: "Low (12%)" },
  { bracket: ">90% Att", count: 928, avgMarks: 86, dropOutRisk: "Negligible (2%)" },
];

export default function AnalyticsPage() {
  return (
    <AnimatedPage className="space-y-6">
      {/* Header */}
      <AnimatedSection>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-2 w-2 rounded-full bg-cyan-500 animate-ping" />
            <span className="text-[11px] font-bold text-cyan-500 uppercase tracking-widest">
              Tuition Business Intelligence & Deterministic Correlation
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
            Analytics <span className="gradient-text">Engine</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Correlate attendance consistency with exam performance, calculate batch profitability, and forecast student retention.
          </p>
        </div>
      </AnimatedSection>

      {/* Intelligence Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AnimatedSection>
          <div className="glass-card rounded-2xl p-5 border border-border/60">
            <span className="text-xs font-bold text-muted-foreground uppercase">Correlation Strength</span>
            <p className="text-2xl font-black text-emerald-500 mt-1">R = 0.89</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Attendance directly dictates Pass Rates</p>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div className="glass-card rounded-2xl p-5 border border-border/60">
            <span className="text-xs font-bold text-muted-foreground uppercase">Revenue Leakage Prevented</span>
            <p className="text-2xl font-black text-foreground mt-1">LKR 480,000</p>
            <p className="text-[11px] text-emerald-500 font-semibold mt-0.5">Via automated gate check fee checks</p>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div className="glass-card rounded-2xl p-5 border border-border/60">
            <span className="text-xs font-bold text-muted-foreground uppercase">Top Margin Batch</span>
            <p className="text-2xl font-black text-primary mt-1">A/L Maths 2026</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">LKR 205K institute net retained</p>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div className="glass-card rounded-2xl p-5 border border-border/60">
            <span className="text-xs font-bold text-muted-foreground uppercase">Predicted Retention</span>
            <p className="text-2xl font-black text-foreground mt-1">96.2%</p>
            <p className="text-[11px] text-emerald-500 font-semibold mt-0.5">Next term projected re-enrollment</p>
          </div>
        </AnimatedSection>
      </div>

      {/* Charts: Class Profitability Breakdown & Correlation Matrix */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Class Profitability Bar Chart */}
        <AnimatedSection className="lg:col-span-7">
          <div className="glass-card rounded-3xl p-6 border border-border/60 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-foreground">Batch Profitability: Gross Billing vs Net Institute Share</h3>
              <p className="text-xs text-muted-foreground">Institute net profit after faculty 80% split and hall AC charge recovery</p>
            </div>

            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={classProfitability} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `LKR ${(val / 1000).toFixed(0)}k`} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="glass-card rounded-xl p-3 text-xs border border-border/60 shadow-xl">
                            <p className="font-bold mb-1">{payload[0]?.payload.fullName}</p>
                            <p className="text-primary font-semibold">Gross: LKR {payload[0]?.value?.toLocaleString()}</p>
                            <p className="text-emerald-500 font-bold">Institute Net: LKR {payload[1]?.value?.toLocaleString()}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="gross" name="Gross Billed" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="netInstitute" name="Institute Retained" fill="#10b981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </AnimatedSection>

        {/* Attendance vs Marks Impact Matrix */}
        <AnimatedSection className="lg:col-span-5">
          <div className="glass-card rounded-3xl p-6 border border-border/60 h-full flex flex-col justify-between space-y-4">
            <div>
              <h3 className="text-sm font-bold text-foreground mb-1">Attendance-to-Outcome Matrix</h3>
              <p className="text-xs text-muted-foreground mb-4">Empirical data linking hall gate scans with exam scores</p>

              <div className="space-y-3">
                {attendanceCorrelationData.map((row) => (
                  <div key={row.bracket} className="p-3.5 rounded-2xl border border-border/40 bg-muted/20 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between font-bold text-foreground">
                      <span>{row.bracket} ({row.count} Students)</span>
                      <span className="text-emerald-500">{row.avgMarks}% Avg Mark</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>Course Drop-out Probability:</span>
                      <span className={`font-semibold ${row.dropOutRisk.includes("High") ? "text-red-500 font-bold" : "text-muted-foreground"}`}>
                        {row.dropOutRisk}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-primary/30 bg-primary/10 p-3.5 text-xs flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-primary shrink-0" />
              <p className="text-muted-foreground text-[11px] leading-relaxed">
                Platform early-warning alerts trigger automatically whenever a student shifts below the 75% attendance threshold.
              </p>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </AnimatedPage>
  );
}
