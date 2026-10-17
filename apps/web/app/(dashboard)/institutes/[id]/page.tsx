"use client";

import { use } from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Edit,
  Users,
  GraduationCap,
  DollarSign,
  Building2,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  QrCode,
  Clock,
  TrendingUp,
} from "lucide-react";
import { AnimatedPage, AnimatedSection } from "@/components/animated-page";
import { mockInstitutes, mockClasses, mockTeachers } from "@/lib/mock-data";
import Link from "next/link";
import toast from "react-hot-toast";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";

export default function InstituteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const institute = mockInstitutes.find((i) => i.id === resolvedParams.id) || mockInstitutes[0];

  const branchClasses = mockClasses.filter((c) => c.instituteId === institute.id);
  const branchTeachers = mockTeachers.filter((t) =>
    t.assignedClassIds.some((cid) => branchClasses.some((bc) => bc.id === cid))
  );

  return (
    <AnimatedPage className="space-y-6">
      {/* Breadcrumbs Navigation */}
      <Breadcrumbs items={[{ label: "Institutes", href: "/institutes" }, { label: institute.name }]} />

      {/* Header */}
      <AnimatedSection>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                {institute.code}
              </span>
              <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Active Campus
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-foreground mt-1">
              {institute.name}
            </h1>
            <p className="text-xs text-muted-foreground">{institute.address}</p>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => toast.success("Institute configuration updated")}
              className="flex items-center gap-1.5 rounded-2xl border border-border/60 px-4 py-2 text-xs font-bold hover:bg-muted/50"
            >
              <Edit className="h-3.5 w-3.5" /> Configure Branch
            </motion.button>
            <Link href="/attendance/scan">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-primary to-violet-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-primary/25"
              >
                <QrCode className="h-3.5 w-3.5" /> Open Gate Scanner
              </motion.button>
            </Link>
          </div>
        </div>
      </AnimatedSection>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AnimatedSection>
          <div className="glass-card rounded-2xl p-5 border border-border/60">
            <span className="text-xs font-bold text-muted-foreground uppercase">Active Students</span>
            <p className="text-2xl font-black text-foreground mt-1">{institute.activeStudents.toLocaleString()}</p>
            <p className="text-[11px] text-emerald-500 font-semibold mt-0.5">+14.2% Enrollment Rate</p>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div className="glass-card rounded-2xl p-5 border border-border/60">
            <span className="text-xs font-bold text-muted-foreground uppercase">Active Classes</span>
            <p className="text-2xl font-black text-foreground mt-1">{institute.activeClasses}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Across 4 Auditoriums</p>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div className="glass-card rounded-2xl p-5 border border-border/60">
            <span className="text-xs font-bold text-muted-foreground uppercase">Monthly Turnover</span>
            <p className="text-2xl font-black text-foreground mt-1">LKR {(institute.monthlyRevenue / 1000000).toFixed(2)}M</p>
            <p className="text-[11px] text-primary font-semibold mt-0.5">Cut-off: {institute.billingCutOffDay}th of month</p>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div className="glass-card rounded-2xl p-5 border border-border/60">
            <span className="text-xs font-bold text-muted-foreground uppercase">Faculty Members</span>
            <p className="text-2xl font-black text-foreground mt-1">{branchTeachers.length} Lecturers</p>
            <p className="text-[11px] text-emerald-500 font-semibold mt-0.5">All Payouts Reconciled</p>
          </div>
        </AnimatedSection>
      </div>

      {/* Operational Config & Connected Entities */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left: Operational Specifications */}
        <AnimatedSection className="lg:col-span-5 space-y-5">
          <div className="glass-card rounded-3xl p-6 border border-border/60 space-y-4">
            <h3 className="text-sm font-bold text-foreground">Campus Configuration & Telemetry</h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-2 border-b border-border/40">
                <span className="text-muted-foreground">Institute Code:</span>
                <span className="font-mono font-bold text-primary">{institute.code}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border/40">
                <span className="text-muted-foreground">Operating City:</span>
                <span className="font-bold text-foreground">{institute.city}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border/40">
                <span className="text-muted-foreground">Official Phone:</span>
                <span className="font-semibold text-foreground">{institute.phone}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border/40">
                <span className="text-muted-foreground">Billing Cut-Off Day:</span>
                <span className="font-bold text-foreground">{institute.billingCutOffDay}th of each month</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border/40">
                <span className="text-muted-foreground">Currency Default:</span>
                <span className="font-bold text-foreground">Sri Lankan Rupee (LKR)</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border/40">
                <span className="text-muted-foreground">Payment Gateway:</span>
                <span className="font-bold text-emerald-500 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> PayHere Production
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-muted-foreground">PDPA Privacy Compliance:</span>
                <span className="font-bold text-emerald-500 flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" /> Certified Compliant
                </span>
              </div>
            </div>
          </div>

          {/* Quick Branch Teachers Card */}
          <div className="glass-card rounded-3xl p-6 border border-border/60">
            <h3 className="text-sm font-bold text-foreground mb-3">Teaching Faculty at this Campus</h3>
            <div className="space-y-2.5">
              {branchTeachers.map((tea) => (
                <div key={tea.id} className="flex items-center justify-between p-3 rounded-2xl border border-border/50 bg-muted/20">
                  <div>
                    <p className="text-xs font-bold text-foreground">{tea.name}</p>
                    <p className="text-[10px] text-muted-foreground">{tea.subjects.join(", ")}</p>
                  </div>
                  <Link href={`/teachers/${tea.id}`}>
                    <button className="text-[10px] font-bold text-primary hover:underline flex items-center gap-0.5">
                      Profile <ExternalLink className="h-2.5 w-2.5" />
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Right: Classes Conducted at this Institute */}
        <AnimatedSection className="lg:col-span-7">
          <div className="glass-card rounded-3xl p-6 border border-border/60 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-foreground">Classes Conducted at this Campus</h3>
                <Link href="/classes">
                  <span className="text-xs font-semibold text-primary hover:underline">View All Classes</span>
                </Link>
              </div>

              <div className="space-y-3">
                {branchClasses.map((cls) => {
                  const teacher = mockTeachers.find((t) => t.id === cls.teacherId);
                  const attendancePct = Math.round((cls.presentLastClass / cls.enrolledStudentsCount) * 100);
                  return (
                    <div
                      key={cls.id}
                      className="rounded-2xl border border-border/50 bg-muted/20 hover:bg-muted/40 p-4 transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                            {cls.code}
                          </span>
                          <h4 className="text-xs font-bold text-foreground mt-1">{cls.name}</h4>
                          <p className="text-[11px] text-muted-foreground">{teacher?.name} • {cls.grade}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-foreground">LKR {cls.monthlyFee.toLocaleString()}/mo</p>
                          <span className="text-[10px] font-semibold text-emerald-500">{cls.timeSlot}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-border/40 text-[11px]">
                        <div>
                          <span className="text-muted-foreground">Hall:</span>{" "}
                          <span className="font-semibold text-foreground">{cls.hall}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Enrollment:</span>{" "}
                          <span className="font-semibold text-foreground">{cls.enrolledStudentsCount} Students</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Attendance:</span>{" "}
                          <span className="font-bold text-emerald-500">{attendancePct}%</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
              <span>All classes linked to PostgreSQL Row-Level Security</span>
              <span className="font-bold text-foreground">Apex Multi-Tenant Layer</span>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </AnimatedPage>
  );
}
