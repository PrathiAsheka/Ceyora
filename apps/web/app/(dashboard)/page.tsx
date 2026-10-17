"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  Users,
  GraduationCap,
  DollarSign,
  AlertTriangle,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Sparkles,
  Calendar,
  MoreHorizontal,
  CreditCard,
  Target,
  Zap,
  QrCode,
  Send,
  Building2,
  ChevronRight,
  RefreshCw,
  Bell,
  Smartphone,
} from "lucide-react";
import { AnimatedCounter } from "@/components/animated-counter";
import { AnimatedPage, AnimatedSection } from "@/components/animated-page";
import { useI18n } from "@/lib/i18n";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Link from "next/link";
import toast from "react-hot-toast";
import { useInstituteStore } from "@/stores/institute-store";

const monthlyRevenueData = [
  { month: "Jan", expected: 2800000, collected: 2650000, attendance: 89 },
  { month: "Feb", expected: 3100000, collected: 2950000, attendance: 91 },
  { month: "Mar", expected: 3300000, collected: 3200000, attendance: 93 },
  { month: "Apr", expected: 3500000, collected: 3380000, attendance: 90 },
  { month: "May", expected: 3700000, collected: 3590000, attendance: 94 },
  { month: "Jun", expected: 4000000, collected: 3845000, attendance: 95 },
];

const liveClasses = [
  {
    id: "cls-1",
    instituteId: "inst-1",
    name: "A/L Combined Mathematics (Theory)",
    teacher: "Eng. Dilantha Fernando",
    hall: "Hall A - Smart Auditorium",
    enrolled: 220,
    present: 208,
    status: "in_progress",
    time: "08:30 AM - 12:30 PM",
  },
  {
    id: "cls-2",
    instituteId: "inst-1",
    name: "A/L Physics (Revision & Paper)",
    teacher: "Prof. Anura Weerasinghe",
    hall: "Hall B - Science Wing",
    enrolled: 185,
    present: 176,
    status: "in_progress",
    time: "01:00 PM - 04:30 PM",
  },
  {
    id: "cls-3",
    instituteId: "inst-1",
    name: "O/L Science & Technology (English Medium)",
    teacher: "Ms. Rashmi Jayathilake",
    hall: "Hall C - Junior Wing",
    enrolled: 95,
    present: 91,
    status: "upcoming",
    time: "04:45 PM - 06:45 PM",
  },
  {
    id: "cls-6",
    instituteId: "inst-2",
    name: "A/L Combined Mathematics (Kandy Branch)",
    teacher: "Eng. Dilantha Fernando",
    hall: "Kandy Smart Hall 1",
    enrolled: 140,
    present: 133,
    status: "in_progress",
    time: "08:30 AM - 01:00 PM",
  },
  {
    id: "cls-8",
    instituteId: "inst-3",
    name: "A/L Physics (Galle Fort Campus)",
    teacher: "Prof. Anura Weerasinghe",
    hall: "Galle Ocean Hall",
    enrolled: 125,
    present: 118,
    status: "in_progress",
    time: "08:00 AM - 01:00 PM",
  },
];

const feeRecoveryInsights = [
  {
    id: "ins-1",
    student: "Kavindu Perera (STU-0421)",
    batch: "A/L Combined Maths",
    due: "LKR 4,500",
    daysOverdue: 8,
    phone: "+94 77 123 4567",
    risk: "Medium",
  },
  {
    id: "ins-2",
    student: "Minoli Senanayake (STU-0389)",
    batch: "A/L Chemistry",
    due: "LKR 4,200",
    daysOverdue: 14,
    phone: "+94 71 987 6543",
    risk: "High",
  },
  {
    id: "ins-3",
    student: "Dinuka Rajapaksha (STU-0512)",
    batch: "A/L Physics Revision",
    due: "LKR 5,000",
    daysOverdue: 11,
    phone: "+94 76 555 1212",
    risk: "Medium",
  },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card rounded-2xl px-4 py-3 shadow-2xl border border-border/60 bg-card/90 backdrop-blur-xl">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">{label} Performance</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-4 text-xs font-semibold my-1">
            <span className="flex items-center gap-1.5" style={{ color: entry.color }}>
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
              {entry.name}:
            </span>
            <span className="font-bold text-foreground">
              {entry.name.includes("Rate") ? `${entry.value}%` : `LKR ${entry.value.toLocaleString()}`}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  const { t } = useI18n();
  const { selectedInstituteId, selectedInstitute } = useInstituteStore();
  const [chartMetric, setChartMetric] = useState<"revenue" | "attendance">("revenue");
  const [isSendingReminders, setIsSendingReminders] = useState(false);

  const totalStudents = selectedInstitute ? selectedInstitute.activeStudents : 1284;
  const activeClassesCount = selectedInstitute ? selectedInstitute.activeClasses : 28;
  const monthlyRevenue = selectedInstitute ? selectedInstitute.monthlyRevenue : 3845000;

  const kpis = [
    {
      key: "totalStudents",
      title: "Total Enrolled Students",
      value: totalStudents,
      change: "+14.2% vs last month",
      icon: Users,
      gradient: "from-blue-500 to-cyan-400",
      glowColor: "shadow-blue-500/20",
      bgGradient: "from-blue-500/10 via-cyan-500/5 to-transparent",
    },
    {
      key: "activeClasses",
      title: "Active Tuition Classes",
      value: activeClassesCount,
      change: selectedInstitute ? `${selectedInstitute.city} Campus` : "Across 3 Campuses",
      icon: GraduationCap,
      gradient: "from-emerald-500 to-teal-400",
      glowColor: "shadow-emerald-500/20",
      bgGradient: "from-emerald-500/10 via-teal-500/5 to-transparent",
    },
    {
      key: "monthlyRevenue",
      title: "Monthly Fee Collection",
      value: monthlyRevenue,
      prefix: "LKR ",
      change: "+18.5% Net Growth",
      icon: DollarSign,
      gradient: "from-violet-500 to-purple-400",
      glowColor: "shadow-violet-500/20",
      bgGradient: "from-violet-500/10 via-purple-500/5 to-transparent",
    },
    {
      key: "collectionRate",
      title: "Fee Collection Efficiency",
      value: 94.8,
      suffix: "%",
      change: "Target: 95.0%",
      icon: Target,
      gradient: "from-amber-500 to-orange-400",
      glowColor: "shadow-amber-500/20",
      bgGradient: "from-amber-500/10 via-orange-500/5 to-transparent",
    },
  ];

  const handleSendBulkReminders = async () => {
    setIsSendingReminders(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsSendingReminders(false);
    toast.success("Automated WhatsApp reminders dispatched to 14 parents!", {
      icon: "📲",
      style: {
        borderRadius: "1rem",
        background: "hsl(var(--card))",
        color: "hsl(var(--foreground))",
        border: "1px solid hsl(var(--border))",
      },
    });
  };

  const currentLiveClasses = liveClasses.filter(
    (cls) => selectedInstituteId === "all" || cls.instituteId === selectedInstituteId
  );

  return (
    <AnimatedPage className="space-y-6">
      {/* Page Header */}
      <AnimatedSection>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-[11px] font-bold text-emerald-500 uppercase tracking-widest">
                Real-Time Tuition BI
              </span>
              {selectedInstitute && (
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary border border-primary/20">
                  {selectedInstitute.city} Branch
                </span>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
              Institute Intelligence <span className="gradient-text">Overview</span>
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {selectedInstitute
                ? `Live operations, attendance metrics, and fee recovery for ${selectedInstitute.name}.`
                : "Live operations, student attendance metrics, and fee recovery analytics across all branches."}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link href="/attendance/scan">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-violet-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow"
              >
                <QrCode className="h-4 w-4" />
                Launch QR Scanner
              </motion.button>
            </Link>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => toast.success("Dashboard metrics refreshed")}
              className="flex items-center gap-2 rounded-2xl border border-border/60 bg-muted/30 px-3.5 py-2.5 text-xs font-semibold hover:bg-muted/60 transition-colors"
            >
              <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
              Sync
            </motion.button>
          </div>
        </div>
      </AnimatedSection>

      {/* Hero KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <AnimatedSection key={kpi.key}>
              <motion.div
                whileHover={{ y: -4, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`group relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br ${kpi.bgGradient} p-5 shadow-sm hover:shadow-xl ${kpi.glowColor} transition-all duration-300`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    {kpi.title}
                  </span>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br ${kpi.gradient} text-white shadow-md`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>

                <div className="mt-4">
                  <div className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                    {kpi.prefix}
                    <AnimatedCounter value={kpi.value} />
                    {kpi.suffix}
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-emerald-500">
                    <TrendingUp className="h-3.5 w-3.5" />
                    <span>{kpi.change}</span>
                  </div>
                </div>
              </motion.div>
            </AnimatedSection>
          );
        })}
      </div>

      {/* Main Charts & Realtime Classes Row */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column: Visual Revenue / Attendance Trajectory */}
        <AnimatedSection className="lg:col-span-8">
          <div className="glass-card rounded-3xl p-6 shadow-sm border border-border/60 h-full flex flex-col justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h2 className="text-lg font-bold text-foreground">Tuition Revenue & Attendance Curve</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Monthly progression comparing expected billable fees against verified collections
                </p>
              </div>

              {/* View Toggle */}
              <div className="flex items-center rounded-xl border border-border/60 bg-muted/30 p-1 self-start sm:self-auto">
                <button
                  onClick={() => setChartMetric("revenue")}
                  className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                    chartMetric === "revenue" ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Fee Collections
                </button>
                <button
                  onClick={() => setChartMetric("attendance")}
                  className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                    chartMetric === "attendance" ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Attendance %
                </button>
              </div>
            </div>

            {/* Chart Area */}
            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                {chartMetric === "revenue" ? (
                  <AreaChart data={monthlyRevenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="expectedGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="collectedGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(val) => `LKR ${(val / 1000000).toFixed(1)}M`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="expected" name="Expected Billing" stroke="hsl(var(--primary))" strokeWidth={2.5} fill="url(#expectedGrad)" />
                    <Area type="monotone" dataKey="collected" name="Collected Revenue" stroke="#10b981" strokeWidth={2.5} fill="url(#collectedGrad)" />
                  </AreaChart>
                ) : (
                  <AreaChart data={monthlyRevenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="attGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} domain={[80, 100]} tickFormatter={(val) => `${val}%`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="attendance" name="Attendance Rate" stroke="#06b6d4" strokeWidth={3} fill="url(#attGrad)" />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </div>

            {/* Chart Footer Stats */}
            <div className="grid grid-cols-3 gap-2 pt-4 mt-4 border-t border-border/50 text-center">
              <div>
                <p className="text-[11px] text-muted-foreground font-semibold">Projected Monthly</p>
                <p className="text-sm font-bold text-foreground">LKR 4.2M</p>
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground font-semibold">Average Attendance</p>
                <p className="text-sm font-bold text-emerald-500">92.8%</p>
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground font-semibold">Direct Teacher Share</p>
                <p className="text-sm font-bold text-foreground">LKR 2.9M</p>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Right Column: Live Class Feeds */}
        <AnimatedSection className="lg:col-span-4">
          <div className="glass-card rounded-3xl p-6 shadow-sm border border-border/60 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <GraduationCap className="h-4 w-4" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground">Live Campus Classes</h3>
                </div>
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-500">
                  {currentLiveClasses.length} {selectedInstitute ? selectedInstitute.city.toUpperCase() : "ALL"}
                </span>
              </div>

              <div className="space-y-3">
                {currentLiveClasses.map((cls) => {
                  const percentage = Math.round((cls.present / cls.enrolled) * 100);
                  return (
                    <Link
                      key={cls.id}
                      href={`/classes/${cls.id}`}
                      className="block rounded-2xl border border-border/50 bg-muted/20 hover:bg-muted/40 hover:border-primary/40 p-3.5 transition-all group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="min-w-0 pr-2">
                          <p className="text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate">{cls.name}</p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">{cls.teacher}</p>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                          cls.status === "in_progress" ? "bg-emerald-500/15 text-emerald-500" : "bg-blue-500/15 text-blue-500"
                        }`}>
                          {cls.status === "in_progress" ? "LIVE NOW" : "NEXT"}
                        </span>
                      </div>

                      <div className="mt-3">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground mb-1">
                          <span>{cls.hall}</span>
                          <span className="text-foreground font-bold">{cls.present}/{cls.enrolled} ({percentage}%)</span>
                        </div>
                        <div className="h-1.5 w-full bg-muted/60 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary to-emerald-400 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            <Link href="/classes" className="mt-4 block">
              <button className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-border/60 py-2.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
                <span>View All 28 Class Schedules</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </Link>
          </div>
        </AnimatedSection>
      </div>

      {/* Bottom Row: Actionable Fee Arrears Recovery & Quick Launch Tools */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* At-Risk Fee Recovery Panel */}
        <AnimatedSection className="lg:col-span-8">
          <div className="glass-card rounded-3xl p-6 shadow-sm border border-border/60">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground">Actionable Fee Recovery Intelligence</h3>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Overdue tuition fee charges requiring automated parent follow-up
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSendBulkReminders}
                disabled={isSendingReminders}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-shadow disabled:opacity-50"
              >
                {isSendingReminders ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    <span>Dispatching...</span>
                  </>
                ) : (
                  <>
                    <Smartphone className="h-3.5 w-3.5" />
                    <span>Dispatch WhatsApp Reminders</span>
                  </>
                )}
              </motion.button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border/50 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    <th className="pb-3 pl-2">Student & ID</th>
                    <th className="pb-3">Tuition Class</th>
                    <th className="pb-3">Outstanding Fee</th>
                    <th className="pb-3">Overdue</th>
                    <th className="pb-3">Risk Level</th>
                    <th className="pb-3 pr-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {feeRecoveryInsights.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 pl-2 font-semibold text-foreground">
                        {item.student}
                      </td>
                      <td className="py-3 text-muted-foreground">{item.batch}</td>
                      <td className="py-3 font-bold text-red-500">{item.due}</td>
                      <td className="py-3 text-muted-foreground">{item.daysOverdue} days</td>
                      <td className="py-3">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          item.risk === "High" ? "bg-red-500/10 text-red-500" : "bg-amber-500/10 text-amber-500"
                        }`}>
                          {item.risk} Risk
                        </span>
                      </td>
                      <td className="py-3 pr-2 text-right">
                        <Link href="/finance">
                          <button className="rounded-lg bg-primary/10 hover:bg-primary/20 text-primary px-2.5 py-1 text-[11px] font-bold transition-colors">
                            Collect Fee
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </AnimatedSection>

        {/* Quick Launchpad & Shortcuts */}
        <AnimatedSection className="lg:col-span-4">
          <div className="glass-card rounded-3xl p-6 shadow-sm border border-border/60 h-full flex flex-col justify-between space-y-4">
            <div>
              <h3 className="text-sm font-bold text-foreground mb-1">Administrative Shortcuts</h3>
              <p className="text-xs text-muted-foreground mb-4">Frequent tuition institute workflows</p>

              <div className="grid grid-cols-2 gap-2.5">
                <Link href="/attendance/scan" className="block">
                  <div className="rounded-2xl border border-border/50 bg-muted/20 hover:bg-primary/10 hover:border-primary/30 p-3.5 transition-all text-center group">
                    <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary text-primary group-hover:text-white transition-colors mb-2">
                      <QrCode className="h-5 w-5" />
                    </div>
                    <p className="text-xs font-bold text-foreground">Scan QR</p>
                    <p className="text-[10px] text-muted-foreground">Class check-in</p>
                  </div>
                </Link>

                <Link href="/students" className="block">
                  <div className="rounded-2xl border border-border/50 bg-muted/20 hover:bg-emerald-500/10 hover:border-emerald-500/30 p-3.5 transition-all text-center group">
                    <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 group-hover:bg-emerald-500 text-emerald-500 group-hover:text-white transition-colors mb-2">
                      <Users className="h-5 w-5" />
                    </div>
                    <p className="text-xs font-bold text-foreground">Add Student</p>
                    <p className="text-[10px] text-muted-foreground">New admission</p>
                  </div>
                </Link>

                <Link href="/finance" className="block">
                  <div className="rounded-2xl border border-border/50 bg-muted/20 hover:bg-violet-500/10 hover:border-violet-500/30 p-3.5 transition-all text-center group">
                    <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10 group-hover:bg-violet-500 text-violet-500 group-hover:text-white transition-colors mb-2">
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <p className="text-xs font-bold text-foreground">Collect Fee</p>
                    <p className="text-[10px] text-muted-foreground">Issue receipt</p>
                  </div>
                </Link>

                <Link href="/reports" className="block">
                  <div className="rounded-2xl border border-border/50 bg-muted/20 hover:bg-amber-500/10 hover:border-amber-500/30 p-3.5 transition-all text-center group">
                    <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 group-hover:bg-amber-500 text-amber-500 group-hover:text-white transition-colors mb-2">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <p className="text-xs font-bold text-foreground">BI Reports</p>
                    <p className="text-[10px] text-muted-foreground">Export P&L</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Offline Engine status badge */}
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 flex items-center gap-3">
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <div>
                <p className="text-xs font-bold text-foreground">Offline-First Attendance Sync</p>
                <p className="text-[10px] text-muted-foreground">Local storage queue active and in sync with master database</p>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </AnimatedPage>
  );
}
