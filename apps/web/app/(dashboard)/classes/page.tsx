"use client";

import { motion } from "framer-motion";
import { Plus, Clock, Users, Eye, Edit, GraduationCap, Sparkles } from "lucide-react";
import { AnimatedPage, AnimatedSection } from "@/components/animated-page";
import { useI18n } from "@/lib/i18n";

const gradients = [
  "from-blue-500 to-cyan-400",
  "from-emerald-500 to-teal-400",
  "from-violet-500 to-purple-400",
];
const glows = [
  "shadow-blue-500/20",
  "shadow-emerald-500/20",
  "shadow-violet-500/20",
];

export default function ClassesPage() {
  const { t } = useI18n();
  const mockClasses = t("classes.mock");
  return (
    <AnimatedPage className="space-y-6">
      <AnimatedSection>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              <span className="gradient-text">{t("classes.title")}</span>
            </h1>
            <p className="text-muted-foreground mt-1">{t("classes.subtitle")}</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-violet-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow"
          >
            <Plus className="h-4 w-4" />
            {t("classes.addClass")}
          </motion.button>
        </div>
      </AnimatedSection>

      {/* Class Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.isArray(mockClasses) && mockClasses.map((cls: any, i: number) => (
          <AnimatedSection key={i}>
            <motion.div
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="group glass-card rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`h-1.5 w-16 rounded-full bg-gradient-to-r ${gradients[i % gradients.length]}`} />
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <motion.button whileHover={{ scale: 1.1 }} className="rounded-lg p-1.5 hover:bg-muted/60"><Eye className="h-4 w-4" /></motion.button>
                  <motion.button whileHover={{ scale: 1.1 }} className="rounded-lg p-1.5 hover:bg-muted/60"><Edit className="h-4 w-4" /></motion.button>
                </div>
              </div>
              <h3 className="font-semibold text-base group-hover:text-primary transition-colors">{cls.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{cls.teacher}</p>
              <div className="mt-4 flex items-center justify-between text-sm">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  {cls.time}
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Users className="h-3.5 w-3.5" />
                  {cls.students}
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border/30 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{t("classes.monthlyFee")}</span>
                <span className="font-bold text-primary">{cls.fee}</span>
              </div>
            </motion.div>
          </AnimatedSection>
        ))}
      </div>
    </AnimatedPage>
  );
}
