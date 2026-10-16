"use client";

import { motion } from "framer-motion";
import { Plus, BookOpen, Phone, Users, GraduationCap } from "lucide-react";
import { AnimatedPage, AnimatedSection } from "@/components/animated-page";
import { useI18n } from "@/lib/i18n";

export default function TeachersPage() {
  const { t } = useI18n();
  const mockTeachers = t("teachers.mock");
  const gradients = [
    "from-blue-500 to-cyan-400",
    "from-emerald-500 to-teal-400",
    "from-violet-500 to-purple-400",
  ];
  return (
    <AnimatedPage className="space-y-6">
      <AnimatedSection>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              <span className="gradient-text">{t("teachers.title")}</span>
            </h1>
            <p className="text-muted-foreground mt-1">{t("teachers.subtitle")}</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-violet-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow"
          >
            <Plus className="h-4 w-4" />
            {t("teachers.addTeacher")}
          </motion.button>
        </div>
      </AnimatedSection>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.isArray(mockTeachers) && mockTeachers.map((teacher: any, i: number) => (
          <AnimatedSection key={i}>
            <motion.div
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="group glass-card rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-5">
                <div className="relative">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${gradients[i % gradients.length]} text-white font-bold text-lg shadow-lg`}>
                    {teacher.name.split(" ").map((n: string) => n[0]).join("")}
                  </div>
                  <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-400 border-2 border-background" />
                </div>
                <div>
                  <h3 className="font-semibold text-base group-hover:text-primary transition-colors">{teacher.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{teacher.comp}</p>
                </div>
              </div>
              <div className="space-y-2.5 text-sm mb-5">
                <div className="flex items-center gap-2.5 text-muted-foreground">
                  <BookOpen className="h-4 w-4 shrink-0" />
                  <span>{teacher.subjects.join(", ")}</span>
                </div>
                <div className="flex items-center gap-2.5 text-muted-foreground">
                  <Phone className="h-4 w-4 shrink-0" />
                  <span>{teacher.phone}</span>
                </div>
              </div>
              <div className="pt-4 border-t border-border/30 grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-muted/30 py-2.5 text-center">
                  <p className="text-lg font-bold">{teacher.classes}</p>
                  <p className="text-[11px] text-muted-foreground">{t("nav.classes")}</p>
                </div>
                <div className="rounded-xl bg-muted/30 py-2.5 text-center">
                  <p className="text-lg font-bold">{teacher.students}</p>
                  <p className="text-[11px] text-muted-foreground">{t("nav.students")}</p>
                </div>
              </div>
            </motion.div>
          </AnimatedSection>
        ))}
      </div>
    </AnimatedPage>
  );
}
