"use client";

import { motion } from "framer-motion";
import { BookOpen, AlertTriangle, TrendingDown } from "lucide-react";
import { AnimatedPage, AnimatedSection } from "@/components/animated-page";
import { useI18n } from "@/lib/i18n";

export default function TopicsPage() {
  const { t } = useI18n();

  return (
    <AnimatedPage className="space-y-6">
      <AnimatedSection>
        <div>
          <h1 className="text-3xl font-bold tracking-tight"><span className="gradient-text">{t("academic.topicsPage.title")}</span></h1>
          <p className="text-muted-foreground mt-1">{t("academic.topicsPage.subtitle")}</p>
        </div>
      </AnimatedSection>

      <AnimatedSection>
        <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-gradient-to-r from-amber-50 to-amber-500/5 dark:from-amber-950/50 dark:to-amber-900/20 p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-amber-500/10 p-2"><AlertTriangle className="h-5 w-5 text-amber-600" /></div>
            <p className="text-sm text-amber-700 dark:text-amber-200">{t("academic.topicsPage.requiresData")}</p>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection>
        <div className="glass-card rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown className="h-5 w-5 text-red-500" />
            <h2 className="text-lg font-semibold">{t("academic.topicsPage.weakTopics")}</h2>
          </div>
          <div className="p-10 text-center">
            <BookOpen className="mx-auto h-10 w-10 text-muted-foreground/20" />
            <p className="mt-2 text-sm text-muted-foreground">{t("academic.topicsPage.noTopicData")}</p>
          </div>
        </div>
      </AnimatedSection>
    </AnimatedPage>
  );
}
