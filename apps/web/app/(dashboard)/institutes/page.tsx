"use client";

import { motion } from "framer-motion";
import { Plus, Search, Filter, Eye, Edit, Trash2, Building2, MoreHorizontal } from "lucide-react";
import { AnimatedPage, AnimatedSection } from "@/components/animated-page";
import { useI18n } from "@/lib/i18n";

const sampleData = [
  { id: "1", name: "Demo Tuition Center", phone: "+94771234567", email: "demo@ceyora.lk", students: 0, classes: 0, status: "Active" },
];

export default function InstitutesPage() {
  const { t } = useI18n();
  const headers = t("institutes.tableHeaders") as any;
  const instituteName = t("institutes.mockName");
  const statusText = t("institutes.mockStatus");
  return (
    <AnimatedPage className="space-y-6">
      <AnimatedSection>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              <span className="gradient-text">{t("institutes.title")}</span>
            </h1>
            <p className="text-muted-foreground mt-1">{t("institutes.subtitle")}</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-violet-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow"
          >
            <Plus className="h-4 w-4" />
            {t("institutes.addInstitute")}
          </motion.button>
        </div>
      </AnimatedSection>

      <AnimatedSection>
        <div className="glass-card rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 border-b border-border/50 p-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder={t("institutes.searchPlaceholder")}
                className="w-full rounded-xl border border-border/50 bg-muted/30 pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:bg-background focus:border-primary/30 focus-glow transition-all"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 rounded-xl border border-border/50 px-3.5 py-2.5 text-sm hover:bg-muted/50 transition-all"
            >
              <Filter className="h-4 w-4" />
              {t("institutes.filter")}
            </motion.button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50 bg-muted/20 text-left">
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">{headers?.name || "Name"}</th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">{headers?.phone || "Phone"}</th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">{headers?.email || "Email"}</th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">{headers?.students || "Students"}</th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">{headers?.status || "Status"}</th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">{headers?.actions || "Actions"}</th>
                </tr>
              </thead>
              <tbody>
                {sampleData.map((row, i) => (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    className="border-b border-border/30 last:border-0 hover:bg-muted/20 transition-colors group"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-violet-500/10 text-primary font-bold text-sm">
                          {instituteName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold group-hover:text-primary transition-colors">{instituteName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">{row.phone}</td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">{row.email}</td>
                    <td className="px-5 py-4 text-sm font-semibold">{row.students}</td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 badge-glow-green">
                        {statusText}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <motion.button whileHover={{ scale: 1.1 }} className="rounded-lg p-1.5 hover:bg-muted/60"><Eye className="h-4 w-4" /></motion.button>
                        <motion.button whileHover={{ scale: 1.1 }} className="rounded-lg p-1.5 hover:bg-muted/60"><Edit className="h-4 w-4" /></motion.button>
                        <motion.button whileHover={{ scale: 1.1 }} className="rounded-lg p-1.5 hover:bg-red-500/10 text-red-500"><Trash2 className="h-4 w-4" /></motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </AnimatedSection>
    </AnimatedPage>
  );
}
