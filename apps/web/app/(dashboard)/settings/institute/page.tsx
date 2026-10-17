"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Save,
  Check,
  ShieldCheck,
  Upload,
  Globe,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  Sparkles,
} from "lucide-react";
import { AnimatedPage, AnimatedSection } from "@/components/animated-page";
import { useI18n } from "@/lib/i18n";
import { mockInstitutes } from "@/lib/mock-data";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ModuleSubNav } from "@/components/layout/module-sub-nav";
import { settingsNavItems } from "@/lib/sub-nav-items";

export default function InstituteSettingsPage() {
  const { t } = useI18n();
  const [isSaved, setIsSaved] = useState(false);

  // Form states initialized with realistic Sri Lankan tuition institute details
  const [name, setName] = useState("Apex Higher Education Institute (Pvt) Ltd");
  const [regNo, setRegNo] = useState("PV-00289410 / WP-EDU-2024-89");
  const [phone, setPhone] = useState("+94 11 282 5590");
  const [email, setEmail] = useState("admin@apexedu.lk");
  const [address, setAddress] = useState("No. 45/2, High Level Road, Nugegoda, Western Province, Sri Lanka");
  const [currency, setCurrency] = useState("LKR");
  const [billingCutOff, setBillingCutOff] = useState("10");
  const [attendanceGrace, setAttendanceGrace] = useState("15");
  const [smsGateway, setSmsGateway] = useState("meta_whatsapp");
  const [receiptFooter, setReceiptFooter] = useState(
    "All fee transactions are certified under Sri Lanka Personal Data Protection Act No. 9 of 2022. Fees once paid are non-transferable."
  );

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <AnimatedPage className="space-y-6">
      {/* Breadcrumbs & Navigation */}
      <Breadcrumbs items={[{ label: "Settings", href: "/settings" }, { label: "Institute Profile" }]} />

      {/* Header */}
      <AnimatedSection>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <Building2 className="h-3.5 w-3.5" /> Corporate Entity Profile
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-500">
                <ShieldCheck className="h-3 w-3" /> Ministry Reg Verified
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              <span className="gradient-text">{t("settings.institutePage.title")}</span>
            </h1>
            <p className="text-muted-foreground mt-1">{t("settings.institutePage.subtitle")}</p>
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
                  <Check className="h-4 w-4" strokeWidth={3} /> Changes Saved!
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" /> {t("settings.institutePage.saveChanges")}
                </>
              )}
            </motion.button>
          </div>
        </div>

        {/* Settings Sub-Navigation Bar */}
        <div className="pt-2">
          <ModuleSubNav items={settingsNavItems} />
        </div>
      </AnimatedSection>

      {/* Save Toast Banner */}
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
              <span>Institute configuration and receipt templates updated across all 3 active branches.</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Form: Basic & Legal Info (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <AnimatedSection>
            <div className="glass-card rounded-2xl p-6 shadow-sm border border-border/40 space-y-4">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" />
                {t("settings.institutePage.basicInfo")}
              </h2>

              <div className="grid gap-4 md:grid-cols-2 text-xs">
                <div>
                  <label className="font-semibold text-foreground/80 block mb-1">
                    {t("settings.institutePage.instituteName")}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-border/50 bg-background/50 px-3.5 py-2.5 text-xs focus:outline-none focus:border-primary/50"
                  />
                </div>

                <div>
                  <label className="font-semibold text-foreground/80 block mb-1">
                    Provincial / Ministry Registration No.
                  </label>
                  <input
                    type="text"
                    value={regNo}
                    onChange={(e) => setRegNo(e.target.value)}
                    className="w-full rounded-xl border border-border/50 bg-background/50 px-3.5 py-2.5 text-xs focus:outline-none focus:border-primary/50"
                  />
                </div>

                <div>
                  <label className="font-semibold text-foreground/80 block mb-1">
                    Official Telephone / Hotline
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-border/50 bg-background/50 px-3.5 py-2.5 text-xs focus:outline-none focus:border-primary/50"
                  />
                </div>

                <div>
                  <label className="font-semibold text-foreground/80 block mb-1">
                    Primary Administration Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-border/50 bg-background/50 px-3.5 py-2.5 text-xs focus:outline-none focus:border-primary/50"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="font-semibold text-foreground/80 block mb-1">
                    Headquarters Address
                  </label>
                  <textarea
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full rounded-xl border border-border/50 bg-background/50 px-3.5 py-2 text-xs focus:outline-none focus:border-primary/50"
                  />
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Operational Policies Section */}
          <AnimatedSection>
            <div className="glass-card rounded-2xl p-6 shadow-sm border border-border/40 space-y-4">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <Clock className="h-4 w-4 text-violet-500" />
                Tuition & Attendance Operating Policies
              </h2>

              <div className="grid gap-4 md:grid-cols-2 text-xs">
                <div>
                  <label className="font-semibold text-foreground/80 block mb-1">
                    Default Currency Code
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full rounded-xl border border-border/50 bg-background/50 px-3.5 py-2.5 text-xs focus:outline-none"
                  >
                    <option value="LKR">LKR - Sri Lankan Rupee (රු.)</option>
                    <option value="USD">USD - US Dollar ($)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-foreground/80 block mb-1">
                    Monthly Billing Cut-Off Schedule
                  </label>
                  <select
                    value={billingCutOff}
                    onChange={(e) => setBillingCutOff(e.target.value)}
                    className="w-full rounded-xl border border-border/50 bg-background/50 px-3.5 py-2.5 text-xs focus:outline-none"
                  >
                    <option value="5">5th of every month</option>
                    <option value="10">10th of every month (Standard)</option>
                    <option value="15">15th of every month</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-foreground/80 block mb-1">
                    QR Attendance Late Grace (Minutes)
                  </label>
                  <input
                    type="number"
                    value={attendanceGrace}
                    onChange={(e) => setAttendanceGrace(e.target.value)}
                    className="w-full rounded-xl border border-border/50 bg-background/50 px-3.5 py-2.5 text-xs focus:outline-none focus:border-primary/50"
                  />
                </div>

                <div>
                  <label className="font-semibold text-foreground/80 block mb-1">
                    Notification Dispatch Gateway
                  </label>
                  <select
                    value={smsGateway}
                    onChange={(e) => setSmsGateway(e.target.value)}
                    className="w-full rounded-xl border border-border/50 bg-background/50 px-3.5 py-2.5 text-xs focus:outline-none"
                  >
                    <option value="meta_whatsapp">Meta WhatsApp Cloud API (Automated)</option>
                    <option value="dialog_sms">Dialog Axiata Corporate SMS API</option>
                    <option value="mobitel_sms">Mobitel mCash & SMS Gateway</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="font-semibold text-foreground/80 block mb-1">
                    Legal Receipt Footer (PDPA Compliance)
                  </label>
                  <textarea
                    rows={2}
                    value={receiptFooter}
                    onChange={(e) => setReceiptFooter(e.target.value)}
                    className="w-full rounded-xl border border-border/50 bg-background/50 px-3.5 py-2 text-xs focus:outline-none focus:border-primary/50"
                  />
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>

        {/* Right Column: Brand Assets & Preview (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <AnimatedSection>
            <div className="glass-card rounded-2xl p-6 shadow-sm border border-border/40 space-y-4">
              <h2 className="text-base font-bold text-foreground">Institute Seal & Logo</h2>

              <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border/40 p-6 text-center hover:border-primary/40 transition-colors bg-muted/10 cursor-pointer">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center text-white shadow-lg shadow-primary/20 mb-3">
                  <Sparkles className="h-8 w-8" />
                </div>
                <h4 className="font-bold text-xs">Apex Institute Crest</h4>
                <p className="text-[11px] text-muted-foreground mt-0.5">PNG, SVG, or WEBP up to 5MB</p>
                <button className="mt-3 flex items-center gap-1 rounded-xl bg-background border border-border/50 px-3 py-1.5 text-xs font-semibold hover:bg-muted/40">
                  <Upload className="h-3 w-3" /> Replace Crest
                </button>
              </div>

              <div className="rounded-xl border border-border/30 bg-muted/20 p-4 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Active Branches:</span>
                  <span className="font-semibold text-foreground">{mockInstitutes.length} Centers</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Student Capacity:</span>
                  <span className="font-semibold text-foreground">2,500 Max</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cloud Storage:</span>
                  <span className="font-semibold text-foreground">24.8 GB / 100 GB</span>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </AnimatedPage>
  );
}
