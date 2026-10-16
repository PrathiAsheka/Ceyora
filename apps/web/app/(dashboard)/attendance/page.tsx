"use client";

import { motion } from "framer-motion";
import { QrCode, Calendar, TrendingUp, AlertTriangle, Users } from "lucide-react";
import { AnimatedPage, AnimatedSection } from "@/components/animated-page";
import { useI18n } from "@/lib/i18n";

export default function AttendanceDashboardPage() {
  const { t } = useI18n();

  const kpis = [
    { title: t("attendance.todaysAttendance"), value: "0/0", icon: Calendar, gradient: "from-blue-500 to-cyan-400", bg: "from-blue-500/10 to-cyan-500/5" },
    { title: t("attendance.averageRate"), value: "0%", icon: TrendingUp, gradient: "from-emerald-500 to-teal-400", bg: "from-emerald-500/10 to-teal-500/5" },
    { title: t("attendance.lowAttendance"), value: "0", icon: AlertTriangle, gradient: "from-amber-500 to-orange-400", bg: "from-amber-500/10 to-orange-500/5" },
    { title: t("attendance.consecutiveAbsences"), value: "0", icon: Users, gradient: "from-red-500 to-orange-400", bg: "from-red-500/10 to-orange-500/5" },
  ];

  return (
    <AnimatedPage className="space-y-6">
      <AnimatedSection>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight"><span className="gradient-text">{t("attendance.title")}</span></h1>
            <p className="text-muted-foreground mt-1">{t("attendance.subtitle")}</p>
          </div>
          <motion.a href="/attendance/scan" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-violet-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/25">
            <QrCode className="h-4 w-4" /> {t("attendance.scanner")}
          </motion.a>
        </div>
      </AnimatedSection>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <AnimatedSection key={kpi.title}>
              <motion.div whileHover={{ y: -3 }} className={`rounded-2xl border border-border/50 bg-gradient-to-br ${kpi.bg} p-5 shadow-sm`}>
                <div className={`rounded-xl bg-gradient-to-br ${kpi.gradient} p-2.5 shadow-lg w-fit`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <p className="text-2xl font-bold mt-3">{kpi.value}</p>
                <p className="text-sm text-muted-foreground">{kpi.title}</p>
              </motion.div>
            </AnimatedSection>
          );
        })}
      </div>

      <AnimatedSection>
        <div className="glass-card rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">{t("attendance.attendanceByClass")}</h2>
          <div className="p-12 text-center">
            <QrCode className="mx-auto h-12 w-12 text-muted-foreground/20" />
            <p className="mt-2 text-sm text-muted-foreground">{t("attendance.noAttendanceData")}</p>
          </div>
        </div>
      </AnimatedSection>
    </AnimatedPage>
  );
}
