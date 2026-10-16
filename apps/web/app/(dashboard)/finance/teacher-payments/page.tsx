"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Search,
  Filter,
  DollarSign,
  Printer,
  CheckCircle2,
  Clock,
  Building2,
  Calendar,
  CreditCard,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { AnimatedPage, AnimatedSection } from "@/components/animated-page";
import { mockTeachers, mockClasses } from "@/lib/mock-data";
import Link from "next/link";
import toast from "react-hot-toast";

export default function TeacherPaymentsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const settlements = mockTeachers.map((tea) => {
    const assigned = mockClasses.filter((c) => tea.assignedClassIds.includes(c.id));
    const gross = assigned.reduce((acc, c) => acc + c.monthlyCollection, 0);
    const instShare = assigned.reduce(
      (acc, c) => acc + Math.round(c.monthlyCollection * (c.instituteSharePercentage / 100)),
      0
    );
    const hallDeduction = assigned.reduce((acc, c) => acc + c.hallChargesDeduction, 0);
    const net = gross - instShare - hallDeduction;

    return {
      teacher: tea,
      classesCount: assigned.length,
      gross,
      instShare,
      hallDeduction,
      net,
      status: "settled",
    };
  });

  const filteredSettlements = settlements.filter(
    (s) =>
      s.teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.teacher.nic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.teacher.bankName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalGross = settlements.reduce((acc, s) => acc + s.gross, 0);
  const totalNetPaid = settlements.reduce((acc, s) => acc + s.net, 0);
  const totalInstituteShare = settlements.reduce((acc, s) => acc + s.instShare, 0);
  const totalHallDeductions = settlements.reduce((acc, s) => acc + s.hallDeduction, 0);

  return (
    <AnimatedPage className="space-y-6">
      {/* Header */}
      <AnimatedSection>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="flex h-2 w-2 rounded-full bg-violet-500" />
              <span className="text-[11px] font-bold text-violet-500 uppercase tracking-widest">
                Faculty Revenue Split & Payout Ledgers
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
              Teacher <span className="gradient-text">Settlements</span>
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Deterministic calculations of 80/20 splits, flat student fees, hall deductions, and bank transfer advice.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => toast.success("Exported Faculty Bank Settlement Advice (CSV/PDF) for Commercial Bank & BOC")}
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-violet-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow"
          >
            <Printer className="h-4 w-4" />
            Export Bank Advice File
          </motion.button>
        </div>
      </AnimatedSection>

      {/* Settlement Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AnimatedSection>
          <div className="glass-card rounded-2xl p-5 border border-border/60">
            <span className="text-xs font-bold text-muted-foreground uppercase">Gross Invoiced Fees</span>
            <p className="text-2xl font-black text-foreground mt-1">LKR {(totalGross / 1000000).toFixed(2)}M</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Total class collections</p>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div className="glass-card rounded-2xl p-5 border border-border/60">
            <span className="text-xs font-bold text-muted-foreground uppercase">Net Faculty Payouts</span>
            <p className="text-2xl font-black text-emerald-500 mt-1">LKR {(totalNetPaid / 1000000).toFixed(2)}M</p>
            <p className="text-[11px] text-emerald-500 font-semibold mt-0.5">80% Teacher Share Disbursed</p>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div className="glass-card rounded-2xl p-5 border border-border/60">
            <span className="text-xs font-bold text-muted-foreground uppercase">Institute Margin</span>
            <p className="text-2xl font-black text-foreground mt-1">LKR {(totalInstituteShare / 1000000).toFixed(2)}M</p>
            <p className="text-[11px] text-primary font-semibold mt-0.5">20% Center Operations Share</p>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div className="glass-card rounded-2xl p-5 border border-border/60">
            <span className="text-xs font-bold text-muted-foreground uppercase">Hall AC Deductions</span>
            <p className="text-2xl font-black text-amber-500 mt-1">LKR {(totalHallDeductions / 1000).toLocaleString()}k</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Auditorium utilities retained</p>
          </div>
        </AnimatedSection>
      </div>

      {/* Settlements Table */}
      <AnimatedSection>
        <div className="glass-card rounded-3xl shadow-sm border border-border/60 overflow-hidden">
          <div className="flex items-center justify-between gap-3 border-b border-border/50 p-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search teacher, NIC, or bank..."
                className="w-full rounded-xl border border-border/60 bg-muted/30 pl-10 pr-4 py-2 text-xs font-semibold focus:outline-none focus:border-primary"
              />
            </div>
            <span className="text-xs font-bold text-muted-foreground">
              {filteredSettlements.length} Faculty Settlements
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border/50 text-[11px] font-bold text-muted-foreground uppercase tracking-wider bg-muted/10">
                  <th className="py-3.5 pl-4">Faculty Member</th>
                  <th className="py-3.5">Compensation Rule</th>
                  <th className="py-3.5">Gross Billing</th>
                  <th className="py-3.5">Institute Share</th>
                  <th className="py-3.5">Hall Deduction</th>
                  <th className="py-3.5">Net Disbursed</th>
                  <th className="py-3.5">Settlement Bank</th>
                  <th className="py-3.5 pr-4 text-right">Payout Slip</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filteredSettlements.map((s) => (
                  <tr key={s.teacher.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3.5 pl-4">
                      <p className="font-bold text-foreground text-xs">{s.teacher.name}</p>
                      <p className="text-[10px] text-muted-foreground">NIC: {s.teacher.nic} • {s.classesCount} Batches</p>
                    </td>

                    <td className="py-3.5 font-medium text-foreground">
                      <span className="bg-primary/10 text-primary font-bold px-2 py-0.5 rounded text-[10px]">
                        {s.teacher.compensationType === "percentage" ? `${s.teacher.compensationValue}% Split` : s.teacher.compensationType}
                      </span>
                    </td>

                    <td className="py-3.5 font-semibold text-foreground">
                      LKR {s.gross.toLocaleString()}
                    </td>

                    <td className="py-3.5 text-muted-foreground">
                      -LKR {s.instShare.toLocaleString()}
                    </td>

                    <td className="py-3.5 text-red-500 font-semibold">
                      -LKR {s.hallDeduction.toLocaleString()}
                    </td>

                    <td className="py-3.5 font-black text-emerald-500 text-sm">
                      LKR {s.net.toLocaleString()}
                    </td>

                    <td className="py-3.5">
                      <p className="font-semibold text-foreground text-[11px]">{s.teacher.bankName}</p>
                      <p className="text-[10px] font-mono text-muted-foreground">{s.teacher.bankAccount}</p>
                    </td>

                    <td className="py-3.5 pr-4 text-right">
                      <button
                        onClick={() => toast.success(`Official Settlement Slip generated for ${s.teacher.name}`)}
                        className="rounded-xl border border-border/60 bg-muted/30 hover:bg-muted/60 p-2 text-muted-foreground hover:text-foreground transition-colors"
                        title="Print Voucher"
                      >
                        <Printer className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </AnimatedSection>
    </AnimatedPage>
  );
}
