"use client";

import { motion } from "framer-motion";
import { Building2, BookOpen, DollarSign, Shield, Globe, ArrowRight } from "lucide-react";
import { AnimatedPage, AnimatedSection } from "@/components/animated-page";
import { useI18n } from "@/lib/i18n";

const settingsGroups = [
  { titleKey: "settings.instituteProfile", descKey: "settings.instituteProfileDesc", href: "/settings/institute", gradient: "from-blue-500 to-cyan-400", icon: Building2 },
  { titleKey: "settings.subjects", descKey: "settings.subjectsDesc", href: "/settings/subjects", gradient: "from-emerald-500 to-teal-400", icon: BookOpen },
  { titleKey: "settings.feeConfig", descKey: "settings.feeConfigDesc", href: "/settings/fees", gradient: "from-violet-500 to-purple-400", icon: DollarSign },
  { titleKey: "settings.rbac", descKey: "settings.rbacDesc", href: "/settings/rbac", gradient: "from-amber-500 to-orange-400", icon: Shield },
  { titleKey: "settings.language", descKey: "settings.languageDesc", href: "/settings/language", gradient: "from-cyan-500 to-blue-400", icon: Globe },
];

export default function SettingsPage() {
  const { t } = useI18n();
  return (
    <AnimatedPage className="space-y-6">
      <AnimatedSection>
        <div>
          <h1 className="text-3xl font-bold tracking-tight"><span className="gradient-text">{t("settings.title")}</span></h1>
          <p className="text-muted-foreground mt-1">{t("settings.subtitle")}</p>
        </div>
      </AnimatedSection>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {settingsGroups.map((item) => {
          const Icon = item.icon;
          return (
            <AnimatedSection key={item.href}>
              <motion.a href={item.href}
                whileHover={{ y: -6, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="group glass-card rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 block"
              >
                <div className="flex items-start justify-between">
                  <div className={`rounded-xl bg-gradient-to-br ${item.gradient} p-2.5 shadow-lg`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="mt-4 font-semibold group-hover:text-primary transition-colors">{t(item.titleKey)}</h3>
                <p className="text-sm text-muted-foreground mt-1">{t(item.descKey)}</p>
              </motion.a>
            </AnimatedSection>
          );
        })}
      </div>
    </AnimatedPage>
  );
}
