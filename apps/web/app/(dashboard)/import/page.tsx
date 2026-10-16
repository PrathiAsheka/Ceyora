"use client";

import { motion } from "framer-motion";
import { Upload, FileSpreadsheet, FileText } from "lucide-react";
import { useState } from "react";
import { AnimatedPage, AnimatedSection } from "@/components/animated-page";
import { useI18n } from "@/lib/i18n";

export default function DataImportPage() {
  const { t } = useI18n();
  const [dragOver, setDragOver] = useState(false);

  return (
    <AnimatedPage className="space-y-6">
      <AnimatedSection>
        <div>
          <h1 className="text-3xl font-bold tracking-tight"><span className="gradient-text">{t("import.title")}</span></h1>
          <p className="text-muted-foreground mt-1">{t("import.subtitle")}</p>
        </div>
      </AnimatedSection>

      <AnimatedSection>
        <motion.div
          animate={dragOver ? { scale: 1.01, borderColor: "hsl(262 83% 58%)" } : {}}
          className={`rounded-2xl border-2 border-dashed p-14 text-center transition-all cursor-pointer ${
            dragOver ? "border-primary bg-primary/5" : "border-border/40 hover:border-primary/30 hover:bg-muted/20"
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-violet-500 shadow-xl shadow-primary/20"
          >
            <Upload className="h-10 w-10 text-white" />
          </motion.div>
          <h3 className="mt-5 text-xl font-bold">{t("import.dropFile")}</h3>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {t("import.orBrowse")}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">{t("import.fileTypes")}</p>
        </motion.div>
      </AnimatedSection>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[
          { type: t("import.students"), desc: t("import.studentsDesc"), gradient: "from-blue-500 to-cyan-400" },
          { type: t("import.teachers"), desc: t("import.teachersDesc"), gradient: "from-emerald-500 to-teal-400" },
          { type: t("import.classes"), desc: t("import.classesDesc"), gradient: "from-violet-500 to-purple-400" },
          { type: t("import.feeCharges"), desc: t("import.feeChargesDesc"), gradient: "from-amber-500 to-orange-400" },
          { type: t("import.payments"), desc: t("import.paymentsDesc"), gradient: "from-red-500 to-pink-400" },
          { type: t("import.examResults"), desc: t("import.examResultsDesc"), gradient: "from-cyan-500 to-blue-400" },
        ].map((item) => (
          <AnimatedSection key={item.type}>
            <motion.div whileHover={{ y: -3, scale: 1.01 }}
              className="glass-card rounded-2xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer">
              <div className="flex items-center gap-3">
                <div className={`rounded-xl bg-gradient-to-br ${item.gradient} p-2.5 shadow-lg`}>
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{item.type}</h3>
                  <p className="text-[11px] text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            </motion.div>
          </AnimatedSection>
        ))}
      </div>
    </AnimatedPage>
  );
}
