"use client";

import { motion } from "framer-motion";
import { Search, Filter, AlertTriangle, MessageSquare } from "lucide-react";
import { AnimatedPage, AnimatedSection } from "@/components/animated-page";
import { useI18n } from "@/lib/i18n";

export default function OutstandingPage() {
  const { t } = useI18n();

  return (
    <AnimatedPage className="space-y-6">
      <AnimatedSection>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight"><span className="gradient-text">{t("finance.outstandingPage.title")}</span></h1>
            <p className="text-muted-foreground mt-1">{t("finance.outstandingPage.subtitle")}</p>
          </div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-violet-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/25">
            <MessageSquare className="h-4 w-4" /> {t("finance.outstandingPage.sendReminders")}
          </motion.button>
        </div>
      </AnimatedSection>

      <div className="grid gap-4 md:grid-cols-3">
        <AnimatedSection>
          <motion.div whileHover={{ y: -3 }} className="rounded-2xl border border-red-200 dark:border-red-800 bg-gradient-to-br from-red-50 to-red-500/5 dark:from-red-950/50 dark:to-red-900/20 p-5 shadow-sm">
            <p className="text-sm text-red-600 font-semibold">{t("finance.outstandingPage.totalOutstanding")}</p>
            <p className="text-3xl font-bold mt-1 text-red-600">LKR 0</p>
            <p className="text-xs text-red-400 mt-0.5">Across all students</p>
          </motion.div>
        </AnimatedSection>
        <AnimatedSection>
          <motion.div whileHover={{ y: -3 }} className="rounded-2xl border border-border/50 bg-gradient-to-br from-muted/20 to-muted/5 p-5 shadow-sm">
            <p className="text-sm text-muted-foreground">{t("finance.outstandingPage.studentsWithArrears")}</p>
            <p className="text-3xl font-bold mt-1">0</p>
            <p className="text-xs text-muted-foreground mt-0.5">{t("finance.outstandingPage.needFollowup")}</p>
          </motion.div>
        </AnimatedSection>
        <AnimatedSection>
          <motion.div whileHover={{ y: -3 }} className="rounded-2xl border border-border/50 bg-gradient-to-br from-muted/20 to-muted/5 p-5 shadow-sm">
            <p className="text-sm text-muted-foreground">{t("finance.outstandingPage.avgDaysOverdue")}</p>
            <p className="text-3xl font-bold mt-1">0</p>
            <p className="text-xs text-muted-foreground mt-0.5">{t("finance.outstandingPage.sinceDueDate")}</p>
          </motion.div>
        </AnimatedSection>
      </div>

      <AnimatedSection>
        <div className="glass-card rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 border-b border-border/50 p-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input type="text" placeholder="Search by student, class..."
                className="w-full rounded-xl border border-border/50 bg-muted/30 pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:bg-background focus:border-primary/30 focus-glow transition-all" />
            </div>
          </div>
          <div className="p-16 text-center">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", delay: 0.2 }}
              className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10">
              <AlertTriangle className="h-10 w-10 text-emerald-500" />
            </motion.div>
            <h3 className="mt-5 text-lg font-semibold">{t("finance.outstandingPage.noOutstanding")}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground max-w-md mx-auto">Outstanding fees will appear here once charges are created.</p>
          </div>
        </div>
      </AnimatedSection>
    </AnimatedPage>
  );
}
