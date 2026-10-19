"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  Smartphone,
  Send,
  Copy,
  Check,
  Search,
  Filter,
  DollarSign,
  Users,
  Clock,
  Sparkles,
  ExternalLink,
  X,
  MessageSquare,
  ShieldCheck,
  Phone,
  ArrowRight,
} from "lucide-react";
import { AnimatedPage, AnimatedSection } from "@/components/animated-page";
import { mockStudents, mockClasses, mockFeeCharges } from "@/lib/mock-data";
import toast from "react-hot-toast";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ModuleSubNav } from "@/components/layout/module-sub-nav";
import { financeNavItems } from "@/lib/sub-nav-items";

interface ArrearsItem {
  id: string;
  studentId: string;
  name: string;
  guardianName: string;
  guardianPhone: string;
  className: string;
  dueAmount: number;
  daysOverdue: number;
  instituteId: string;
  billingMonth: string;
  riskLevel: "High" | "Medium" | "Low";
  lastContacted?: string;
  dispatchStatus: "pending" | "sent_whatsapp" | "sent_sms";
}

const initialArrears: ArrearsItem[] = [
  // Colombo Main Campus
  {
    id: "arr-1",
    instituteId: "inst-1",
    studentId: "STU-0421",
    name: "Kavindu Perera",
    guardianName: "Sunil Perera",
    guardianPhone: "+94771234567",
    className: "A/L Combined Mathematics 2026 (Theory)",
    dueAmount: 4500,
    daysOverdue: 8,
    billingMonth: "October 2026",
    riskLevel: "Medium",
    lastContacted: "3 days ago",
    dispatchStatus: "pending",
  },
  {
    id: "arr-2",
    instituteId: "inst-1",
    studentId: "STU-0294",
    name: "Tharushi Fernando",
    guardianName: "Malini Fernando",
    guardianPhone: "+94784443322",
    className: "O/L Mathematics Masterclass (English Medium)",
    dueAmount: 3200,
    daysOverdue: 2,
    billingMonth: "October 2026",
    riskLevel: "Low",
    dispatchStatus: "pending",
  },
  {
    id: "arr-3",
    instituteId: "inst-1",
    studentId: "STU-0881",
    name: "Praveen Jayasinghe",
    guardianName: "Ananda Jayasinghe",
    guardianPhone: "+94715556677",
    className: "A/L Physics 2025 (Revision)",
    dueAmount: 4500,
    daysOverdue: 15,
    billingMonth: "October 2026",
    riskLevel: "High",
    lastContacted: "7 days ago",
    dispatchStatus: "pending",
  },
  // Kandy Campus
  {
    id: "arr-kdy-1",
    instituteId: "inst-2",
    studentId: "STU-0904",
    name: "Methmi Senaratne",
    guardianName: "Suneth Senaratne",
    guardianPhone: "+94813345566",
    className: "A/L Combined Mathematics (Kandy Branch)",
    dueAmount: 3570,
    daysOverdue: 3,
    billingMonth: "October 2026",
    riskLevel: "Low",
    lastContacted: "Yesterday",
    dispatchStatus: "pending",
  },
  // Galle Fort Campus
  {
    id: "arr-gle-1",
    instituteId: "inst-3",
    studentId: "STU-0945",
    name: "Kasun Jayasuriya",
    guardianName: "Lalith Jayasuriya",
    guardianPhone: "+94914456677",
    className: "A/L Physics (Galle Fort Campus)",
    dueAmount: 4000,
    daysOverdue: 5,
    billingMonth: "October 2026",
    riskLevel: "Medium",
    lastContacted: "4 days ago",
    dispatchStatus: "pending",
  },
];

import { useInstituteStore } from "@/stores/institute-store";
import { mockInstitutes } from "@/lib/mock-data";

export default function OutstandingFeesPage() {
  const { selectedInstituteId } = useInstituteStore();
  const currentInstitute = mockInstitutes.find((i) => i.id === selectedInstituteId) || mockInstitutes[0];
  const [arrears, setArrears] = useState<ArrearsItem[]>(initialArrears);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudentForMessage, setSelectedStudentForMessage] = useState<ArrearsItem | null>(null);
  const [isBatchDispatching, setIsBatchDispatching] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const instituteArrears = arrears.filter(
    (item) => !selectedInstituteId || item.instituteId === selectedInstituteId
  );

  const filteredArrears = instituteArrears.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.guardianName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.className.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalOutstanding = instituteArrears.reduce((acc, a) => acc + a.dueAmount, 0);

  const generateMessageText = (item: ArrearsItem) => {
    return `Hello ${item.guardianName}, this is a gentle reminder from ${currentInstitute.name}. The tuition fee of LKR ${item.dueAmount.toLocaleString()} for ${item.name} (${item.studentId}) for ${item.billingMonth} (${item.className}) is outstanding. Settle online via PayHere: https://pay.ceyora.lk/inv/${item.studentId} or at our cashier counter. Thank you!`;
  };

  const handleCopyMessage = (item: ArrearsItem) => {
    const text = generateMessageText(item);
    navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    toast.success("Reminder message copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenWhatsApp = (item: ArrearsItem) => {
    const text = encodeURIComponent(generateMessageText(item));
    const url = `https://wa.me/${item.guardianPhone.replace(/[^0-9]/g, "")}?text=${text}`;
    window.open(url, "_blank");
    setArrears((prev) =>
      prev.map((a) => (a.id === item.id ? { ...a, dispatchStatus: "sent_whatsapp" } : a))
    );
    toast.success(`WhatsApp Web opened for ${item.guardianName}`);
  };

  const handleBatchDispatch = async () => {
    setIsBatchDispatching(true);
    await new Promise((r) => setTimeout(r, 1200));
    setArrears((prev) => prev.map((a) => ({ ...a, dispatchStatus: "sent_whatsapp" })));
    setIsBatchDispatching(false);
    toast.success("Batch dispatched: 14 WhatsApp utility cards sent to guardians via Meta Cloud API!", {
      icon: "📲",
    });
  };

  return (
    <AnimatedPage className="space-y-6">
      {/* Breadcrumbs & Navigation */}
      <Breadcrumbs items={[{ label: "Finance", href: "/finance" }, { label: "Arrears & WhatsApp" }]} />

      {/* Header */}
      <AnimatedSection>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="flex h-2 w-2 rounded-full bg-red-500 animate-ping" />
              <span className="text-[11px] font-bold text-red-500 uppercase tracking-widest">
                Receivables Recovery & Parent Communication
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
              Outstanding <span className="gradient-text">Arrears</span>
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Automated parent fee reminders via Meta WhatsApp Cloud API with SMS fallback & manual copy.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleBatchDispatch}
            disabled={isBatchDispatching}
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-shadow disabled:opacity-50"
          >
            {isBatchDispatching ? (
              <>
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Dispatching Batch...</span>
              </>
            ) : (
              <>
                <Smartphone className="h-4 w-4" />
                <span>Batch WhatsApp Dispatch</span>
              </>
            )}
          </motion.button>
        </div>

        {/* Finance Sub-Navigation Bar */}
        <div className="pt-2">
          <ModuleSubNav items={financeNavItems} />
        </div>
      </AnimatedSection>

      {/* Arrears Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AnimatedSection>
          <div className="glass-card rounded-2xl p-5 border border-border/60">
            <span className="text-xs font-bold text-muted-foreground uppercase">Uncollected Arrears</span>
            <p className="text-2xl font-black text-red-500 mt-1">LKR {totalOutstanding.toLocaleString()}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Across current billing cycle</p>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div className="glass-card rounded-2xl p-5 border border-border/60">
            <span className="text-xs font-bold text-muted-foreground uppercase">Students in Arrears</span>
            <p className="text-2xl font-black text-foreground mt-1">{arrears.length} Students</p>
            <p className="text-[11px] text-red-500 font-semibold mt-0.5">
              {arrears.filter((a) => a.riskLevel === "High").length} High Risk (&gt; 10 days)
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div className="glass-card rounded-2xl p-5 border border-border/60">
            <span className="text-xs font-bold text-muted-foreground uppercase">Recovery Success Rate</span>
            <p className="text-2xl font-black text-emerald-500 mt-1">94.8%</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Following WhatsApp reminders</p>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div className="glass-card rounded-2xl p-5 border border-border/60">
            <span className="text-xs font-bold text-muted-foreground uppercase">Meta Cloud API</span>
            <p className="text-2xl font-black text-primary mt-1">Active (99.8%)</p>
            <p className="text-[11px] text-emerald-500 font-semibold mt-0.5">Telco SMS Fallback Ready</p>
          </div>
        </AnimatedSection>
      </div>

      {/* Main Arrears Table */}
      <AnimatedSection>
        <div className="glass-card rounded-3xl shadow-sm border border-border/60 overflow-hidden">
          <div className="flex items-center justify-between gap-3 border-b border-border/50 p-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search student, guardian, or class..."
                className="w-full rounded-xl border border-border/60 bg-muted/30 pl-10 pr-4 py-2 text-xs font-semibold focus:outline-none focus:border-primary"
              />
            </div>
            <span className="text-xs font-bold text-muted-foreground">
              {filteredArrears.length} Follow-ups Pending
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border/50 text-[11px] font-bold text-muted-foreground uppercase tracking-wider bg-muted/10">
                  <th className="py-3.5 pl-4">Student & ID</th>
                  <th className="py-3.5">Guardian Contact</th>
                  <th className="py-3.5">Tuition Class</th>
                  <th className="py-3.5">Overdue Amount</th>
                  <th className="py-3.5">Days Past Due</th>
                  <th className="py-3.5">Risk Level</th>
                  <th className="py-3.5 pr-4 text-right">Dispatch Reminders</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filteredArrears.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3.5 pl-4">
                      <p className="font-bold text-foreground text-xs">{item.name}</p>
                      <p className="text-[10px] font-mono text-primary">{item.studentId}</p>
                    </td>

                    <td className="py-3.5">
                      <p className="font-semibold text-foreground text-xs">{item.guardianName}</p>
                      <p className="text-[10px] font-mono text-emerald-500 font-bold">{item.guardianPhone}</p>
                    </td>

                    <td className="py-3.5 text-muted-foreground text-xs">{item.className}</td>

                    <td className="py-3.5 font-bold text-red-500 text-xs">
                      LKR {item.dueAmount.toLocaleString()}
                    </td>

                    <td className="py-3.5 font-semibold text-foreground text-xs">
                      {item.daysOverdue} Days Overdue
                    </td>

                    <td className="py-3.5">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        item.riskLevel === "High" ? "bg-red-500/10 text-red-500" : "bg-amber-500/10 text-amber-500"
                      }`}>
                        {item.riskLevel} Risk
                      </span>
                    </td>

                    <td className="py-3.5 pr-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleCopyMessage(item)}
                          title="Copy Reminder Message"
                          className="rounded-xl border border-border/60 p-2 text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
                        >
                          {copiedId === item.id ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>

                        <button
                          onClick={() => handleOpenWhatsApp(item)}
                          title="Open WhatsApp Web"
                          className="rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 hover:bg-emerald-500/20 px-3 py-1.5 text-[11px] font-bold flex items-center gap-1 transition-colors"
                        >
                          <Send className="h-3 w-3" />
                          <span>WhatsApp</span>
                        </button>
                      </div>
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
