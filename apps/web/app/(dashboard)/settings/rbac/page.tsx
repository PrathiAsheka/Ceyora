"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Plus,
  Edit,
  Trash2,
  Lock,
  Users,
  Check,
  Save,
  CheckCircle2,
  Key,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { AnimatedPage, AnimatedSection } from "@/components/animated-page";
import { useI18n } from "@/lib/i18n";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ModuleSubNav } from "@/components/layout/module-sub-nav";
import { settingsNavItems } from "@/lib/sub-nav-items";

interface PermissionRow {
  key: string;
  category: string;
  name: string;
  description: string;
  superAdmin: boolean;
  instituteAdmin: boolean;
  teacher: boolean;
  cashier: boolean;
}

export default function RBACPage() {
  const { t } = useI18n();
  const [isSaved, setIsSaved] = useState(false);

  const [permissions, setPermissions] = useState<PermissionRow[]>([
    // Branch & Platform
    {
      key: "branch_provision",
      category: "Platform Administration",
      name: "Create & Provision Branches",
      description: "Establish new institute centers, tenant quotas, and root databases",
      superAdmin: true,
      instituteAdmin: false,
      teacher: false,
      cashier: false,
    },
    {
      key: "user_manage",
      category: "Platform Administration",
      name: "User & Staff Management",
      description: "Invite, suspend, and reset passwords for institute personnel",
      superAdmin: true,
      instituteAdmin: true,
      teacher: false,
      cashier: false,
    },
    // Academic & Classes
    {
      key: "class_schedule",
      category: "Academic & Scheduling",
      name: "Batch & Timetable Creation",
      description: "Define class batches, allocate lecture halls, and configure fee tariffs",
      superAdmin: true,
      instituteAdmin: true,
      teacher: false,
      cashier: false,
    },
    {
      key: "marks_entry",
      category: "Academic & Scheduling",
      name: "Enter Exam Marks & Topics",
      description: "Record term test marks, topic diagnostic tags, and homework submission",
      superAdmin: true,
      instituteAdmin: true,
      teacher: true,
      cashier: false,
    },
    {
      key: "pdpa_toggle",
      category: "Academic & Scheduling",
      name: "PDPA Anonymized Ranking View",
      description: "Toggle between masked candidate IDs and public leaderboards",
      superAdmin: true,
      instituteAdmin: true,
      teacher: true,
      cashier: false,
    },
    // Attendance & Scanners
    {
      key: "qr_gate_scan",
      category: "Gate & Operations",
      name: "Operate QR Biometric Gate Station",
      description: "Check in students at physical turnstiles with laser / camera scanner",
      superAdmin: true,
      instituteAdmin: true,
      teacher: false,
      cashier: true,
    },
    {
      key: "override_attendance",
      category: "Gate & Operations",
      name: "Manual Attendance Override",
      description: "Manually verify student entry during scanner latency or card loss",
      superAdmin: true,
      instituteAdmin: true,
      teacher: false,
      cashier: true,
    },
    // Finance & Collections
    {
      key: "fee_collection",
      category: "Finance & Accounting",
      name: "Cash & Card Fee Collection",
      description: "Issue double-entry payment vouchers and print physical receipts",
      superAdmin: true,
      instituteAdmin: true,
      teacher: false,
      cashier: true,
    },
    {
      key: "fee_reversal",
      category: "Finance & Accounting",
      name: "Compensating Ledger Reversals",
      description: "Void erroneously recorded receipts with mandatory audit reason",
      superAdmin: true,
      instituteAdmin: true,
      teacher: false,
      cashier: false,
    },
    {
      key: "teacher_payout",
      category: "Finance & Accounting",
      name: "Calculate & Authorize Faculty Payouts",
      description: "Execute 80/20 splits, deduct AC hall charges, and export bank advice",
      superAdmin: true,
      instituteAdmin: true,
      teacher: false,
      cashier: false,
    },
    {
      key: "view_teacher_statement",
      category: "Finance & Accounting",
      name: "View Faculty Settlement Statement",
      description: "Access personal earnings breakdown and historical bank deposits",
      superAdmin: true,
      instituteAdmin: true,
      teacher: true,
      cashier: false,
    },
  ]);

  const togglePermission = (
    key: string,
    role: "superAdmin" | "instituteAdmin" | "teacher" | "cashier"
  ) => {
    if (role === "superAdmin") return; // Super admin keeps full privileges
    setPermissions(
      permissions.map((p) => (p.key === key ? { ...p, [role]: !p[role] } : p))
    );
  };

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const rolesSummary = [
    {
      name: "Super Admin",
      users: 1,
      privilege: "Root Tier",
      badge: "Full System Access",
      gradient: "from-red-500 to-orange-400",
      desc: "Multi-tenant infrastructure, root audit trails, and platform billing.",
    },
    {
      name: "Institute Admin",
      users: 3,
      privilege: "Executive Tier",
      badge: "Branch Operational",
      gradient: "from-amber-500 to-orange-400",
      desc: "Branch roster, fee scheduling, teacher payroll, and admissions.",
    },
    {
      name: "Teacher / Faculty",
      users: 12,
      privilege: "Academic Tier",
      badge: "Class & Marks",
      gradient: "from-blue-500 to-cyan-400",
      desc: "Batch students, examination grading, topics, and earnings statement.",
    },
    {
      name: "Cashier / Desk Operator",
      users: 6,
      privilege: "Frontline Tier",
      badge: "POS & Gate QR",
      gradient: "from-emerald-500 to-teal-400",
      desc: "QR scanner workstation, fee collection, physical receipt voucher issuance.",
    },
  ];

  return (
    <AnimatedPage className="space-y-6">
      {/* Breadcrumbs & Navigation */}
      <Breadcrumbs items={[{ label: "Settings", href: "/settings" }, { label: "4-Tier RBAC Matrix" }]} />

      {/* Header */}
      <AnimatedSection>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <ShieldCheck className="h-3.5 w-3.5" /> 4-Tier Security Matrix
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-500">
                <Lock className="h-3 w-3" /> PDPA Least Privilege Principle
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              <span className="gradient-text">{t("settings.rbacPage.title")}</span>
            </h1>
            <p className="text-muted-foreground mt-1">{t("settings.rbacPage.subtitle")}</p>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-violet-500 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-primary/25"
            >
              {isSaved ? (
                <>
                  <Check className="h-4 w-4" strokeWidth={3} /> Matrix Saved!
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" /> Save RBAC Matrix
                </>
              )}
            </motion.button>
          </div>
        </div>

        {/* Settings Sub-Navigation Bar */}
        <div className="pt-2">
          <ModuleSubNav items={settingsNavItems} />
        </div>
      </AnimatedSection>

      {/* Save Success Banner */}
      <AnimatePresence>
        {isSaved && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 flex items-center justify-between text-xs text-emerald-700 dark:text-emerald-300 font-semibold"
          >
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-500" strokeWidth={3} />
              <span>Role permission policy enforced across all logged-in JWT user sessions.</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Role Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {rolesSummary.map((role) => (
          <AnimatedSection key={role.name}>
            <div className="glass-card rounded-2xl p-4 shadow-sm border border-border/40 space-y-2 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <div className={`h-2.5 w-2.5 rounded-full bg-gradient-to-r ${role.gradient}`} />
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                    {role.privilege}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-foreground mt-2">{role.name}</h3>
                <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">{role.desc}</p>
              </div>

              <div className="pt-2 border-t border-border/30 flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1 font-semibold text-foreground/80">
                  <Users className="h-3 w-3" /> {role.users} Active Users
                </span>
                <span className="text-[10px] font-bold text-primary">{role.badge}</span>
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>

      {/* Interactive Permission Matrix */}
      <AnimatedSection>
        <div className="glass-card rounded-2xl shadow-sm border border-border/40 overflow-hidden">
          <div className="border-b border-border/40 px-6 py-4 flex items-center justify-between bg-muted/20">
            <div>
              <h3 className="font-bold text-sm text-foreground">Interactive Access Control Matrix</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Toggle capabilities granted to each operational role in the tuition institute
              </p>
            </div>
            <span className="text-xs font-semibold text-muted-foreground">11 Granular Scopes</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border/40 bg-muted/30 text-muted-foreground uppercase tracking-wider font-semibold">
                  <th className="px-6 py-3.5">Capability / Scope</th>
                  <th className="px-4 py-3.5 text-center w-32">Super Admin</th>
                  <th className="px-4 py-3.5 text-center w-36">Institute Admin</th>
                  <th className="px-4 py-3.5 text-center w-32">Teacher</th>
                  <th className="px-4 py-3.5 text-center w-32">Cashier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {permissions.map((perm) => (
                  <tr key={perm.key} className="hover:bg-muted/15 transition-colors">
                    <td className="px-6 py-3.5">
                      <div className="font-semibold text-foreground text-xs">{perm.name}</div>
                      <div className="text-[11px] text-muted-foreground">{perm.description}</div>
                      <span className="inline-block mt-1 text-[9px] font-mono text-primary/70 uppercase">
                        [{perm.category}]
                      </span>
                    </td>

                    {/* Super Admin */}
                    <td className="px-4 py-3.5 text-center">
                      <div className="flex justify-center">
                        <span className="h-6 w-6 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center cursor-not-allowed">
                          <Check className="h-3.5 w-3.5" strokeWidth={3} />
                        </span>
                      </div>
                    </td>

                    {/* Institute Admin */}
                    <td className="px-4 py-3.5 text-center">
                      <div className="flex justify-center">
                        <button
                          type="button"
                          onClick={() => togglePermission(perm.key, "instituteAdmin")}
                          className={`h-6 w-6 rounded-lg flex items-center justify-center transition-all ${
                            perm.instituteAdmin
                              ? "bg-primary text-white shadow-sm"
                              : "border border-border/60 hover:border-primary text-transparent"
                          }`}
                        >
                          <Check className="h-3.5 w-3.5" strokeWidth={3} />
                        </button>
                      </div>
                    </td>

                    {/* Teacher */}
                    <td className="px-4 py-3.5 text-center">
                      <div className="flex justify-center">
                        <button
                          type="button"
                          onClick={() => togglePermission(perm.key, "teacher")}
                          className={`h-6 w-6 rounded-lg flex items-center justify-center transition-all ${
                            perm.teacher
                              ? "bg-primary text-white shadow-sm"
                              : "border border-border/60 hover:border-primary text-transparent"
                          }`}
                        >
                          <Check className="h-3.5 w-3.5" strokeWidth={3} />
                        </button>
                      </div>
                    </td>

                    {/* Cashier */}
                    <td className="px-4 py-3.5 text-center">
                      <div className="flex justify-center">
                        <button
                          type="button"
                          onClick={() => togglePermission(perm.key, "cashier")}
                          className={`h-6 w-6 rounded-lg flex items-center justify-center transition-all ${
                            perm.cashier
                              ? "bg-primary text-white shadow-sm"
                              : "border border-border/60 hover:border-primary text-transparent"
                          }`}
                        >
                          <Check className="h-3.5 w-3.5" strokeWidth={3} />
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
