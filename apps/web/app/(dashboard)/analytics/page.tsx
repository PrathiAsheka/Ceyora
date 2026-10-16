"use client";

import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Users, GraduationCap, DollarSign, BookOpen, ArrowRight } from "lucide-react";
import { AnimatedPage, AnimatedSection } from "@/components/animated-page";
import { useI18n } from "@/lib/i18n";

export default function AnalyticsDashboardPage() {
  const { t } = useI18n();

  const analytics = [
    { title: t("analytics.financialAnalytics"), desc: t("analytics.financialDesc"), icon: DollarSign, gradient: "from-emerald-500 to-teal-400" },
    { title: t("analytics.studentAnalytics"), desc: t("analytics.studentDesc"), icon: Users, gradient: "from-blue-500 to-cyan-400" },
    { title: t("analytics.classAnalytics"), desc: t("analytics.classDesc"), icon: GraduationCap, gradient: "from-violet-500 to-purple-400" },
    { title: t("analytics.teacherAnalytics"), desc: t("analytics.teacherDesc"), icon: Users, gradient: "from-amber-500 to-orange-400" },
    { title: t("analytics.attendanceAnalytics"), desc: t("analytics.attendanceDesc"), icon: BookOpen, gradient: "from-red-500 to-pink-400" },
    { title: t("analytics.academicAnalytics"), desc: t("analytics.academicDesc"), icon: BarChart3, gradient: "from-cyan-500 to-blue-400" },
  ];

  return (
    <AnimatedPage className="space-y-6">
      <AnimatedSection>
        <div>
          <h1 className="text-3xl font-bold tracking-tight"><span className="gradient-text">{t("analytics.title")}</span></h1>
          <p className="text-muted-foreground mt-1">{t("analytics.subtitle")}</p>
        </div>
      </AnimatedSection>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {analytics.map((item) => {
          const Icon = item.icon;
          return (
            <AnimatedSection key={item.title}>
              <motion.div
                whileHover={{ y: -6, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="group glass-card rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                <div className={`rounded-xl bg-gradient-to-br ${item.gradient} p-2.5 shadow-lg w-fit mb-4`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold group-hover:text-primary transition-colors">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">{item.desc}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </motion.div>
            </AnimatedSection>
          );
        })}
      </div>

      <AnimatedSection>
        <div className="glass-card rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">{t("analytics.insights")}</h2>
          <div className="p-10 text-center">
            <TrendingUp className="mx-auto h-10 w-10 text-muted-foreground/20" />
            <p className="mt-2 text-sm text-muted-foreground">{t("analytics.importData")}</p>
          </div>
        </div>
      </AnimatedSection>
    </AnimatedPage>
  );
}
