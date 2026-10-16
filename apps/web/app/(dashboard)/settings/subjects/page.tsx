"use client";

import { motion } from "framer-motion";
import { Plus, Search, BookOpen, Edit, Trash2 } from "lucide-react";
import { AnimatedPage, AnimatedSection } from "@/components/animated-page";
import { useI18n } from "@/lib/i18n";

export default function SubjectsPage() {
  const { t } = useI18n();
  return (
    <AnimatedPage className="space-y-6">
      <AnimatedSection>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight"><span className="gradient-text">{t("settings.subjectsPage.title")}</span></h1>
            <p className="text-muted-foreground mt-1">{t("settings.subjectsPage.subtitle")}</p>
          </div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-violet-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/25">
            <Plus className="h-4 w-4" /> {t("settings.subjectsPage.addSubject")}
          </motion.button>
        </div>
      </AnimatedSection>

      <AnimatedSection>
        <div className="glass-card rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 border-b border-border/50 p-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input type="text" placeholder={t("settings.subjectsPage.searchPlaceholder")}
                className="w-full rounded-xl border border-border/50 bg-muted/30 pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:bg-background focus:border-primary/30 focus-glow transition-all" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50 bg-muted/20 text-left">
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">Subject Name</th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">Grade Levels</th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">Classes</th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">Actions</th>
                </tr>
              </thead>
              <tbody>
                {["Mathematics", "Physics", "Chemistry", "Biology", "English", "Sinhala"].map((subject, i) => (
                  <motion.tr key={subject} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}
                    className="border-b border-border/30 last:border-0 hover:bg-muted/20 transition-colors group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-violet-500/10 text-primary font-bold text-sm">
                          {subject.charAt(0)}
                        </div>
                        <span className="font-semibold group-hover:text-primary transition-colors">{subject}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">6-13</td>
                    <td className="px-5 py-4 text-sm font-semibold">0</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
