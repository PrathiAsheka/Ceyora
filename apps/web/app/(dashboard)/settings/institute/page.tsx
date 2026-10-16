"use client";

import { motion } from "framer-motion";
import { Building2, Save } from "lucide-react";
import { AnimatedPage, AnimatedSection } from "@/components/animated-page";
import { useI18n } from "@/lib/i18n";

export default function InstituteSettingsPage() {
  const { t } = useI18n();
  return (
    <AnimatedPage className="space-y-6">
      <AnimatedSection>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight"><span className="gradient-text">{t("settings.institutePage.title")}</span></h1>
            <p className="text-muted-foreground mt-1">{t("settings.institutePage.subtitle")}</p>
          </div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-violet-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/25">
            <Save className="h-4 w-4" /> {t("settings.institutePage.saveChanges")}
          </motion.button>
        </div>
      </AnimatedSection>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <AnimatedSection>
            <div className="glass-card rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-5">{t("settings.institutePage.basicInfo")}</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  { label: t("settings.institutePage.instituteName"), type: "text", placeholder: "Enter institute name", span: false },
                  { label: t("settings.institutePage.phone"), type: "tel", placeholder: "+94771234567", span: false },
                  { label: t("settings.institutePage.email"), type: "email", placeholder: "info@institute.lk", span: false },
                  { label: t("settings.institutePage.currency"), type: "select", span: false },
                  { label: t("settings.institutePage.address"), type: "textarea", span: true },
                ].map((field) => (
                  <div key={field.label} className={field.span ? "md:col-span-2" : ""}>
                    <label className="text-sm font-semibold">{field.label}</label>
                    {field.type === "select" ? (
                      <select className="mt-1.5 w-full rounded-xl border border-border/50 bg-muted/30 px-4 py-2.5 text-sm focus:outline-none focus:bg-background focus:border-primary/30 focus-glow transition-all">
                        <option>LKR - Sri Lankan Rupee</option>
                        <option>USD - US Dollar</option>
                      </select>
                    ) : field.type === "textarea" ? (
                      <textarea className="mt-1.5 w-full rounded-xl border border-border/50 bg-muted/30 px-4 py-2.5 text-sm focus:outline-none focus:bg-background focus:border-primary/30 focus-glow transition-all" rows={3} placeholder="Institute address" />
                    ) : (
                      <input type={field.type} className="mt-1.5 w-full rounded-xl border border-border/50 bg-muted/30 px-4 py-2.5 text-sm focus:outline-none focus:bg-background focus:border-primary/30 focus-glow transition-all" placeholder={field.placeholder} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>

        <AnimatedSection>
          <div className="glass-card rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">{t("settings.institutePage.logo")}</h2>
            <motion.div whileHover={{ scale: 1.01 }}
              className="flex aspect-square items-center justify-center rounded-2xl border-2 border-dashed border-border/40 bg-muted/20 cursor-pointer hover:border-primary/30 hover:bg-primary/5 transition-all">
              <div className="text-center">
                <Building2 className="mx-auto h-12 w-12 text-muted-foreground/20" />
                <p className="mt-2 text-sm text-muted-foreground">{t("settings.institutePage.clickToUpload")}</p>
                <p className="text-[11px] text-muted-foreground/60">{t("settings.institutePage.logoFormats")}</p>
              </div>
            </motion.div>
          </div>
        </AnimatedSection>
      </div>
    </AnimatedPage>
  );
}
