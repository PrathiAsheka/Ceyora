"use client";

import { motion } from "framer-motion";
import {
  Building2,
  BookOpen,
  DollarSign,
  Shield,
  Globe,
  ArrowRight,
  Sparkles,
  Server,
  Lock,
  FileCheck2,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { AnimatedPage, AnimatedSection } from "@/components/animated-page";
import { useI18n } from "@/lib/i18n";
import { mockInstitutes } from "@/lib/mock-data";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ModuleSubNav } from "@/components/layout/module-sub-nav";
import { settingsNavItems } from "@/lib/sub-nav-items";

export default function SettingsPage() {
  const { t } = useI18n();

  const settingsGroups = [
    {
      titleKey: "settings.instituteProfile",
      descKey: "settings.instituteProfileDesc",
      href: "/settings/institute",
      gradient: "from-blue-500 to-cyan-400",
      icon: Building2,
      counter: "3 Branches Active",
      badge: "Tenant Primary",
    },
    {
      titleKey: "settings.feeConfig",
      descKey: "settings.feeConfigDesc",
      href: "/settings/fees",
      gradient: "from-violet-500 to-purple-400",
      icon: DollarSign,
      counter: "5 Discount Rules",
      badge: "PayHere Live",
    },
    {
      titleKey: "settings.rbac",
      descKey: "settings.rbacDesc",
      href: "/settings/rbac",
      gradient: "from-amber-500 to-orange-400",
      icon: Shield,
      counter: "4 Tier Matrix",
      badge: "PDPA Strict",
    },
    {
      titleKey: "settings.subjects",
      descKey: "settings.subjectsDesc",
      href: "/settings/subjects",
      gradient: "from-emerald-500 to-teal-400",
      icon: BookOpen,
      counter: "6 A/L & O/L Subjects",
      badge: "National Syllabus",
    },
    {
      titleKey: "settings.language",
      descKey: "settings.languageDesc",
      href: "/settings/language",
      gradient: "from-cyan-500 to-blue-400",
      icon: Globe,
      counter: "EN • සිංහල • தமிழ்",
      badge: "Localization Active",
    },
  ];

  return (
    <AnimatedPage className="space-y-6">
      {/* Breadcrumbs & Navigation */}
      <Breadcrumbs items={[{ label: "Settings" }]} />

      {/* Header */}
      <AnimatedSection>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <Server className="h-3.5 w-3.5" /> Platform Configuration Engine
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-500">
                <FileCheck2 className="h-3 w-3" /> System Health: 100% OK
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              <span className="gradient-text">{t("settings.title")}</span>
            </h1>
            <p className="text-muted-foreground mt-1">{t("settings.subtitle")}</p>
          </div>
        </div>

        {/* Settings Sub-Navigation Bar */}
        <div className="pt-2">
          <ModuleSubNav items={settingsNavItems} />
        </div>
      </AnimatedSection>

      {/* System Telemetry Banner */}
      <AnimatedSection>
        <div className="glass-card rounded-2xl p-5 shadow-sm border border-border/40 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-muted-foreground font-medium">Tenant Organization</p>
            <p className="text-sm font-bold text-foreground mt-0.5">Apex Institute (Pvt) Ltd</p>
            <p className="text-[11px] text-muted-foreground">ID: inst-1 • Multi-branch</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Payment Gateway Engine</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <p className="text-sm font-bold text-foreground">PayHere (Production)</p>
            </div>
            <p className="text-[11px] text-muted-foreground">Merchant ID: 1224890</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Compliance Framework</p>
            <p className="text-sm font-bold text-emerald-600 mt-0.5">Sri Lanka PDPA Certified</p>
            <p className="text-[11px] text-muted-foreground">Act No. 9 of 2022 audited</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Platform Build</p>
            <p className="text-sm font-bold text-primary mt-0.5">v2.4.0 (Enterprise)</p>
            <p className="text-[11px] text-muted-foreground">Next.js 14 • Turbo Engine</p>
          </div>
        </div>
      </AnimatedSection>

      {/* Settings Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {settingsGroups.map((item) => {
          const Icon = item.icon;
          return (
            <AnimatedSection key={item.href}>
              <Link href={item.href} className="block group h-full">
                <motion.div
                  whileHover={{ y: -6, scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="glass-card rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col justify-between border border-border/40 hover:border-primary/40"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div className={`rounded-xl bg-gradient-to-br ${item.gradient} p-3 shadow-lg`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-muted/60 text-muted-foreground">
                          {item.badge}
                        </span>
                        <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                    <h3 className="mt-4 font-bold text-base group-hover:text-primary transition-colors">
                      {t(item.titleKey)}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                      {t(item.descKey)}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-border/30 flex items-center justify-between text-xs">
                    <span className="font-semibold text-foreground/80">{item.counter}</span>
                    <span className="text-primary font-semibold text-[11px] group-hover:underline">
                      Configure &rarr;
                    </span>
                  </div>
                </motion.div>
              </Link>
            </AnimatedSection>
          );
        })}
      </div>
    </AnimatedPage>
  );
}
