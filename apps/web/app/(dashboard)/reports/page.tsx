"use client";

import { motion } from "framer-motion";
import { FileText, Download, Calendar, BarChart3, Users, DollarSign, ArrowRight } from "lucide-react";
import { AnimatedPage, AnimatedSection } from "@/components/animated-page";
import { useI18n } from "@/lib/i18n";

export default function ReportsPage() {
  const { t } = useI18n();
  const reports = [
    { title: t("reports.monthly"), desc: t("reports.monthlyDesc"), gradient: "from-primary to-violet-500" },
    { title: t("reports.financial"), desc: t("reports.financialDesc"), gradient: "from-emerald-500 to-teal-400" },
    { title: t("reports.academicReport"), desc: t("reports.academicReportDesc"), gradient: "from-blue-500 to-cyan-400" },
    { title: t("reports.teacherReport"), desc: t("reports.teacherReportDesc"), gradient: "from-amber-500 to-orange-400" },
    { title: t("reports.studentPerformance"), desc: t("reports.studentPerformanceDesc"), gradient: "from-violet-500 to-purple-400" },
    { title: t("reports.paymentFollowup"), desc: t("reports.paymentFollowupDesc"), gradient: "from-red-500 to-pink-400" },
  ];

  return (
    <AnimatedPage className="space-y-6">
      <AnimatedSection>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight"><span className="gradient-text">{t("reports.title")}</span></h1>
            <p className="text-muted-foreground mt-1">{t("reports.subtitle")}</p>
          </div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-violet-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/25">
            <FileText className="h-4 w-4" /> {t("reports.generateMonthly")}
          </motion.button>
        </div>
      </AnimatedSection>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reports.map((report) => (
          <AnimatedSection key={report.title}>
            <motion.div
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="group glass-card rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div className={`h-1.5 w-16 rounded-full bg-gradient-to-r ${report.gradient} mb-4`} />
              <h3 className="font-semibold group-hover:text-primary transition-colors">{report.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{report.desc}</p>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {t("reports.notGenerated")}
                </div>
                <motion.button whileHover={{ scale: 1.05 }} className="flex items-center gap-1 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-all">
                  <Download className="h-3 w-3" /> {t("reports.generate")}
                </motion.button>
              </div>
            </motion.div>
          </AnimatedSection>
        ))}
      </div>
    </AnimatedPage>
  );
}
