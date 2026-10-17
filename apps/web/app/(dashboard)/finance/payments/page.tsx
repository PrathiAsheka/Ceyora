"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  Plus,
  Search,
  Filter,
  DollarSign,
  TrendingUp,
  Receipt,
  CheckCircle2,
  Clock,
  RotateCcw,
  Printer,
  ShieldCheck,
  X,
  Building2,
  Users,
} from "lucide-react";
import { AnimatedPage, AnimatedSection } from "@/components/animated-page";
import { mockPayments, mockStudents, mockFeeCharges, PaymentRecordData } from "@/lib/mock-data";
import toast from "react-hot-toast";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ModuleSubNav } from "@/components/layout/module-sub-nav";
import { financeNavItems } from "@/lib/sub-nav-items";

export default function PaymentsPage() {
  const [payments, setPayments] = useState<PaymentRecordData[]>(mockPayments);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);

  // Form State
  const [newStudentId, setNewStudentId] = useState(mockStudents[0].id);
  const [newAmount, setNewAmount] = useState(4500);
  const [newMethod, setNewMethod] = useState<"cash" | "payhere_online" | "bank_transfer" | "frimi">("cash");
  const [newRef, setNewRef] = useState(`CSH-${Math.floor(1000 + Math.random() * 9000)}`);

  const filteredPayments = payments.filter((p) => {
    const student = mockStudents.find((s) => s.id === p.studentId);
    return (
      p.receiptNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student?.studentId.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: PaymentRecordData = {
      id: "pay-" + Date.now(),
      receiptNumber: `REC-2026-${Math.floor(8000 + Math.random() * 1999)}`,
      studentId: newStudentId,
      chargeId: "chg-auto",
      amount: Number(newAmount),
      paymentMethod: newMethod,
      referenceNumber: newRef,
      collectedBy: "Front Desk Cashier",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "verified",
    };

    setPayments([newRecord, ...payments]);
    setIsRecordModalOpen(false);
    toast.success(`Payment receipt ${newRecord.receiptNumber} recorded and allocated!`);
  };

  const handleReversePayment = (paymentId: string) => {
    setPayments(
      payments.map((p) => (p.id === paymentId ? { ...p, status: "reversed" as const } : p))
    );
    toast.success("Transaction reversed with compensating reversal entry (PDPA Audit logged)");
  };

  const totalCollected = payments
    .filter((p) => p.status === "verified")
    .reduce((acc, p) => acc + p.amount, 0);

  return (
    <AnimatedPage className="space-y-6">
      {/* Breadcrumbs & Navigation */}
      <Breadcrumbs items={[{ label: "Finance", href: "/finance" }, { label: "Payment Receipts" }]} />

      {/* Header */}
      <AnimatedSection>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-[11px] font-bold text-emerald-500 uppercase tracking-widest">
                Double-Entry Payment Vouchers & Allocations
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
              Payment <span className="gradient-text">Receipts</span>
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Immutable receipt logs, PayHere online gateway settlements, and compensating transaction reversals.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsRecordModalOpen(true)}
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-violet-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow"
          >
            <Plus className="h-4 w-4" />
            Record Inbound Payment
          </motion.button>
        </div>

        {/* Finance Sub-Navigation Bar */}
        <div className="pt-2">
          <ModuleSubNav items={financeNavItems} />
        </div>
      </AnimatedSection>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AnimatedSection>
          <div className="glass-card rounded-2xl p-5 border border-border/60">
            <span className="text-xs font-bold text-muted-foreground uppercase">Reconciled Cash</span>
            <p className="text-2xl font-black text-foreground mt-1">LKR {totalCollected.toLocaleString()}</p>
            <p className="text-[11px] text-emerald-500 font-semibold mt-0.5">100% Allocated to Charges</p>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div className="glass-card rounded-2xl p-5 border border-border/60">
            <span className="text-xs font-bold text-muted-foreground uppercase">Receipts Issued</span>
            <p className="text-2xl font-black text-foreground mt-1">{payments.length} Vouchers</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Digital & Counter Receipts</p>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div className="glass-card rounded-2xl p-5 border border-border/60">
            <span className="text-xs font-bold text-muted-foreground uppercase">Online Share</span>
            <p className="text-2xl font-black text-primary mt-1">64.2%</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">PayHere Gateway & FriMi</p>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div className="glass-card rounded-2xl p-5 border border-border/60">
            <span className="text-xs font-bold text-muted-foreground uppercase">Audit Integrity</span>
            <p className="text-2xl font-black text-emerald-500 mt-1">Immutable</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Zero Silent Modifications</p>
          </div>
        </AnimatedSection>
      </div>

      {/* Table */}
      <AnimatedSection>
        <div className="glass-card rounded-3xl shadow-sm border border-border/60 overflow-hidden">
          <div className="flex items-center justify-between gap-3 border-b border-border/50 p-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search receipt #, reference, or student..."
                className="w-full rounded-xl border border-border/60 bg-muted/30 pl-10 pr-4 py-2 text-xs font-semibold focus:outline-none focus:border-primary"
              />
            </div>
            <span className="text-xs font-bold text-muted-foreground">
              {filteredPayments.length} Transactions Logged
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border/50 text-[11px] font-bold text-muted-foreground uppercase tracking-wider bg-muted/10">
                  <th className="py-3.5 pl-4">Receipt #</th>
                  <th className="py-3.5">Student</th>
                  <th className="py-3.5">Amount</th>
                  <th className="py-3.5">Method & Ref</th>
                  <th className="py-3.5">Collector</th>
                  <th className="py-3.5">Status</th>
                  <th className="py-3.5 pr-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filteredPayments.map((p) => {
                  const student = mockStudents.find((s) => s.id === p.studentId);
                  return (
                    <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3.5 pl-4 font-mono font-bold text-primary text-xs">
                        {p.receiptNumber}
                      </td>
                      <td className="py-3.5">
                        <p className="font-bold text-foreground text-xs">{student?.name}</p>
                        <p className="text-[10px] text-muted-foreground font-mono">{student?.studentId}</p>
                      </td>
                      <td className="py-3.5 font-bold text-foreground">LKR {p.amount.toLocaleString()}</td>
                      <td className="py-3.5">
                        <span className="font-semibold uppercase text-[10px] text-foreground block">
                          {p.paymentMethod.replace("_", " ")}
                        </span>
                        <span className="text-[10px] font-mono text-muted-foreground">{p.referenceNumber}</span>
                      </td>
                      <td className="py-3.5 text-muted-foreground text-[11px]">{p.collectedBy}</td>
                      <td className="py-3.5">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          p.status === "verified" ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
                        }`}>
                          {p.status === "verified" ? <CheckCircle2 className="h-3 w-3" /> : <RotateCcw className="h-3 w-3" />}
                          {p.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3.5 pr-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => toast.success(`Receipt ${p.receiptNumber} printed`)}
                            title="Print Voucher"
                            className="rounded-xl border border-border/60 p-2 text-muted-foreground hover:text-foreground hover:bg-muted/40"
                          >
                            <Printer className="h-3.5 w-3.5" />
                          </button>
                          {p.status === "verified" && (
                            <button
                              onClick={() => handleReversePayment(p.id)}
                              title="Compensating Reversal"
                              className="rounded-xl border border-red-500/30 text-red-500 p-2 hover:bg-red-500/10"
                            >
                              <RotateCcw className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </AnimatedSection>

      {/* Record Inbound Payment Modal */}
      <AnimatePresence>
        {isRecordModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsRecordModalOpen(false)}
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
                  <CreditCard className="h-5 w-5 text-primary" />
                  <h3 className="text-base font-bold text-foreground">Record Inbound Tuition Fee</h3>
                </div>
                <button onClick={() => setIsRecordModalOpen(false)}>
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>

              <form onSubmit={handleRecordPayment} className="space-y-3.5">
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

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase">Amount (LKR)</label>
                    <input
                      type="number"
                      value={newAmount}
                      onChange={(e) => setNewAmount(Number(e.target.value))}
                      className="mt-1 w-full rounded-xl border border-border/60 bg-muted/20 px-3 py-2 text-xs font-semibold focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase">Method</label>
                    <select
                      value={newMethod}
                      onChange={(e) => setNewMethod(e.target.value as any)}
                      className="mt-1 w-full rounded-xl border border-border/60 bg-muted/20 px-3 py-2 text-xs font-semibold focus:outline-none focus:border-primary"
                    >
                      <option value="cash">Counter Cash</option>
                      <option value="payhere_online">PayHere Gateway</option>
                      <option value="bank_transfer">Direct Bank Transfer</option>
                      <option value="frimi">FriMi / Genie Wallet</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase">Reference / Slip Number</label>
                  <input
                    type="text"
                    value={newRef}
                    onChange={(e) => setNewRef(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-border/60 bg-muted/20 px-3 py-2 text-xs font-semibold focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsRecordModalOpen(false)}
                    className="rounded-xl border border-border/60 px-4 py-2 text-xs font-semibold hover:bg-muted/50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-gradient-to-r from-primary to-violet-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-primary/25"
                  >
                    Issue Receipt Voucher
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
