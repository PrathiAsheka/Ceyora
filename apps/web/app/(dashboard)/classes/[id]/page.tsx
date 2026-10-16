"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Edit, Users, Clock, DollarSign, Trash2, GraduationCap } from "lucide-react";
import { AnimatedPage, AnimatedSection } from "@/components/animated-page";
import { useI18n } from "@/lib/i18n";

export default function ClassDetailPage() {
  const { t } = useI18n();
  return (
    <AnimatedPage className="space-y-6">
      <AnimatedSection>
        <div className="flex items-center gap-4">
          <motion.a href="/classes" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="rounded-xl p-2 hover:bg-muted/50">
            <ArrowLeft className="h-5 w-5" />
          </motion.a>
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight"><span className="gradient-text">{t("classes.details")}</span></h1>
            <p className="text-muted-foreground mt-1">{t("classes.detailSubtitle")}</p>
          </div>
          <div className="flex gap-2">
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 rounded-xl border border-border/50 px-4 py-2.5 text-sm font-medium hover:bg-muted/50">
              <Edit className="h-4 w-4" /> {t("common.edit")}
            </motion.button>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 rounded-xl border border-red-200 dark:border-red-800 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950">
              <Trash2 className="h-4 w-4" /> {t("common.delete")}
            </motion.button>
          </div>
        </div>
      </AnimatedSection>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <AnimatedSection>
            <div className="glass-card rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-5">{t("classes.classInfo")}</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  { label: t("classes.className"), value: "-" },
                  { label: t("classes.subject"), value: "-" },
                  { label: t("classes.gradeLevel"), value: "-" },
                  { label: t("classes.monthlyFee"), value: "LKR 0" },
                ].map((item) => (
                  <div key={item.label}>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{item.label}</label>
                    <p className="mt-1 font-semibold">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
          <AnimatedSection>
            <div className="glass-card rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">{t("classes.enrolledStudents")}</h2>
              <div className="p-10 text-center">
                <Users className="mx-auto h-10 w-10 text-muted-foreground/20" />
                <p className="mt-2 text-sm text-muted-foreground">{t("classes.noStudentsEnrolled")}</p>
              </div>
            </div>
          </AnimatedSection>
        </div>
        <div className="space-y-6">
          <AnimatedSection>
            <div className="glass-card rounded-2xl p-5 shadow-sm">
              <h3 className="font-semibold mb-3">{t("classes.schedule")}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{t("classes.noSchedule")}</span>
              </div>
            </div>
          </AnimatedSection>
          <AnimatedSection>
            <div className="glass-card rounded-2xl p-5 shadow-sm">
              <h3 className="font-semibold mb-3">{t("classes.teacher")}</h3>
              <p className="text-sm text-muted-foreground">{t("classes.notAssigned")}</p>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </AnimatedPage>
  );
}
