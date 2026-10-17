"use client";

import { use } from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  GraduationCap,
  Users,
  DollarSign,
  QrCode,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  Clock,
  Printer,
  Send,
  ExternalLink,
  Award,
  ShieldCheck,
  TrendingUp,
  Building2,
} from "lucide-react";
import { AnimatedPage, AnimatedSection } from "@/components/animated-page";
import { mockStudents, mockClasses, mockTeachers, mockFeeCharges, mockPayments, mockExams } from "@/lib/mock-data";
import Link from "next/link";
import toast from "react-hot-toast";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";

export default function StudentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const student = mockStudents.find((s) => s.id === resolvedParams.id) || mockStudents[0];

  const enrolledClasses = mockClasses.filter((c) => student.enrolledClassIds.includes(c.id));
  const studentCharges = mockFeeCharges.filter((chg) => chg.studentId === student.id);
  const studentPayments = mockPayments.filter((p) => p.studentId === student.id);

  const handleSendWhatsAppReminder = () => {
    toast.success(`Dispatched WhatsApp fee notice to guardian ${student.guardianName} (${student.guardianPhone})`, {
      icon: "📲",
    });
  };

  const handlePrintCard = () => {
    toast.success(`Generated printable biometric ID badge for ${student.name}`, {
      icon: "🪪",
    });
  };

  return (
    <AnimatedPage className="space-y-6">
      {/* Breadcrumbs Navigation */}
      <Breadcrumbs items={[{ label: "Students", href: "/students" }, { label: student.name }]} />

      {/* Header */}
      <AnimatedSection>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                {student.studentId}
              </span>
              <span className="text-xs font-bold text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-full">
                {student.grade}
              </span>
              {student.status === "at_risk" ? (
                <span className="text-xs font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> Retention At-Risk
                </span>
              ) : (
                <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Good Standing
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-foreground mt-1">
              {student.name}
            </h1>
            <p className="text-xs text-muted-foreground">{student.school} • Guardian: {student.guardianName}</p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePrintCard}
              className="flex items-center gap-1.5 rounded-2xl border border-border/60 px-4 py-2 text-xs font-bold hover:bg-muted/50"
            >
              <Printer className="h-3.5 w-3.5" /> Print QR Badge
            </motion.button>
            {student.balance > 0 && (
              <>
                <Link href="/finance/payments">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-primary to-violet-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-primary/25"
                  >
                    <CreditCard className="h-3.5 w-3.5" /> Settle Arrears (LKR {student.balance})
                  </motion.button>
                </Link>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSendWhatsAppReminder}
                  className="flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-emerald-500/25"
                >
                  <Send className="h-3.5 w-3.5" /> WhatsApp Reminder
                </motion.button>
              </>
            )}
          </div>
        </div>
      </AnimatedSection>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AnimatedSection>
          <div className="glass-card rounded-2xl p-5 border border-border/60">
            <span className="text-xs font-bold text-muted-foreground uppercase">Attendance Rate</span>
            <p className={`text-2xl font-black mt-1 ${student.attendanceRate < 75 ? "text-red-500" : "text-emerald-500"}`}>
              {student.attendanceRate}%
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Biometric QR Gate Verified</p>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div className="glass-card rounded-2xl p-5 border border-border/60">
            <span className="text-xs font-bold text-muted-foreground uppercase">Fee Balance</span>
            <p className={`text-2xl font-black mt-1 ${student.balance > 0 ? "text-red-500" : "text-emerald-500"}`}>
              {student.balance > 0 ? `LKR ${student.balance.toLocaleString()}` : "Settled (LKR 0)"}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {student.paymentStatus === "overdue" ? "Overdue > 7 days" : "Current billing cycle"}
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div className="glass-card rounded-2xl p-5 border border-border/60">
            <span className="text-xs font-bold text-muted-foreground uppercase">Academic Average</span>
            <p className="text-2xl font-black text-foreground mt-1">{student.averageMarks}%</p>
            <p className="text-[11px] text-emerald-500 font-semibold mt-0.5">Batch Percentile: #{student.recentRank}</p>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div className="glass-card rounded-2xl p-5 border border-border/60">
            <span className="text-xs font-bold text-muted-foreground uppercase">Fee Concession</span>
            <p className="text-2xl font-black text-foreground mt-1 capitalize">
              {student.concessionType === "none" ? "Standard Fee" : student.concessionType.replace("_", " ")}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Teacher / Sibling waiver rule</p>
          </div>
        </AnimatedSection>
      </div>

      {/* Main Grid: Student Identity & Enrolled Batches + Fee Ledger */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column: QR ID & Guardian Profile */}
        <AnimatedSection className="lg:col-span-5 space-y-5">
          {/* Digital QR ID Card */}
          <div className="glass-card rounded-3xl p-6 border border-border/60 text-center space-y-4">
            <div className="flex items-center justify-between text-xs border-b border-border/40 pb-3">
              <span className="font-bold text-foreground">Biometric Digital ID Card</span>
              <span className="font-mono text-primary font-bold">{student.studentId}</span>
            </div>

            <div className="mx-auto w-44 aspect-square rounded-2xl border-2 border-primary/40 bg-white p-3 flex items-center justify-center shadow-lg">
              <QrCode className="h-32 w-32 text-black" />
            </div>

            <p className="text-xs text-muted-foreground">
              Scan at hall entrance gate for automated check-in and parent check-in confirmation.
            </p>
          </div>

          {/* Guardian & Contact Card */}
          <div className="glass-card rounded-3xl p-6 border border-border/60 space-y-3">
            <h3 className="text-sm font-bold text-foreground">Guardian Information & PDPA Consent</h3>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-border/40">
                <span className="text-muted-foreground">Primary Guardian:</span>
                <span className="font-bold text-foreground">{student.guardianName}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-border/40">
                <span className="text-muted-foreground">Guardian WhatsApp:</span>
                <span className="font-mono font-semibold text-emerald-500">{student.guardianWhatsapp}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-border/40">
                <span className="text-muted-foreground">Registered School:</span>
                <span className="font-semibold text-foreground">{student.school}</span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-muted-foreground">PDPA Parent Consent:</span>
                <span className="font-bold text-emerald-500 flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" /> Consented (SMS/WhatsApp)
                </span>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Right Column: Enrolled Batches & Fee Ledger */}
        <AnimatedSection className="lg:col-span-7 space-y-5">
          {/* Enrolled Classes */}
          <div className="glass-card rounded-3xl p-6 border border-border/60 space-y-4">
            <h3 className="text-sm font-bold text-foreground">Enrolled Tuition Batches</h3>

            <div className="space-y-3">
              {enrolledClasses.map((cls) => {
                const teacher = mockTeachers.find((t) => t.id === cls.teacherId);
                return (
                  <div key={cls.id} className="p-4 rounded-2xl border border-border/40 bg-muted/20 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                        {cls.code}
                      </span>
                      <h4 className="text-xs font-bold text-foreground mt-1">{cls.name}</h4>
                      <p className="text-[11px] text-muted-foreground">{teacher?.name} • {cls.timeSlot}</p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-bold text-foreground">LKR {cls.monthlyFee.toLocaleString()}/mo</p>
                      <Link href={`/classes/${cls.id}`}>
                        <button className="text-[10px] font-bold text-primary hover:underline flex items-center gap-0.5 mt-0.5">
                          Class Hub <ExternalLink className="h-2.5 w-2.5" />
                        </button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Double-Entry Fee Ledger & Billing History */}
          <div className="glass-card rounded-3xl p-6 border border-border/60 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-foreground">Financial Ledger & Billing Statements</h3>
                <p className="text-xs text-muted-foreground">Double-entry accounting: separation of charges and receipts</p>
              </div>
              <button
                onClick={() => toast.success(`Payment voucher generated for ${student.name}`)}
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                Issue Receipt
              </button>
            </div>

            <div className="space-y-3">
              {studentCharges.map((chg) => (
                <div key={chg.id} className="p-3.5 rounded-2xl border border-border/40 bg-muted/15 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground">{chg.billingMonth} Charge</span>
                    <span className={`font-bold uppercase text-[10px] px-2 py-0.5 rounded-full ${
                      chg.status === "paid" ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
                    }`}>
                      {chg.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-muted-foreground text-[11px]">
                    <span>Base Fee: LKR {chg.baseAmount.toLocaleString()}</span>
                    {chg.discountAmount > 0 && <span className="text-emerald-500">Discount: -LKR {chg.discountAmount}</span>}
                    <span className="font-bold text-foreground">Net: LKR {chg.netAmount.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </AnimatedPage>
  );
}
