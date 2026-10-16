"use client";

import { motion } from "framer-motion";
import { LifeBuoy, MessageSquare, Mail, ExternalLink, BookOpen, Bug, Lightbulb, ArrowRight } from "lucide-react";
import { AnimatedPage, AnimatedSection } from "@/components/animated-page";
import { useI18n } from "@/lib/i18n";

export default function SupportPage() {
  const { t } = useI18n();
  return (
    <AnimatedPage className="space-y-6">
      <AnimatedSection>
        <div>
          <h1 className="text-3xl font-bold tracking-tight"><span className="gradient-text">{t("support.title")}</span></h1>
          <p className="text-muted-foreground mt-1">{t("support.subtitle")}</p>
        </div>
      </AnimatedSection>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[
          { title: t("support.documentation"), desc: t("support.docDesc"), icon: BookOpen, gradient: "from-blue-500 to-cyan-400", action: t("support.viewDocs") },
          { title: t("support.reportBug"), desc: t("support.bugDesc"), icon: Bug, gradient: "from-red-500 to-orange-400", action: t("support.reportBugBtn") },
          { title: t("support.featureRequest"), desc: t("support.featureDesc"), icon: Lightbulb, gradient: "from-amber-500 to-orange-400", action: t("support.suggestFeature") },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <AnimatedSection key={item.title}>
              <motion.div whileHover={{ y: -6, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="group glass-card rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                <div className={`rounded-xl bg-gradient-to-br ${item.gradient} p-2.5 shadow-lg w-fit mb-4`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-semibold group-hover:text-primary transition-colors">{item.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-primary">
                  {item.action} <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            </AnimatedSection>
          );
        })}
      </div>

      <AnimatedSection>
        <div className="glass-card rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-5">{t("support.contactSupport")}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <motion.div whileHover={{ scale: 1.01 }} className="flex items-center gap-4 rounded-xl border border-border/30 p-4 hover:bg-muted/20 transition-all">
              <div className="rounded-xl bg-gradient-to-br from-primary to-violet-500 p-2.5 shadow-lg">
                <Mail className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-semibold">{t("support.email")}</p>
                <p className="text-sm text-muted-foreground">support@ceyora.lk</p>
              </div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.01 }} className="flex items-center gap-4 rounded-xl border border-border/30 p-4 hover:bg-muted/20 transition-all">
              <div className="rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 p-2.5 shadow-lg">
                <MessageSquare className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-semibold">{t("support.whatsapp")}</p>
                <p className="text-sm text-muted-foreground">+94771234567</p>
              </div>
            </motion.div>
          </div>
        </div>
      </AnimatedSection>
    </AnimatedPage>
  );
}
