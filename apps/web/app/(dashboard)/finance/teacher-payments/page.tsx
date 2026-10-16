"use client";

import { motion } from "framer-motion";
import { Plus, Search, Users, DollarSign } from "lucide-react";
import { AnimatedPage, AnimatedSection } from "@/components/animated-page";
import { useI18n } from "@/lib/i18n";

export default function TeacherPaymentsPage() {
  const { t } = useI18n();

  const kpis = [
    { title: t("finance.teacherPaymentsPage.totalTeachers"), value: "0", subtitle: "Active", gradient: "from-blue-500 to-cyan-400", bg: "from-blue-500/10 to-cyan-500/5" },
    { title: t("finance.teacherPaymentsPage.totalPayout"), value: "LKR 0", subtitle: t("finance.teacherPaymentsPage.thisMonth"), gradient: "from-emerald-500 to-teal-400", bg: "from-emerald-500/10 to-teal-500/5" },
    { title: t("finance.teacherPaymentsPage.avgPerTeacher"), value: "LKR 0", subtitle: t("finance.teacherPaymentsPage.thisMonth"), gradient: "from-violet-500 to-purple-400", bg: "from-violet-500/10 to-purple-500/5" },
  ];

  return (
    <AnimatedPage className="space-y-6">
      <AnimatedSection>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight"><span className="gradient-text">{t("finance.teacherPaymentsPage.title")}</span></h1>
            <p className="text-muted-foreground mt-1">{t("finance.teacherPaymentsPage.subtitle")}</p>
          </div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-violet-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/25">
            <Plus className="h-4 w-4" /> {t("finance.teacherPaymentsPage.processPayments")}
          </motion.button>
        </div>
      </AnimatedSection>

      <div className="grid gap-4 md:grid-cols-3">
        {kpis.map((kpi) => (
          <AnimatedSection key={kpi.title}>
            <motion.div whileHover={{ y: -3 }} className={`rounded-2xl border border-border/50 bg-gradient-to-br ${kpi.bg} p-5 shadow-sm`}>
              <p className="text-sm text-muted-foreground">{kpi.title}</p>
              <p className="text-2xl font-bold mt-1">{kpi.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{kpi.subtitle}</p>
            </motion.div>
          </AnimatedSection>
        ))}
      </div>

      <AnimatedSection>
        <div className="glass-card rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 border-b border-border/50 p-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input type="text" placeholder={t("finance.teacherPaymentsPage.noPayments")}
                className="w-full rounded-xl border border-border/50 bg-muted/30 pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:bg-background focus:border-primary/30 focus-glow transition-all" />
            </div>
          </div>
          <div className="p-16 text-center">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", delay: 0.2 }}
              className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-violet-500/10">
              <Users className="h-10 w-10 text-primary" />
            </motion.div>
            <h3 className="mt-5 text-lg font-semibold">{t("finance.teacherPaymentsPage.noPayments")}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground max-w-md mx-auto">{t("finance.teacherPaymentsPage.addTeachers")}</p>
          </div>
        </div>
      </AnimatedSection>
    </AnimatedPage>
  );
}
