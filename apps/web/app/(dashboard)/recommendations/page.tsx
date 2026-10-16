"use client";

import { motion } from "framer-motion";
import { Lightbulb, AlertTriangle, CheckCircle2, Info, ArrowRight, Sparkles } from "lucide-react";
import { AnimatedPage, AnimatedSection } from "@/components/animated-page";
import { useI18n } from "@/lib/i18n";

export default function RecommendationsPage() {
  const { t } = useI18n();
  return (
    <AnimatedPage className="space-y-6">
      <AnimatedSection>
        <div>
          <h1 className="text-3xl font-bold tracking-tight"><span className="gradient-text">{t("recommendations.title")}</span></h1>
          <p className="text-muted-foreground mt-1">{t("recommendations.subtitle")}</p>
        </div>
      </AnimatedSection>

      <AnimatedSection>
        <div className="rounded-2xl border border-primary/10 bg-gradient-to-br from-primary/5 via-violet-500/5 to-primary/5 p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="rounded-xl bg-primary/10 p-2"><Sparkles className="h-5 w-5 text-primary" /></div>
            <h2 className="font-semibold text-lg">{t("recommendations.actionRequired")}</h2>
          </div>
          <div className="space-y-3">
            {[
              { issue: t("recommendations.platformSetup"), action: t("recommendations.platformSetupDesc"), priority: "High" },
              { issue: t("recommendations.noFeeData"), action: t("recommendations.noFeeDataDesc"), priority: "Medium" },
              { issue: t("recommendations.noAttendance"), action: t("recommendations.noAttendanceDesc"), priority: "Medium" },
            ].map((rec, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.08 }}
                className="flex items-start gap-3 rounded-xl bg-background/80 p-4 border border-border/30">
                <div className="mt-0.5">
                  {rec.priority === "High" ? <AlertTriangle className="h-4 w-4 text-red-500" /> : <Info className="h-4 w-4 text-blue-500" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm">{rec.issue}</p>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      rec.priority === "High" ? "bg-red-500/10 text-red-600 badge-glow-red" : "bg-blue-500/10 text-blue-600"
                    }`}>{rec.priority}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{rec.action}</p>
                </div>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  className="rounded-lg border border-border/50 px-3 py-1.5 text-[11px] font-semibold hover:bg-muted/50 flex items-center gap-1 shrink-0">
                  {t("recommendations.takeAction")} <ArrowRight className="h-3 w-3" />
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection>
        <div className="glass-card rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            <h2 className="font-semibold">{t("recommendations.completedActions")}</h2>
          </div>
          <div className="p-10 text-center">
            <CheckCircle2 className="mx-auto h-10 w-10 text-muted-foreground/20" />
            <p className="mt-2 text-sm text-muted-foreground">{t("recommendations.noCompleted")}</p>
          </div>
        </div>
      </AnimatedSection>
    </AnimatedPage>
  );
}
