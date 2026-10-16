"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Filter,
  DollarSign,
  TrendingUp,
  Users,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Receipt,
  X,
  CreditCard,
  Building2,
  ChevronRight,
  ShieldCheck,
  Tag,
} from "lucide-react";
import { AnimatedPage, AnimatedSection } from "@/components/animated-page";
import { mockFeeCharges, mockStudents, mockClasses, FeeChargeData } from "@/lib/mock-data";
import toast from "react-hot-toast";

export default function FeeChargesPage() {
  const [charges, setCharges] = useState<FeeChargeData[]>(mockFeeCharges);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [newStudentId, setNewStudentId] = useState(mockStudents[0].id);
  const [newClassId, setNewClassId] = useState(mockClasses[0].id);
  const [newBaseAmount, setNewBaseAmount] = useState(4500);
  const [newDiscount, setNewDiscount] = useState(0);
  const [newReason, setNewReason] = useState("");

  const filteredCharges = charges.filter((chg) => {
    const student = mockStudents.find((s) => s.id === chg.studentId);
    const cls = mockClasses.find((c) => c.id === chg.classId);
    return (
      student?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student?.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls?.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleCreateCharge = (e: React.FormEvent) => {
    e.preventDefault();
    const net = Math.max(0, newBaseAmount - newDiscount);
    const newRecord: FeeChargeData = {
      id: "chg-" + Date.now(),
      studentId: newStudentId,
      classId: newClassId,
      billingMonth: "October 2026",
      baseAmount: Number(newBaseAmount),
      discountAmount: Number(newDiscount),
      discountReason: newReason || undefined,
      netAmount: net,
      dueDate: "2026-10-10",
      status: "pending",
    };

    setCharges([newRecord, ...charges]);
    setIsAddModalOpen(false);
    toast.success("Tuition fee charge registered in ledger!");
  };

  const handleTriggerMonthlyRun = () => {
    toast.success("Generated 1,284 monthly billing charges for Cut-Off Day (Oct 10)", {
      icon: "⚙️",
    });
  };

  return (
    <AnimatedPage className="space-y-6">
      {/* Header */}
      <AnimatedSection>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="flex h-2 w-2 rounded-full bg-blue-500" />
              <span className="text-[11px] font-bold text-blue-500 uppercase tracking-widest">
                Tuition Pricing & Concession Rules
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
              Fee <span className="gradient-text">Charges</span>
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Deterministic billing charges, multi-subject bundles, sibling rules, and teacher scholarship passes.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleTriggerMonthlyRun}
              className="flex items-center gap-2 rounded-2xl border border-border/60 bg-muted/30 px-3.5 py-2.5 text-xs font-semibold hover:bg-muted/60"
            >
              <Calendar className="h-4 w-4" /> Trigger Billing Run
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-violet-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow"
            >
              <Plus className="h-4 w-4" />
              Add Custom Charge / Waiver
            </motion.button>
          </div>
        </div>
      </AnimatedSection>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AnimatedSection>
          <div className="glass-card rounded-2xl p-5 border border-border/60">
            <span className="text-xs font-bold text-muted-foreground uppercase">Total Invoiced</span>
            <p className="text-2xl font-black text-foreground mt-1">LKR 4,050,000</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">October 2026 Billing Cycle</p>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div className="glass-card rounded-2xl p-5 border border-border/60">
            <span className="text-xs font-bold text-muted-foreground uppercase">Concessions & Waivers</span>
            <p className="text-2xl font-black text-amber-500 mt-1">LKR 125,000</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Sibling + Teacher Free/Half Cards</p>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div className="glass-card rounded-2xl p-5 border border-border/60">
            <span className="text-xs font-bold text-muted-foreground uppercase">Net Billable</span>
            <p className="text-2xl font-black text-emerald-500 mt-1">LKR 3,925,000</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Payable to Institute</p>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div className="glass-card rounded-2xl p-5 border border-border/60">
            <span className="text-xs font-bold text-muted-foreground uppercase">Billing Cut-Off</span>
            <p className="text-2xl font-black text-primary mt-1">10th Monthly</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Automated arrears after 5 days</p>
          </div>
        </AnimatedSection>
      </div>

      {/* Charges Table */}
      <AnimatedSection>
        <div className="glass-card rounded-3xl shadow-sm border border-border/60 overflow-hidden">
          <div className="flex items-center justify-between gap-3 border-b border-border/50 p-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search student, admission ID, or class..."
                className="w-full rounded-xl border border-border/60 bg-muted/30 pl-10 pr-4 py-2 text-xs font-semibold focus:outline-none focus:border-primary"
              />
            </div>
            <span className="text-xs font-bold text-muted-foreground">
              Showing {filteredCharges.length} Charges
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border/50 text-[11px] font-bold text-muted-foreground uppercase tracking-wider bg-muted/10">
                  <th className="py-3.5 pl-4">Student & ID</th>
                  <th className="py-3.5">Tuition Class</th>
                  <th className="py-3.5">Billing Month</th>
                  <th className="py-3.5">Base Fee</th>
                  <th className="py-3.5">Concession / Discount</th>
                  <th className="py-3.5">Net Billable</th>
                  <th className="py-3.5 pr-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filteredCharges.map((chg) => {
                  const student = mockStudents.find((s) => s.id === chg.studentId);
                  const cls = mockClasses.find((c) => c.id === chg.classId);
                  return (
                    <tr key={chg.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3.5 pl-4">
                        <p className="font-bold text-foreground text-xs">{student?.name}</p>
                        <p className="text-[10px] font-mono text-primary">{student?.studentId}</p>
                      </td>
                      <td className="py-3.5">
                        <p className="font-semibold text-foreground text-xs">{cls?.name}</p>
                        <p className="text-[10px] text-muted-foreground">{cls?.grade}</p>
                      </td>
                      <td className="py-3.5 font-medium text-muted-foreground">{chg.billingMonth}</td>
                      <td className="py-3.5 font-semibold text-foreground">LKR {chg.baseAmount.toLocaleString()}</td>
                      <td className="py-3.5">
                        {chg.discountAmount > 0 ? (
                          <div>
                            <span className="font-bold text-amber-500">-LKR {chg.discountAmount.toLocaleString()}</span>
                            <p className="text-[10px] text-muted-foreground truncate max-w-xs">{chg.discountReason}</p>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="py-3.5 font-bold text-foreground">LKR {chg.netAmount.toLocaleString()}</td>
                      <td className="py-3.5 pr-4 text-right">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          chg.status === "paid" ? "bg-emerald-500/10 text-emerald-500" : chg.status === "overdue" ? "bg-red-500/10 text-red-500" : "bg-amber-500/10 text-amber-500"
                        }`}>
                          {chg.status === "paid" && <CheckCircle2 className="h-3 w-3" />}
                          {chg.status === "overdue" && <AlertCircle className="h-3 w-3" />}
                          {chg.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </AnimatedSection>

      {/* Add Custom Charge / Waiver Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-50 w-full max-w-md rounded-3xl border border-border/80 glass-card shadow-2xl p-6"
            >
              <div className="flex items-center justify-between border-b border-border/50 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Receipt className="h-5 w-5 text-primary" />
                  <h3 className="text-base font-bold text-foreground">Record Custom Fee Charge</h3>
                </div>
                <button onClick={() => setIsAddModalOpen(false)}>
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>

              <form onSubmit={handleCreateCharge} className="space-y-3.5">
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase">Select Student</label>
                  <select
                    value={newStudentId}
                    onChange={(e) => setNewStudentId(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-border/60 bg-muted/20 px-3 py-2 text-xs font-semibold focus:outline-none focus:border-primary"
                  >
                    {mockStudents.map((s) => (
                      <option key={s.id} value={s.id}>{s.name} ({s.studentId})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase">Class Batch</label>
                  <select
                    value={newClassId}
                    onChange={(e) => setNewClassId(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-border/60 bg-muted/20 px-3 py-2 text-xs font-semibold focus:outline-none focus:border-primary"
                  >
                    {mockClasses.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase">Base Fee (LKR)</label>
                    <input
                      type="number"
                      value={newBaseAmount}
                      onChange={(e) => setNewBaseAmount(Number(e.target.value))}
                      className="mt-1 w-full rounded-xl border border-border/60 bg-muted/20 px-3 py-2 text-xs font-semibold focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase">Discount / Waiver (LKR)</label>
                    <input
                      type="number"
                      value={newDiscount}
                      onChange={(e) => setNewDiscount(Number(e.target.value))}
                      className="mt-1 w-full rounded-xl border border-border/60 bg-muted/20 px-3 py-2 text-xs font-semibold focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase">Waiver Reason (Audit Log)</label>
                  <input
                    type="text"
                    value={newReason}
                    onChange={(e) => setNewReason(e.target.value)}
                    placeholder="e.g. Sibling concession 15% or Teacher Scholarship"
                    className="mt-1 w-full rounded-xl border border-border/60 bg-muted/20 px-3 py-2 text-xs font-semibold focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="rounded-xl border border-border/60 px-4 py-2 text-xs font-semibold hover:bg-muted/50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-gradient-to-r from-primary to-violet-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-primary/25"
                  >
                    Apply to Ledger
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AnimatedPage>
  );
}
