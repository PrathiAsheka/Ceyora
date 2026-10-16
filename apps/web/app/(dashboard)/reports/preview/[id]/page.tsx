"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  Download,
  FileText,
  Printer,
  Sparkles,
  Building2,
  DollarSign,
  TrendingUp,
  Users,
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Receipt,
  Scale,
} from "lucide-react";
import { AnimatedPage, AnimatedSection } from "@/components/animated-page";
import { mockInstitutes, mockClasses, mockTeachers, mockTopicDiagnostics, mockRecommendations } from "@/lib/mock-data";
import Link from "next/link";
import toast from "react-hot-toast";

export default function ReportPreviewPage() {
  const institute = mockInstitutes[0];

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    toast.success("Compiled and downloaded pixel-perfect WeasyPrint PDF Dossier!", {
      icon: "📑",
    });
  };

  return (
    <AnimatedPage className="space-y-6">
      {/* Action Toolbar */}
      <AnimatedSection className="print:hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/reports">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="rounded-xl p-2.5 border border-border/60 hover:bg-muted/50">
                <ArrowLeft className="h-4 w-4" />
              </motion.button>
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-foreground">
                Monthly Executive Management Dossier
              </h1>
              <p className="text-xs text-muted-foreground">Reporting Period: October 2026 • Apex Higher Education Institute</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-2xl border border-border/60 px-4 py-2 text-xs font-bold hover:bg-muted/50"
            >
              <Printer className="h-3.5 w-3.5" /> Print Dossier
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDownload}
              className="flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-primary to-violet-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-primary/25"
            >
              <Download className="h-3.5 w-3.5" /> Download Signed PDF
            </motion.button>
          </div>
        </div>
      </AnimatedSection>

      {/* Printable Dossier Sheet */}
      <AnimatedSection>
        <div className="mx-auto max-w-4xl rounded-3xl border border-border/80 bg-card p-8 sm:p-12 shadow-2xl space-y-8 text-foreground print:border-none print:shadow-none print:p-0">
          {/* Header & Logo */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-border/60 pb-6">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary to-violet-600 text-white font-black text-sm shadow-md">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-black tracking-tight text-foreground">CEYORA INTELLIGENCE</h2>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Tuition BI & Operations Platform</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{institute.name}</p>
              <p className="text-xs text-muted-foreground">{institute.address}</p>
            </div>

            <div className="text-left sm:text-right text-xs">
              <span className="inline-block bg-primary/10 text-primary font-mono font-bold px-3 py-1 rounded-lg text-xs">
                DOSSIER-OCT-2026-01
              </span>
              <p className="text-muted-foreground mt-2">Cut-off Day: <strong className="text-foreground">10th October 2026</strong></p>
              <p className="text-muted-foreground">Generated: <strong className="text-foreground">{new Date().toLocaleDateString("en-LK")}</strong></p>
            </div>
          </div>

          {/* 1. Executive Summary */}
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-wider text-primary flex items-center gap-1.5">
              <span>1.0</span> Executive Summary & Business Health Scorecard
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              During the October 2026 evaluation period, Apex Institute recorded strong operational momentum with a 94.8% fee collection efficiency rate and LKR 3,845,000 in gross tuition receipts. Average hall check-in attendance held steady at 92.4% across 28 scheduled batches. Automated WhatsApp reminders reduced overdue arrears by 42% within 5 business days of the billing cut-off.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl border border-border/50 bg-muted/20 text-center">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Business Health</span>
                <p className="text-xl font-black text-emerald-500 mt-1">94/100</p>
                <p className="text-[10px] text-muted-foreground">Grade: Outstanding</p>
              </div>

              <div className="p-3.5 rounded-2xl border border-border/50 bg-muted/20 text-center">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Active Enrollment</span>
                <p className="text-xl font-black text-foreground mt-1">1,284</p>
                <p className="text-[10px] text-emerald-500 font-semibold">+14.2% vs last term</p>
              </div>

              <div className="p-3.5 rounded-2xl border border-border/50 bg-muted/20 text-center">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Gross Receipts</span>
                <p className="text-xl font-black text-foreground mt-1">LKR 3.84M</p>
                <p className="text-[10px] text-muted-foreground">94.8% Collection Rate</p>
              </div>

              <div className="p-3.5 rounded-2xl border border-border/50 bg-muted/20 text-center">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Net Center Share</span>
                <p className="text-xl font-black text-primary mt-1">LKR 1.20M</p>
                <p className="text-[10px] text-muted-foreground">Retained Margin</p>
              </div>
            </div>
          </div>

          {/* 2. Financial Performance & Waterfall */}
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-wider text-primary flex items-center gap-1.5">
              <span>2.0</span> Financial Ledger & Waterfall Flow (Double-Entry)
            </h3>

            <div className="rounded-2xl border border-border/50 overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-muted/40 font-bold uppercase text-[10px] text-muted-foreground">
                  <tr>
                    <th className="py-2.5 pl-3">Ledger Head</th>
                    <th className="py-2.5">Category</th>
                    <th className="py-2.5 text-right pr-3">Amount (LKR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  <tr>
                    <td className="py-2.5 pl-3 font-semibold">Total Gross Fee Charges (1,284 Students)</td>
                    <td className="py-2.5 text-muted-foreground">Invoiced Revenue</td>
                    <td className="py-2.5 text-right pr-3 font-bold">4,050,000</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pl-3 font-semibold">Waivers & Concessions (Sibling 15% + Scholarships)</td>
                    <td className="py-2.5 text-muted-foreground">Audit Waivers</td>
                    <td className="py-2.5 text-right pr-3 font-bold text-amber-500">- 125,000</td>
                  </tr>
                  <tr className="bg-muted/10">
                    <td className="py-2.5 pl-3 font-bold text-foreground">Net Collected Receipts</td>
                    <td className="py-2.5 text-muted-foreground">Cash + PayHere</td>
                    <td className="py-2.5 text-right pr-3 font-black text-emerald-500">3,845,000</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pl-3 font-semibold">Faculty Payouts (80% Teacher Shares)</td>
                    <td className="py-2.5 text-muted-foreground">Disbursed to Bank</td>
                    <td className="py-2.5 text-right pr-3 font-bold text-primary">- 2,642,000</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pl-3 font-semibold">Campus Overhead & Utility Expenses</td>
                    <td className="py-2.5 text-muted-foreground">Auditorium AC & Wages</td>
                    <td className="py-2.5 text-right pr-3 font-bold text-red-500">- 420,000</td>
                  </tr>
                  <tr className="bg-emerald-500/10 font-bold">
                    <td className="py-3 pl-3 text-emerald-600 dark:text-emerald-400">Net Retained Institute Margin</td>
                    <td className="py-3 text-emerald-600 dark:text-emerald-400">Audited Surplus</td>
                    <td className="py-3 text-right pr-3 text-emerald-600 dark:text-emerald-400 text-sm font-black">+ 783,000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 3. Class Performance & Faculty Payouts */}
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-wider text-primary flex items-center gap-1.5">
              <span>3.0</span> Faculty Settlement & Batch Attendance Audit
            </h3>

            <div className="rounded-2xl border border-border/50 overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-muted/40 font-bold uppercase text-[10px] text-muted-foreground">
                  <tr>
                    <th className="py-2.5 pl-3">Batch Name</th>
                    <th className="py-2.5">Faculty Member</th>
                    <th className="py-2.5">Attendance</th>
                    <th className="py-2.5">Gross Billed</th>
                    <th className="py-2.5 text-right pr-3">Net Teacher Share</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {mockClasses.map((cls) => {
                    const tea = mockTeachers.find((t) => t.id === cls.teacherId);
                    const netTea = Math.round(cls.monthlyCollection * 0.8) - cls.hallChargesDeduction;
                    return (
                      <tr key={cls.id}>
                        <td className="py-2.5 pl-3 font-semibold">{cls.name}</td>
                        <td className="py-2.5 text-muted-foreground">{tea?.name}</td>
                        <td className="py-2.5 font-bold text-emerald-500">
                          {Math.round((cls.presentLastClass / cls.enrolledStudentsCount) * 100)}%
                        </td>
                        <td className="py-2.5 font-semibold">LKR {cls.monthlyCollection.toLocaleString()}</td>
                        <td className="py-2.5 text-right pr-3 font-bold text-primary">LKR {netTea.toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* 4. Curriculum Diagnostics & Remediation */}
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-wider text-primary flex items-center gap-1.5">
              <span>4.0</span> Curriculum Topic Diagnostics (Action Items)
            </h3>

            <div className="space-y-2 text-xs">
              {mockTopicDiagnostics.map((t) => (
                <div key={t.id} className="p-3 rounded-xl border border-border/40 bg-muted/20 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-foreground">{t.subject} — {t.topicName}</span>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{t.recommendation}</p>
                  </div>
                  <span className={`font-black text-xs ${t.status === "critical" ? "text-red-500" : "text-emerald-500"}`}>
                    {t.masteryPercentage}% Mastery
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 5. PDPA Compliance & Cryptographic Verification Footer */}
          <div className="pt-6 border-t border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-[11px] text-muted-foreground">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>Sri Lanka PDPA Act No. 9 of 2022 Compliant • Immutable Snapshot Hash: #a98f12c98d</span>
            </div>
            <div className="font-semibold text-foreground">
              Official Sign-off: Platform Super Admin Console
            </div>
          </div>
        </div>
      </AnimatedSection>
    </AnimatedPage>
  );
}
