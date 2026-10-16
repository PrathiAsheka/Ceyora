"use client";

import { motion } from "framer-motion";
import { Globe, Check } from "lucide-react";
import { useState } from "react";
import { AnimatedPage, AnimatedSection } from "@/components/animated-page";
import { useI18n } from "@/lib/i18n";

export default function LanguagePage() {
  const [lang, setLang] = useState("en");
  const { t } = useI18n();

  return (
    <AnimatedPage className="space-y-6">
      <AnimatedSection>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight"><span className="gradient-text">{t("settings.languagePage.title")}</span></h1>
            <p className="text-muted-foreground mt-1">{t("settings.languagePage.subtitle")}</p>
          </div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-violet-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/25">
            <Globe className="h-4 w-4" /> {t("settings.languagePage.save")}
          </motion.button>
        </div>
      </AnimatedSection>

      <AnimatedSection>
        <div className="glass-card rounded-2xl p-6 shadow-sm max-w-lg">
          <h2 className="text-lg font-semibold mb-5">{t("settings.languagePage.interfaceLanguage")}</h2>
          <div className="space-y-3">
            {[
              { code: "en", name: "English", native: "English", flag: "🇬🇧" },
              { code: "si", name: "Sinhala", native: "සිංහල", flag: "🇱🇰" },
            ].map((language) => (
              <motion.button key={language.code} onClick={() => setLang(language.code)}
                whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                className={`w-full flex items-center justify-between rounded-2xl border p-5 transition-all ${
                  lang === language.code
                    ? "border-primary bg-gradient-to-r from-primary/10 to-violet-500/5 shadow-lg shadow-primary/10"
                    : "border-border/50 hover:border-border hover:bg-muted/20"
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{language.flag}</span>
                  <div className="text-left">
                    <p className="font-semibold">{language.name}</p>
                    <p className="text-sm text-muted-foreground">{language.native}</p>
                  </div>
                </div>
                {lang === language.code && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="rounded-full bg-gradient-to-br from-primary to-violet-500 p-1.5 shadow-lg shadow-primary/25">
                    <Check className="h-3 w-3 text-white" strokeWidth={3} />
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </AnimatedSection>
    </AnimatedPage>
  );
}
