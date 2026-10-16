"use client";

import { motion } from "framer-motion";
import {
  FileText,
  Download,
  Calendar,
  BarChart3,
  Users,
  DollarSign,
  ArrowRight,
  Printer,
  Sparkles,
  CheckCircle2,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { AnimatedPage, AnimatedSection } from "@/components/animated-page";
import Link from "next/link";
import toast from "react-hot-toast";

export default function ReportsPage() {
  const reports = [
    {
      id: "oct-2026-dossier",
      title: "Monthly Executive Management Dossier",
      period: "October 2026",
      desc: "Complete flagship dossier: Business Health score, Financial P&L, Teacher payouts, Attendance retention, and Topic weak-points.",
      status: "Ready to Download",
      isFlagship: true,
      gradient: "from-primary to-violet-600",
    },
    {
      id: "financial-pnl",
      title: "Tuition Financial & Arrears Audit",
      period: "October 2026",
      desc: "Double-entry billing statements, fee collection rates (94.8%), PayHere settlements, and parent follow-up list.",
      status: "Verified",
      isFlagship: false,
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      id: "academic-diagnostics",
      title: "Academic Curriculum & Topic Diagnostics",
      period: "Term 3 Evaluation",
      desc: "Grade distributions (A/B/C/S/F), pass rates, student ranking, and topic weaknesses across Combined Maths & Physics.",
      status: "Ready",
      isFlagship: false,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      id: "faculty-settlements",
      title: "Faculty Payouts & Compensation Advice",
      period: "October 2026",
      desc: "Teacher 80/20 revenue splits, hall AC maintenance deductions, and bank transfer advice slips for Commercial Bank & BOC.",
      status: "Settled",
      isFlagship: false,
      gradient: "from-violet-500 to-purple-500",
    },
  ];

  const handleGenerateFresh = () => {
    toast.success("Synthesized monthly snapshot and compiled pixel-perfect WeasyPrint PDF dossier!", {
      icon: "📑",
    });
  };

  return (
    <AnimatedPage className="space-y-6">
      {/* Header */}
      <AnimatedSection>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="flex h-2 w-2 rounded-full bg-primary" />
              <span className="text-[11px] font-bold text-primary uppercase tracking-widest">
                Executive Dossiers & Monthly Snapshots
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
              Report <span className="gradient-text">Center</span>
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Flagship institute management reports, deterministic financial audits, and printable PDF packages.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGenerateFresh}
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-violet-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow"
          >
            <Sparkles className="h-4 w-4" />
            Compile Monthly Snapshot Dossier
          </motion.button>
        </div>
      </AnimatedSection>

      {/* Reports Grid */}
      <div className="grid gap-5 md:grid-cols-2">
        {reports.map((r) => (
          <AnimatedSection key={r.id}>
            <div className="glass-card rounded-3xl p-6 border border-border/60 hover:border-primary/40 transition-all shadow-sm hover:shadow-xl flex flex-col justify-between space-y-4 group">
              <div>
                <div className="flex items-start justify-between">
                  <div className={`h-1.5 w-20 rounded-full bg-gradient-to-r ${r.gradient} mb-3`} />
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> {r.status}
                  </span>
                </div>

                <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                  {r.title}
                </h3>
                <span className="text-xs font-semibold text-primary">{r.period}</span>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  {r.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-border/40 flex items-center justify-between">
                <Link href={`/reports/preview/${r.id}`}>
                  <button className="flex items-center gap-1 text-xs font-bold text-foreground hover:text-primary transition-colors">
                    <FileText className="h-3.5 w-3.5 text-primary" />
                    <span>View Interactive Dossier</span>
                  </button>
                </Link>

                <button
                  onClick={() => toast.success(`Downloaded signed PDF: ${r.title}`)}
                  className="rounded-xl border border-border/60 p-2 text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
                  title="Download PDF"
                >
                  <Download className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </AnimatedPage>
  );
}
