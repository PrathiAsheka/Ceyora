"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Download, FileText, Printer } from "lucide-react";
import { AnimatedPage, AnimatedSection } from "@/components/animated-page";
import { useI18n } from "@/lib/i18n";

export default function ReportPreviewPage() {
  const { t } = useI18n();
  return (
    <AnimatedPage className="space-y-6">
      <AnimatedSection>
        <div className="flex items-center gap-4">
          <motion.a href="/reports" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            className="rounded-xl p-2 hover:bg-muted/50 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </motion.a>
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight"><span className="gradient-text">{t("reports.preview.title")}</span></h1>
            <p className="text-muted-foreground mt-1">{t("reports.preview.subtitle")}</p>
          </div>
          <div className="flex gap-2">
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 rounded-xl border border-border/50 px-4 py-2.5 text-sm font-medium hover:bg-muted/50 transition-all">
              <Printer className="h-4 w-4" /> {t("reports.preview.print")}
            </motion.button>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-violet-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/25">
              <Download className="h-4 w-4" /> {t("reports.preview.downloadPdf")}
            </motion.button>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection>
        <div className="glass-card rounded-2xl p-16 shadow-sm text-center">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", delay: 0.2 }}
            className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-primary/10 to-violet-500/10">
            <FileText className="h-12 w-12 text-primary" />
          </motion.div>
          <h3 className="mt-6 text-xl font-bold">{t("reports.preview.noReport")}</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
            {t("reports.preview.noReportDesc")}
          </p>
          <motion.a href="/reports" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-violet-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/25">
            {t("reports.preview.goToReports")}
          </motion.a>
        </div>
      </AnimatedSection>
    </AnimatedPage>
  );
}
