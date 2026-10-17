"use client";

import { motion } from "framer-motion";
import {
  Wallet,
  CreditCard,
  AlertCircle,
  TrendingUp,
  ArrowRight,
  DollarSign,
  FileText,
  Users,
  Smartphone,
  PieChart,
  ShieldCheck,
  Receipt,
  Scale,
  ArrowUpRight,
} from "lucide-react";
import { AnimatedCounter } from "@/components/animated-counter";
import { AnimatedPage, AnimatedSection } from "@/components/animated-page";
import { useI18n } from "@/lib/i18n";
import Link from "next/link";
import toast from "react-hot-toast";
import { ModuleSubNav } from "@/components/layout/module-sub-nav";
import { financeNavItems } from "@/lib/sub-nav-items";

export default function FinanceDashboardPage() {
  const { t } = useI18n();

  const financeKpis = [
    {
      title: "Expected Billing",
      value: 4050000,
      prefix: "LKR ",
      change: "Monthly Cycle (Cut-off: 10th)",
      icon: Wallet,
      gradient: "from-blue-500 to-cyan-400",
      glow: "shadow-blue-500/20",
      bg: "from-blue-500/10 to-cyan-500/5",
    },
    {
      title: "Collected Revenue",
      value: 3845000,
      prefix: "LKR ",
      change: "94.8% Collection Rate",
      icon: CreditCard,
      gradient: "from-emerald-500 to-teal-400",
      glow: "shadow-emerald-500/20",
      bg: "from-emerald-500/10 to-teal-500/5",
    },
    {
      title: "Outstanding Arrears",
      value: 205000,
      prefix: "LKR ",
      change: "14 Students in Arrears",
      icon: AlertCircle,
      gradient: "from-red-500 to-orange-400",
      glow: "shadow-red-500/20",
      bg: "from-red-500/10 to-orange-500/5",
    },
    {
      title: "Institute Net Profit",
      value: 1203000,
      prefix: "LKR ",
      change: "After Teacher Payouts & AC",
      icon: TrendingUp,
      gradient: "from-violet-500 to-purple-400",
      glow: "shadow-violet-500/20",
      bg: "from-violet-500/10 to-purple-500/5",
    },
  ];

  const modules = [
    {
      label: "Fee Charges & Concessions",
      desc: "Manage monthly billing charges, multi-subject bundles, sibling discounts (15-25%), and teacher free cards.",
      href: "/finance/charges",
      icon: Receipt,
      stat: "1,284 Active Charges",
    },
    {
      label: "Payments & Allocations",
      desc: "Double-entry payment vouchers, allocation mapping, PayHere webhook receipts, and payment reversals.",
      href: "/finance/payments",
      icon: CreditCard,
      stat: "LKR 3.84M Reconciled",
    },
    {
      label: "Outstanding Arrears & WhatsApp",
      desc: "Identify overdue fee charges and trigger 1-click personalized WhatsApp template notices to parents.",
      href: "/finance/outstanding",
      icon: Smartphone,
      stat: "14 Students Overdue",
    },
    {
      label: "Teacher Payouts & Settlement",
      desc: "Calculate 80/20 percentage revenue splits, deduct hall AC charges, and issue printable payout slips.",
      href: "/finance/teacher-payments",
      icon: Users,
      stat: "LKR 2.64M Settled",
    },
    {
      label: "Institute Expenses",
      desc: "Record and categorize operational overhead: lecture hall utilities, marketing, printouts, and staff salaries.",
      href: "/finance/expenses",
      icon: PieChart,
      stat: "LKR 420K Overhead",
    },
  ];

  return (
    <AnimatedPage className="space-y-6">
      {/* Header */}
      <AnimatedSection>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-[11px] font-bold text-emerald-500 uppercase tracking-widest">
                Double-Entry Accounting & Ledger Engine
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
              Financial <span className="gradient-text">Intelligence</span>
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Strict separation of charges and receipts, automated WhatsApp reminders, and teacher revenue splits.
            </p>
          </div>

          <Link href="/finance/outstanding">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-500/25"
            >
              <Smartphone className="h-4 w-4" />
              Arrears Follow-up & WhatsApp
            </motion.button>
          </Link>
        </div>

        {/* Finance Sub-Navigation Bar */}
        <div className="pt-2">
          <ModuleSubNav items={financeNavItems} />
        </div>
      </AnimatedSection>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {financeKpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <AnimatedSection key={kpi.title}>
              <motion.div
                whileHover={{ y: -4, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`group relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br ${kpi.bg} p-5 shadow-sm hover:shadow-xl ${kpi.glow} transition-all duration-300`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-muted-foreground uppercase">{kpi.title}</span>
                  <div className={`rounded-xl bg-gradient-to-br ${kpi.gradient} p-2 text-white shadow-md`}>
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <AnimatedCounter value={kpi.value} prefix={kpi.prefix} className="text-2xl font-black tracking-tight text-foreground" />
                  <p className="text-[11px] font-semibold text-muted-foreground mt-0.5">{kpi.change}</p>
                </div>
              </motion.div>
            </AnimatedSection>
          );
        })}
      </div>

      {/* Double-Entry Ledger Pipeline Card */}
      <AnimatedSection>
        <div className="glass-card rounded-3xl p-6 border border-border/60 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Scale className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-bold text-foreground">Tuition Revenue Waterfall Flow (October 2026)</h3>
            </div>
            <span className="text-[10px] font-mono font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              Reconciled • 100% Balanced
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl border border-border/50 bg-muted/20 text-center">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">1. Gross Invoiced</span>
              <p className="text-base font-black text-foreground mt-1">LKR 4.05M</p>
              <p className="text-[10px] text-muted-foreground">Standard Tuition Fees</p>
            </div>

            <div className="p-3.5 rounded-2xl border border-border/50 bg-muted/20 text-center">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">2. Waivers / Discounts</span>
              <p className="text-base font-black text-amber-500 mt-1">- LKR 125K</p>
              <p className="text-[10px] text-muted-foreground">Sibling & Free Cards</p>
            </div>

            <div className="p-3.5 rounded-2xl border border-border/50 bg-muted/20 text-center">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">3. Net Collected</span>
              <p className="text-base font-black text-emerald-500 mt-1">LKR 3.84M</p>
              <p className="text-[10px] text-muted-foreground">Cash + PayHere Gateways</p>
            </div>

            <div className="p-3.5 rounded-2xl border border-border/50 bg-muted/20 text-center">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">4. Faculty Payouts</span>
              <p className="text-base font-black text-primary mt-1">- LKR 2.64M</p>
              <p className="text-[10px] text-muted-foreground">80% Teacher Splits</p>
            </div>

            <div className="p-3.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-center">
              <span className="text-[10px] font-bold text-emerald-500 uppercase">5. Net Institute Share</span>
              <p className="text-base font-black text-foreground mt-1">LKR 1.20M</p>
              <p className="text-[10px] text-emerald-500 font-semibold">+ Hall Charge Retained</p>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Sub-Module Navigation Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {modules.map((m) => {
          const Icon = m.icon;
          return (
            <AnimatedSection key={m.href}>
              <Link href={m.href} className="block h-full">
                <div className="glass-card rounded-3xl p-6 border border-border/60 hover:border-primary/40 transition-all shadow-sm hover:shadow-xl h-full flex flex-col justify-between group">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-[10px] font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                        {m.stat}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                        {m.label}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        {m.desc}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs font-bold text-primary">
                    <span>Access Module</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </AnimatedSection>
          );
        })}
      </div>
    </AnimatedPage>
  );
}
