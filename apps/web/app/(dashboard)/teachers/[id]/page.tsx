"use client";

import { use } from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Users,
  DollarSign,
  GraduationCap,
  Calendar,
  Building2,
  CreditCard,
  CheckCircle2,
  ExternalLink,
  Phone,
  Mail,
  FileText,
  Clock,
  Download,
  Printer,
} from "lucide-react";
import { AnimatedPage, AnimatedSection } from "@/components/animated-page";
import { mockTeachers, mockClasses, mockInstitutes } from "@/lib/mock-data";
import Link from "next/link";
import toast from "react-hot-toast";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";

export default function TeacherDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const teacher = mockTeachers.find((t) => t.id === resolvedParams.id) || mockTeachers[0];
  const assignedClasses = mockClasses.filter((c) => teacher.assignedClassIds.includes(c.id));

  // Compute total monthly financials for this teacher
  const grossClassCollections = assignedClasses.reduce((acc, c) => acc + c.monthlyCollection, 0);
  const instituteShareTotal = assignedClasses.reduce(
    (acc, c) => acc + Math.round(c.monthlyCollection * (c.instituteSharePercentage / 100)),
    0
  );
  const hallChargesTotal = assignedClasses.reduce((acc, c) => acc + c.hallChargesDeduction, 0);
  const netPayable = grossClassCollections - instituteShareTotal - hallChargesTotal;

  const handlePrintSlip = () => {
    toast.success(`Generated official teacher payout voucher for ${teacher.name}`, {
      icon: "📄",
    });
  };

  return (
    <AnimatedPage className="space-y-6">
      {/* Breadcrumbs Navigation */}
      <Breadcrumbs items={[{ label: "Teachers", href: "/teachers" }, { label: teacher.name }]} />

      {/* Header */}
      <AnimatedSection>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                NIC: {teacher.nic}
              </span>
              <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                Verified Faculty
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-foreground mt-1">
              {teacher.name}
            </h1>
            <p className="text-xs text-muted-foreground">{teacher.title}</p>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePrintSlip}
              className="flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-primary to-violet-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-primary/25"
            >
              <Printer className="h-3.5 w-3.5" /> Payout Voucher
            </motion.button>
          </div>
        </div>
      </AnimatedSection>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AnimatedSection>
          <div className="glass-card rounded-2xl p-5 border border-border/60">
            <span className="text-xs font-bold text-muted-foreground uppercase">Total Students</span>
            <p className="text-2xl font-black text-foreground mt-1">{teacher.totalStudents}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Across {assignedClasses.length} Scheduled Batches</p>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div className="glass-card rounded-2xl p-5 border border-border/60">
            <span className="text-xs font-bold text-muted-foreground uppercase">Gross Class Collections</span>
            <p className="text-2xl font-black text-foreground mt-1">LKR {(grossClassCollections / 1000).toLocaleString()}k</p>
            <p className="text-[11px] text-emerald-500 font-semibold mt-0.5">Current billing cycle</p>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div className="glass-card rounded-2xl p-5 border border-border/60">
            <span className="text-xs font-bold text-muted-foreground uppercase">Net Faculty Payout</span>
            <p className="text-2xl font-black text-emerald-500 mt-1">LKR {(netPayable / 1000).toLocaleString()}k</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Direct to Commercial Bank</p>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div className="glass-card rounded-2xl p-5 border border-border/60">
            <span className="text-xs font-bold text-muted-foreground uppercase">Student Pass Rate</span>
            <p className="text-2xl font-black text-primary mt-1">{teacher.passRate}%</p>
            <p className="text-[11px] text-emerald-500 font-semibold mt-0.5">{teacher.retentionRate}% Retention Score</p>
          </div>
        </AnimatedSection>
      </div>

      {/* Grid: Bank & Compensation Details & Assigned Classes */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left: Compensation Agreement & Bank Details */}
        <AnimatedSection className="lg:col-span-5 space-y-5">
          <div className="glass-card rounded-3xl p-6 border border-border/60 space-y-4">
            <h3 className="text-sm font-bold text-foreground">Compensation Agreement & Settlement</h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-2 border-b border-border/40">
                <span className="text-muted-foreground">Compensation Model:</span>
                <span className="font-bold text-foreground uppercase">
                  {teacher.compensationType === "percentage" ? "Revenue Split" : teacher.compensationType}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border/40">
                <span className="text-muted-foreground">Teacher Share Formula:</span>
                <span className="font-bold text-emerald-500">{teacher.compensationValue}% of Tuition Collection</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border/40">
                <span className="text-muted-foreground">Institute Retention:</span>
                <span className="font-bold text-foreground">{100 - teacher.compensationValue}%</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border/40">
                <span className="text-muted-foreground">Settlement Bank:</span>
                <span className="font-semibold text-foreground">{teacher.bankName}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border/40">
                <span className="text-muted-foreground">Bank Account No:</span>
                <span className="font-mono font-bold text-primary">{teacher.bankAccount}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-muted-foreground">Direct WhatsApp:</span>
                <span className="font-semibold text-foreground">{teacher.whatsapp}</span>
              </div>
            </div>
          </div>

          {/* Statement breakdown card */}
          <div className="glass-card rounded-3xl p-6 border border-border/60 space-y-3">
            <h3 className="text-sm font-bold text-foreground">Current Billing Month Breakdown</h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Total Fees Billed:</span>
                <span className="text-foreground font-semibold">LKR {grossClassCollections.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Institute Share ({100 - teacher.compensationValue}%):</span>
                <span className="text-red-500 font-semibold">- LKR {instituteShareTotal.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Hall Maintenance & AC Surcharge:</span>
                <span className="text-red-500 font-semibold">- LKR {hallChargesTotal.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border/40 text-sm font-bold text-foreground">
                <span>Net Transfer Amount:</span>
                <span className="text-emerald-500">LKR {netPayable.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Right: Assigned Batches */}
        <AnimatedSection className="lg:col-span-7">
          <div className="glass-card rounded-3xl p-6 border border-border/60 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-foreground">Batches Conducted by {teacher.name}</h3>
                <Link href="/classes">
                  <span className="text-xs font-semibold text-primary hover:underline">View All Batches</span>
                </Link>
              </div>

              <div className="space-y-3">
                {assignedClasses.map((cls) => (
                  <Link
                    key={cls.id}
                    href={`/classes/${cls.id}`}
                    className="block p-4 rounded-2xl border border-border/40 bg-muted/20 hover:bg-muted/40 hover:border-primary/40 transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                          {cls.code}
                        </span>
                        <h4 className="text-xs font-bold text-foreground mt-1 group-hover:text-primary transition-colors flex items-center gap-1.5">
                          {cls.name}
                          <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </h4>
                        <p className="text-[11px] text-muted-foreground">{cls.hall} • {cls.timeSlot}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-foreground">LKR {cls.monthlyCollection.toLocaleString()}</p>
                        <span className="text-[10px] text-muted-foreground">{cls.enrolledStudentsCount} Students</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-border/40 text-[11px]">
                      <div>
                        <span className="text-muted-foreground">Fee / Student:</span>{" "}
                        <span className="font-semibold text-foreground">LKR {cls.monthlyFee}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Hall Deductions:</span>{" "}
                        <span className="font-semibold text-red-500">-LKR {cls.hallChargesDeduction}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Attendance:</span>{" "}
                        <span className="font-bold text-emerald-500">
                          {Math.round((cls.presentLastClass / cls.enrolledStudentsCount) * 100)}%
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
              <span>Automated Payout Engine</span>
              <span className="font-bold text-foreground">Double-Entry Ledger Verified</span>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </AnimatedPage>
  );
}
