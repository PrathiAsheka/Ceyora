"use client";

import { motion } from "framer-motion";
import { Wallet, CreditCard, AlertCircle, TrendingUp, ArrowRight, DollarSign } from "lucide-react";
import { AnimatedCounter } from "@/components/animated-counter";
import { AnimatedPage, AnimatedSection } from "@/components/animated-page";
import { useI18n } from "@/lib/i18n";

export default function FinanceDashboardPage() {
  const { t } = useI18n();

  const financeKpis = [
    { title: t("finance.expectedRevenue"), value: 0, prefix: "LKR ", icon: Wallet, gradient: "from-blue-500 to-cyan-400", glow: "shadow-blue-500/20", bg: "from-blue-500/10 to-cyan-500/5" },
    { title: t("finance.collected"), value: 0, prefix: "LKR ", icon: CreditCard, gradient: "from-emerald-500 to-teal-400", glow: "shadow-emerald-500/20", bg: "from-emerald-500/10 to-teal-500/5" },
    { title: t("finance.outstanding"), value: 0, prefix: "LKR ", icon: AlertCircle, gradient: "from-red-500 to-orange-400", glow: "shadow-red-500/20", bg: "from-red-500/10 to-orange-500/5" },
    { title: t("finance.netIncome"), value: 0, prefix: "LKR ", icon: TrendingUp, gradient: "from-violet-500 to-purple-400", glow: "shadow-violet-500/20", bg: "from-violet-500/10 to-purple-500/5" },
  ];

  const actions = [
    { label: t("finance.feeCharges"), desc: t("finance.charges.subtitle"), href: "/finance/charges", gradient: "from-blue-500 to-cyan-400" },
    { label: t("finance.payments"), desc: t("finance.paymentsPage.subtitle"), href: "/finance/payments", gradient: "from-emerald-500 to-teal-400" },
    { label: t("finance.outstanding"), desc: t("finance.outstandingPage.subtitle"), href: "/finance/outstanding", gradient: "from-red-500 to-orange-400" },
    { label: t("finance.expenses"), desc: t("finance.expensesPage.subtitle"), href: "/finance/expenses", gradient: "from-violet-500 to-purple-400" },
  ];

  return (
    <AnimatedPage className="space-y-6">
      <AnimatedSection>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="gradient-text">{t("finance.title")}</span>
          </h1>
          <p className="text-muted-foreground mt-1">{t("finance.subtitle")}</p>
        </div>
      </AnimatedSection>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {financeKpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <AnimatedSection key={kpi.title}>
              <motion.div
                whileHover={{ y: -4, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`group relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br ${kpi.bg} p-5 shadow-sm hover:shadow-lg ${kpi.glow} transition-shadow duration-300`}
              >
                <div className={`rounded-xl bg-gradient-to-br ${kpi.gradient} p-2.5 shadow-lg ${kpi.glow} w-fit`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div className="mt-3">
                  <AnimatedCounter value={kpi.value} prefix={kpi.prefix} className="text-2xl font-bold tracking-tight" />
                  <p className="text-sm text-muted-foreground mt-0.5">{kpi.title}</p>
                </div>
              </motion.div>
            </AnimatedSection>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {actions.map((action) => (
          <AnimatedSection key={action.href}>
            <motion.a
              href={action.href}
              whileHover={{ y: -4, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="group glass-card rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 block"
            >
              <div className={`h-1.5 w-16 rounded-full bg-gradient-to-r ${action.gradient} mb-4`} />
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold group-hover:text-primary transition-colors">{action.label}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">{action.desc}</p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </motion.a>
          </AnimatedSection>
        ))}
      </div>

      <AnimatedSection>
        <div className="glass-card rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">{t("finance.revenueTrend")}</h2>
          <div className="h-48 flex items-center justify-center">
            <div className="text-center">
              <DollarSign className="mx-auto h-12 w-12 text-muted-foreground/20" />
              <p className="mt-2 text-sm text-muted-foreground">{t("finance.importFinancial")}</p>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </AnimatedPage>
  );
}
