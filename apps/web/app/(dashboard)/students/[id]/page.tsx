"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Edit, Phone, GraduationCap, DollarSign, AlertTriangle, Trash2 } from "lucide-react";
import { AnimatedPage, AnimatedSection } from "@/components/animated-page";
import { useI18n } from "@/lib/i18n";

export default function StudentDetailPage() {
  const { t } = useI18n();
  return (
    <AnimatedPage className="space-y-6">
      <AnimatedSection>
        <div className="flex items-center gap-4">
          <motion.a href="/students" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="rounded-xl p-2 hover:bg-muted/50">
            <ArrowLeft className="h-5 w-5" />
          </motion.a>
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight"><span className="gradient-text">{t("students.studentDetails")}</span></h1>
            <p className="text-muted-foreground mt-1">{t("students.viewProfile")}</p>
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

      <AnimatedSection>
        <div className="glass-card rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-violet-500 text-white font-bold text-xl shadow-lg shadow-primary/25">-</div>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">{t("students.mockName")}</h2>
              <p className="text-muted-foreground mt-0.5">{t("students.mockGuardian")}: - | {t("students.mockPhone")}: -</p>
            </div>
            <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 badge-glow-green">{t("students.mockStatus")}</span>
          </div>
        </div>
      </AnimatedSection>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <AnimatedSection>
            <div className="glass-card rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">{t("students.enrolledClasses")}</h2>
              <div className="p-10 text-center">
                <GraduationCap className="mx-auto h-10 w-10 text-muted-foreground/20" />
                <p className="mt-2 text-sm text-muted-foreground">{t("students.noClassesEnrolled")}</p>
              </div>
            </div>
          </AnimatedSection>
          <AnimatedSection>
            <div className="glass-card rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">{t("students.feeStatus")}</h2>
              <div className="p-10 text-center">
                <DollarSign className="mx-auto h-10 w-10 text-muted-foreground/20" />
                <p className="mt-2 text-sm text-muted-foreground">{t("students.noFeeData")}</p>
              </div>
            </div>
          </AnimatedSection>
        </div>
        <div className="space-y-6">
          <AnimatedSection>
            <div className="glass-card rounded-2xl p-5 shadow-sm">
              <h3 className="font-semibold mb-3">{t("students.contact")}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" /> <span>-</span>
              </div>
            </div>
          </AnimatedSection>
          <AnimatedSection>
            <div className="glass-card rounded-2xl p-5 shadow-sm">
              <h3 className="font-semibold mb-3">{t("students.attendanceSummary")}</h3>
              <div className="space-y-2">
                {[
                  { label: t("students.thisMonth"), value: "0%" },
                  { label: t("students.overall"), value: "0%" },
                ].map((s) => (
                  <div key={s.label} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{s.label}</span>
                    <span className="font-semibold">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
          <AnimatedSection>
            <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-gradient-to-r from-amber-50 to-amber-500/5 dark:from-amber-950/50 p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <span className="text-sm font-semibold text-amber-600">{t("students.mockOutstanding")}: LKR 0</span>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </AnimatedPage>
  );
}
