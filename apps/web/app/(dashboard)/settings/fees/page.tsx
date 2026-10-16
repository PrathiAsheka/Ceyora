"use client";

import { motion } from "framer-motion";
import { DollarSign, Save, Plus, Trash2 } from "lucide-react";
import { AnimatedPage, AnimatedSection } from "@/components/animated-page";
import { useI18n } from "@/lib/i18n";

export default function FeesPage() {
  const { t } = useI18n();
  return (
    <AnimatedPage className="space-y-6">
      <AnimatedSection>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight"><span className="gradient-text">{t("settings.feesPage.title")}</span></h1>
            <p className="text-muted-foreground mt-1">{t("settings.feesPage.subtitle")}</p>
          </div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-violet-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/25">
            <Save className="h-4 w-4" /> {t("settings.feesPage.saveChanges")}
          </motion.button>
        </div>
      </AnimatedSection>

      <div className="grid gap-6 lg:grid-cols-2">
        <AnimatedSection>
          <div className="glass-card rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold">{t("settings.feesPage.feeStructure")}</h2>
              <motion.button whileHover={{ scale: 1.05 }} className="flex items-center gap-1 rounded-lg border border-border/50 px-3 py-1.5 text-xs font-semibold hover:bg-muted/50">
                <Plus className="h-3 w-3" /> {t("settings.feesPage.addTier")}
              </motion.button>
            </div>
            <div className="space-y-2">
              {[
                { name: "Standard", default: true, gradient: "from-blue-500 to-cyan-400" },
                { name: "Premium", default: false, gradient: "from-violet-500 to-purple-400" },
                { name: "Scholarship", default: false, gradient: "from-emerald-500 to-teal-400" },
              ].map((tier) => (
                <motion.div key={tier.name} whileHover={{ x: 2 }}
                  className="flex items-center justify-between rounded-xl border border-border/30 p-3.5 hover:bg-muted/20 transition-all">
                  <div className="flex items-center gap-3">
                    <div className={`h-2 w-2 rounded-full bg-gradient-to-r ${tier.gradient}`} />
                    <span className="font-semibold text-sm">{tier.name}</span>
                    {tier.default && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">Default</span>
                    )}
                  </div>
                  <motion.button whileHover={{ scale: 1.1 }} className="rounded p-1 hover:bg-red-500/10 text-red-500"><Trash2 className="h-3.5 w-3.5" /></motion.button>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div className="glass-card rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold">{t("settings.feesPage.discountRules")}</h2>
              <motion.button whileHover={{ scale: 1.05 }} className="flex items-center gap-1 rounded-lg border border-border/50 px-3 py-1.5 text-xs font-semibold hover:bg-muted/50">
                <Plus className="h-3 w-3" /> {t("settings.feesPage.addRule")}
              </motion.button>
            </div>
            <div className="space-y-2">
              {[
                { name: "Early Payment (5%)", type: "Early Payment", value: "5%", gradient: "from-emerald-500 to-teal-400" },
                { name: "Sibling (10%)", type: "Sibling", value: "10%", gradient: "from-amber-500 to-orange-400" },
              ].map((rule) => (
                <motion.div key={rule.name} whileHover={{ x: 2 }}
                  className="flex items-center justify-between rounded-xl border border-border/30 p-3.5 hover:bg-muted/20 transition-all">
                  <div className="flex items-center gap-3">
                    <div className={`h-2 w-2 rounded-full bg-gradient-to-r ${rule.gradient}`} />
                    <div>
                      <span className="font-semibold text-sm">{rule.name}</span>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{rule.type} - {rule.value} discount</p>
                    </div>
                  </div>
                  <motion.button whileHover={{ scale: 1.1 }} className="rounded p-1 hover:bg-red-500/10 text-red-500"><Trash2 className="h-3.5 w-3.5" /></motion.button>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </AnimatedPage>
  );
}
