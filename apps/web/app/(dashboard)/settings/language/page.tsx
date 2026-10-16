"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  Check,
  Save,
  Clock,
  Calendar,
  Sparkles,
  DollarSign,
  Languages,
} from "lucide-react";
import { AnimatedPage, AnimatedSection } from "@/components/animated-page";
import { useI18n } from "@/lib/i18n";

export default function LanguagePage() {
  const { locale, setLocale, t } = useI18n();
  const [isSaved, setIsSaved] = useState(false);

  // Regional preferences
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");
  const [timeFormat, setTimeFormat] = useState("12h");
  const [currencyDisplay, setCurrencyDisplay] = useState("LKR");
  const [timezone, setTimezone] = useState("Asia/Colombo");

  const languages = [
    {
      code: "en" as const,
      name: "English",
      native: "English (United Kingdom / Sri Lanka)",
      flag: "🇬🇧",
      status: "Active",
      description: "Default international English with Sri Lankan educational terminology",
    },
    {
      code: "si" as const,
      name: "Sinhala",
      native: "සිංහල (ශ්‍රී ලංකා)",
      flag: "🇱🇰",
      status: "Active",
      description: "රාජ්‍ය භාෂා ප්‍රතිපත්තියට අනුකූලව පූර්ණ සිංහල පරිවර්තනය",
    },
  ];

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <AnimatedPage className="space-y-6">
      {/* Header */}
      <AnimatedSection>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <Globe className="h-3.5 w-3.5" /> Localization & Region Engine
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-500">
                <Check className="h-3 w-3" /> Asia/Colombo UTC+05:30
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              <span className="gradient-text">{t("settings.languagePage.title")}</span>
            </h1>
            <p className="text-muted-foreground mt-1">{t("settings.languagePage.subtitle")}</p>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-violet-500 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-primary/25"
            >
              {isSaved ? (
                <>
                  <Check className="h-4 w-4" strokeWidth={3} /> Preferences Saved!
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" /> Save Regional Settings
                </>
              )}
            </motion.button>
          </div>
        </div>
      </AnimatedSection>

      {/* Save Success Banner */}
      <AnimatePresence>
        {isSaved && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 flex items-center justify-between text-xs text-emerald-700 dark:text-emerald-300 font-semibold"
          >
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-500" strokeWidth={3} />
              <span>Locale and date/currency formatting applied across all receipts and dashboards.</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column: Language Switcher (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <AnimatedSection>
            <div className="glass-card rounded-2xl p-6 shadow-sm border border-border/40 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                    <Languages className="h-4 w-4 text-primary" />
                    {t("settings.languagePage.interfaceLanguage")}
                  </h2>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Select active language dictionary for the Ceyora dashboard and printable vouchers
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                {languages.map((item) => {
                  const isSelected = locale === item.code;
                  return (
                    <motion.div
                      key={item.code}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setLocale(item.code)}
                      className={`cursor-pointer rounded-2xl border p-4 transition-all flex items-center justify-between gap-4 ${
                        isSelected
                          ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                          : "border-border/40 hover:border-border/80 bg-background/50"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-3xl select-none">{item.flag}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-foreground">{item.name}</h4>
                            <span className="rounded-full bg-primary/10 px-2 py-0.2 text-[10px] font-bold text-primary">
                              {item.native}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.description}</p>
                        </div>
                      </div>

                      <div className="shrink-0">
                        {isSelected ? (
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white shadow-sm shadow-primary/30">
                            <Check className="h-3.5 w-3.5" strokeWidth={3} />
                          </div>
                        ) : (
                          <div className="h-6 w-6 rounded-full border border-border/60" />
                        )}
                      </div>
                    </motion.div>
                  );
                })}

                {/* Tamil Preview Notice */}
                <div className="rounded-xl border border-dashed border-border/50 p-3.5 bg-muted/10 flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🇱🇰</span>
                    <span>Tamil (தமிழ்) localization pack for Northern & Eastern provinces is currently in testing</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                    Coming Soon
                  </span>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Regional Formats */}
          <AnimatedSection>
            <div className="glass-card rounded-2xl p-6 shadow-sm border border-border/40 space-y-4">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4 text-violet-500" />
                Date, Time & Financial Standards
              </h2>

              <div className="grid gap-4 md:grid-cols-2 text-xs pt-1">
                <div>
                  <label className="font-semibold text-foreground/80 block mb-1">Date Format Preference</label>
                  <select
                    value={dateFormat}
                    onChange={(e) => setDateFormat(e.target.value)}
                    className="w-full rounded-xl border border-border/50 bg-background/50 px-3.5 py-2.5 text-xs focus:outline-none"
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY (e.g. 17/10/2026 - Sri Lankan Standard)</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD (ISO 8601)</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY (US Format)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-foreground/80 block mb-1">Time Format</label>
                  <select
                    value={timeFormat}
                    onChange={(e) => setTimeFormat(e.target.value)}
                    className="w-full rounded-xl border border-border/50 bg-background/50 px-3.5 py-2.5 text-xs focus:outline-none"
                  >
                    <option value="12h">12-Hour Clock with AM/PM (e.g. 08:30 AM)</option>
                    <option value="24h">24-Hour Military Time (e.g. 20:30)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-foreground/80 block mb-1">Currency Prefix Display</label>
                  <select
                    value={currencyDisplay}
                    onChange={(e) => setCurrencyDisplay(e.target.value)}
                    className="w-full rounded-xl border border-border/50 bg-background/50 px-3.5 py-2.5 text-xs focus:outline-none"
                  >
                    <option value="LKR">LKR (e.g. LKR 6,500.00)</option>
                    <option value="Rs">රු. / Rs. (e.g. රු. 6,500.00)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-foreground/80 block mb-1">Regional Timezone</label>
                  <input
                    type="text"
                    disabled
                    value="Asia/Colombo (UTC +05:30 Sri Lanka Standard Time)"
                    className="w-full rounded-xl border border-border/50 bg-muted/30 px-3.5 py-2.5 text-xs text-muted-foreground cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>

        {/* Right Column: Live Regional Preview (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <AnimatedSection>
            <div className="glass-card rounded-2xl p-6 shadow-sm border border-border/40 space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <h3 className="font-bold text-sm text-foreground">Live Regional Formatting Preview</h3>
              </div>

              <div className="rounded-xl border border-border/40 bg-muted/20 p-5 space-y-4 text-xs">
                <div>
                  <span className="text-muted-foreground text-[11px]">Selected Interface Language:</span>
                  <p className="font-bold text-foreground text-sm mt-0.5">
                    {locale === "en" ? "English (United Kingdom / LK)" : "සිංහල (ශ්‍රී ලංකා)"}
                  </p>
                </div>

                <div className="border-t border-border/30 pt-3">
                  <span className="text-muted-foreground text-[11px]">Formatted System Timestamp:</span>
                  <p className="font-mono font-bold text-foreground text-sm mt-0.5">
                    {dateFormat === "DD/MM/YYYY" ? "17/10/2026" : "2026-10-17"} •{" "}
                    {timeFormat === "12h" ? "08:30:15 AM" : "08:30:15"}
                  </p>
                </div>

                <div className="border-t border-border/30 pt-3">
                  <span className="text-muted-foreground text-[11px]">Tuition Fee Currency Format:</span>
                  <p className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-lg mt-0.5">
                    {currencyDisplay === "LKR" ? "LKR 6,500.00" : "රු. 6,500.00"}
                  </p>
                  <p className="text-[10px] text-muted-foreground">Standard A/L Combined Mathematics Monthly Fee</p>
                </div>

                <div className="border-t border-border/30 pt-3">
                  <span className="text-muted-foreground text-[11px]">Receipt Sign-off Clause:</span>
                  <p className="text-[11px] text-foreground/80 italic mt-0.5">
                    {locale === "si"
                      ? "මෙම ලදුපත 2022 අංක 09 දරන ශ්‍රී ලංකා පුද්ගලික දත්ත ආරක්ෂණ පනතට අනුකූලව නිකුත් කරන ලදී."
                      : "Certified issued under Sri Lanka Personal Data Protection Act No. 9 of 2022."}
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </AnimatedPage>
  );
}
