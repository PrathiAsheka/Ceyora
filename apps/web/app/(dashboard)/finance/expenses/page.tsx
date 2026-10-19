"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  Plus,
  Search,
  Filter,
  DollarSign,
  PieChart,
  Tag,
  Calendar,
  Building2,
  X,
  FileText,
  AlertCircle,
} from "lucide-react";
import { AnimatedPage, AnimatedSection } from "@/components/animated-page";
import toast from "react-hot-toast";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ModuleSubNav } from "@/components/layout/module-sub-nav";
import { financeNavItems } from "@/lib/sub-nav-items";

import { useInstituteStore } from "@/stores/institute-store";
import { mockInstitutes, mockExpenses, ExpenseItemData } from "@/lib/mock-data";

export default function ExpensesPage() {
  const { selectedInstituteId } = useInstituteStore();
  const currentInstitute = mockInstitutes.find((i) => i.id === selectedInstituteId) || mockInstitutes[0];
  const [expenses, setExpenses] = useState<ExpenseItemData[]>(mockExpenses);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [newCategory, setNewCategory] = useState<ExpenseItemData["category"]>("Utilities & AC");
  const [newDesc, setNewDesc] = useState("");
  const [newAmount, setNewAmount] = useState(25000);

  const instituteExpenses = expenses.filter(
    (e) => !selectedInstituteId || e.instituteId === selectedInstituteId
  );

  const filteredExpenses = instituteExpenses.filter(
    (e) =>
      e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.voucherNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalExpenses = instituteExpenses.reduce((acc, e) => acc + e.amount, 0);

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDesc) {
      toast.error("Please enter expense description");
      return;
    }

    const newRecord: ExpenseItemData = {
      id: "exp-" + Date.now(),
      instituteId: currentInstitute.id,
      category: newCategory,
      description: newDesc,
      amount: Number(newAmount),
      date: new Date().toISOString().split("T")[0],
      voucherNumber: `VOU-${Math.floor(7800 + Math.random() * 200)}`,
      approvedBy: "Super Admin",
    };

    setExpenses([newRecord, ...expenses]);
    setIsAddModalOpen(false);
    setNewDesc("");
    toast.success(`Expense voucher ${newRecord.voucherNumber} recorded!`);
  };

  return (
    <AnimatedPage className="space-y-6">
      {/* Breadcrumbs & Navigation */}
      <Breadcrumbs items={[{ label: "Finance", href: "/finance" }, { label: "Expenses" }]} />

      {/* Header */}
      <AnimatedSection>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="flex h-2 w-2 rounded-full bg-orange-500" />
              <span className="text-[11px] font-bold text-orange-500 uppercase tracking-widest">
                Institute Operational Cost Accounting
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
              Institute <span className="gradient-text">Expenses</span>
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Record and audit operational overheads, hall utilities, staff wages, and learning printouts.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-violet-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow"
          >
            <Plus className="h-4 w-4" />
            Record Operational Expense
          </motion.button>
        </div>

        {/* Finance Sub-Navigation Bar */}
        <div className="pt-2">
          <ModuleSubNav items={financeNavItems} />
        </div>
      </AnimatedSection>

      {/* Expense Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AnimatedSection>
          <div className="glass-card rounded-2xl p-5 border border-border/60">
            <span className="text-xs font-bold text-muted-foreground uppercase">Monthly Expenses</span>
            <p className="text-2xl font-black text-foreground mt-1">LKR {totalExpenses.toLocaleString()}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">October 2026 Cycle</p>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div className="glass-card rounded-2xl p-5 border border-border/60">
            <span className="text-xs font-bold text-muted-foreground uppercase">Top Expense Head</span>
            <p className="text-2xl font-black text-amber-500 mt-1">Staff Wages</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">42.8% of Total Overhead</p>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div className="glass-card rounded-2xl p-5 border border-border/60">
            <span className="text-xs font-bold text-muted-foreground uppercase">Auditorium Energy</span>
            <p className="text-2xl font-black text-primary mt-1">LKR 145,000</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Covered via hall deductions</p>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div className="glass-card rounded-2xl p-5 border border-border/60">
            <span className="text-xs font-bold text-muted-foreground uppercase">Operating Ratio</span>
            <p className="text-2xl font-black text-emerald-500 mt-1">10.9%</p>
            <p className="text-[11px] text-emerald-500 font-semibold mt-0.5">Healthy Profit Margin</p>
          </div>
        </AnimatedSection>
      </div>

      {/* Expenses Table */}
      <AnimatedSection>
        <div className="glass-card rounded-3xl shadow-sm border border-border/60 overflow-hidden">
          <div className="flex items-center justify-between gap-3 border-b border-border/50 p-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search expense description, category, or voucher..."
                className="w-full rounded-xl border border-border/60 bg-muted/30 pl-10 pr-4 py-2 text-xs font-semibold focus:outline-none focus:border-primary"
              />
            </div>
            <span className="text-xs font-bold text-muted-foreground">
              {filteredExpenses.length} Expense Vouchers
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border/50 text-[11px] font-bold text-muted-foreground uppercase tracking-wider bg-muted/10">
                  <th className="py-3.5 pl-4">Voucher #</th>
                  <th className="py-3.5">Category</th>
                  <th className="py-3.5">Description</th>
                  <th className="py-3.5">Amount (LKR)</th>
                  <th className="py-3.5">Recorded Date</th>
                  <th className="py-3.5 pr-4 text-right">Approval</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filteredExpenses.map((e) => (
                  <tr key={e.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3.5 pl-4 font-mono font-bold text-primary text-xs">
                      {e.voucherNumber}
                    </td>
                    <td className="py-3.5">
                      <span className="bg-primary/10 text-primary font-bold px-2 py-0.5 rounded text-[10px]">
                        {e.category}
                      </span>
                    </td>
                    <td className="py-3.5 font-semibold text-foreground text-xs">
                      {e.description}
                    </td>
                    <td className="py-3.5 font-bold text-foreground text-xs">
                      LKR {e.amount.toLocaleString()}
                    </td>
                    <td className="py-3.5 text-muted-foreground text-xs">
                      {e.date}
                    </td>
                    <td className="py-3.5 pr-4 text-right">
                      <span className="text-[10px] font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        {e.approvedBy}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </AnimatedSection>

      {/* Record Expense Modal */}
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
                  <CreditCard className="h-5 w-5 text-primary" />
                  <h3 className="text-base font-bold text-foreground">Record Expense Voucher</h3>
                </div>
                <button onClick={() => setIsAddModalOpen(false)}>
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>

              <form onSubmit={handleCreateExpense} className="space-y-3.5">
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="mt-1 w-full rounded-xl border border-border/60 bg-muted/20 px-3 py-2 text-xs font-semibold focus:outline-none focus:border-primary"
                  >
                    <option value="Utilities & AC">Utilities & AC</option>
                    <option value="Staff Wages">Staff Wages</option>
                    <option value="Print & Materials">Print & Materials</option>
                    <option value="Cleaning & Maintenance">Cleaning & Maintenance</option>
                    <option value="Telecommunication & SMS">Telecommunication & SMS</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase">Description</label>
                  <input
                    type="text"
                    required
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="e.g. Electricity bill or paper printing"
                    className="mt-1 w-full rounded-xl border border-border/60 bg-muted/20 px-3 py-2 text-xs font-semibold focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase">Amount (LKR)</label>
                  <input
                    type="number"
                    value={newAmount}
                    onChange={(e) => setNewAmount(Number(e.target.value))}
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
                    Save Voucher
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
