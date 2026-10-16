"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Edit, Users, GraduationCap, DollarSign, Trash2 } from "lucide-react";
import { AnimatedPage, AnimatedSection } from "@/components/animated-page";
import { useI18n } from "@/lib/i18n";

export default function InstituteDetailPage() {
  const { t } = useI18n();
  return (
    <AnimatedPage className="space-y-6">
      <AnimatedSection>
        <div className="flex items-center gap-4">
          <motion.a href="/institutes" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="rounded-xl p-2 hover:bg-muted/50">
            <ArrowLeft className="h-5 w-5" />
          </motion.a>
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight"><span className="gradient-text">{t("institutes.details")}</span></h1>
            <p className="text-muted-foreground mt-1">{t("institutes.detailSubtitle")}</p>
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

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: t("nav.students"), value: "0", icon: Users, gradient: "from-blue-500 to-cyan-400", bg: "from-blue-500/10 to-cyan-500/5" },
          { label: t("nav.classes"), value: "0", icon: GraduationCap, gradient: "from-emerald-500 to-teal-400", bg: "from-emerald-500/10 to-teal-500/5" },
          { label: t("nav.teachers"), value: "0", icon: Users, gradient: "from-violet-500 to-purple-400", bg: "from-violet-500/10 to-purple-500/5" },
          { label: t("institutes.revenue"), value: "LKR 0", icon: DollarSign, gradient: "from-amber-500 to-orange-400", bg: "from-amber-500/10 to-orange-500/5" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <AnimatedSection key={stat.label}>
              <motion.div whileHover={{ y: -3 }} className={`rounded-2xl border border-border/50 bg-gradient-to-br ${stat.bg} p-5 shadow-sm`}>
                <div className={`rounded-xl bg-gradient-to-br ${stat.gradient} p-2.5 shadow-lg w-fit`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <p className="text-2xl font-bold mt-3">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            </AnimatedSection>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <AnimatedSection>
          <div className="glass-card rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-5">{t("institutes.info")}</h2>
            <div className="space-y-0">
              {[
                { label: t("institutes.name"), value: "-" },
                { label: t("institutes.phone"), value: "-" },
                { label: t("institutes.email"), value: "-" },
                { label: t("institutes.address"), value: "-" },
                { label: t("institutes.currency"), value: "LKR" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-3 border-b border-border/20 last:border-0">
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <span className="text-sm font-semibold">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
        <AnimatedSection>
          <div className="glass-card rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">{t("institutes.branches")}</h2>
            <div className="p-10 text-center">
              <Users className="mx-auto h-10 w-10 text-muted-foreground/20" />
              <p className="mt-2 text-sm text-muted-foreground">{t("institutes.noBranches")}</p>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </AnimatedPage>
  );
}
