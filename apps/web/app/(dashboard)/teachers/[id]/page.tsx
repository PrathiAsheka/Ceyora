"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Edit, Phone, Mail, Users, GraduationCap, DollarSign, Trash2 } from "lucide-react";
import { AnimatedPage, AnimatedSection } from "@/components/animated-page";
import { useI18n } from "@/lib/i18n";

export default function TeacherDetailPage() {
  const { t } = useI18n();
  return (
    <AnimatedPage className="space-y-6">
      <AnimatedSection>
        <div className="flex items-center gap-4">
          <motion.a href="/teachers" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="rounded-xl p-2 hover:bg-muted/50">
            <ArrowLeft className="h-5 w-5" />
          </motion.a>
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight"><span className="gradient-text">{t("teachers.details")}</span></h1>
            <p className="text-muted-foreground mt-1">{t("teachers.detailSubtitle")}</p>
          </div>
          <div className="flex gap-2">
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 rounded-xl border border-border/50 px-4 py-2.5 text-sm font-medium hover:bg-muted/50">
              <Edit className="h-4 w-4" /> {t("teachers.mockEdit")}
            </motion.button>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 rounded-xl border border-red-200 dark:border-red-800 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950">
              <Trash2 className="h-4 w-4" /> {t("teachers.mockDelete")}
            </motion.button>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection>
        <div className="glass-card rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-400 text-white font-bold text-xl shadow-lg shadow-emerald-500/25">-</div>
            <div>
              <h2 className="text-xl font-bold">{t("teachers.mockName")}</h2>
              <p className="text-muted-foreground mt-0.5">{t("teachers.mockSubjects")}: -</p>
            </div>
          </div>
        </div>
      </AnimatedSection>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <AnimatedSection>
            <div className="glass-card rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">{t("teachers.mockAssignedClasses")}</h2>
              <div className="p-10 text-center">
                <GraduationCap className="mx-auto h-10 w-10 text-muted-foreground/20" />
                <p className="mt-2 text-sm text-muted-foreground">{t("teachers.mockNoClasses")}</p>
              </div>
            </div>
          </AnimatedSection>
          <AnimatedSection>
            <div className="glass-card rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">{t("teachers.compensation")}</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t("teachers.model")}</label>
                  <p className="mt-1 font-semibold">60% Revenue Split</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t("teachers.thisMonth")}</label>
                  <p className="mt-1 font-semibold">LKR 0</p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
        <div className="space-y-6">
          <AnimatedSection>
            <div className="glass-card rounded-2xl p-5 shadow-sm">
              <h3 className="font-semibold mb-3">{t("teachers.mockContact")}</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2"><Phone className="h-4 w-4" /> <span>-</span></div>
                <div className="flex items-center gap-2"><Mail className="h-4 w-4" /> <span>-</span></div>
              </div>
            </div>
          </AnimatedSection>
          <AnimatedSection>
            <div className="glass-card rounded-2xl p-5 shadow-sm">
              <h3 className="font-semibold mb-3">{t("teachers.mockStats")}</h3>
              <div className="space-y-2">
                {[
                  { label: t("teachers.mockTotalClasses"), value: "0" },
                  { label: t("teachers.mockTotalStudents"), value: "0" },
                  { label: t("teachers.mockTotalSubjects"), value: "0" },
                ].map((s) => (
                  <div key={s.label} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{s.label}</span>
                    <span className="font-semibold">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </AnimatedPage>
  );
}
