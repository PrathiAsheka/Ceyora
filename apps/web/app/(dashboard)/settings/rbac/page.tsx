"use client";

import { motion } from "framer-motion";
import { Shield, Plus, Edit, Trash2, Lock, Users } from "lucide-react";
import { AnimatedPage, AnimatedSection } from "@/components/animated-page";
import { useI18n } from "@/lib/i18n";

const roles = [
  { name: "Super Admin", users: 1, permissions: "Full system access", gradient: "from-red-500 to-orange-400" },
  { name: "Institute Admin", users: 0, permissions: "Institute-level management", gradient: "from-amber-500 to-orange-400" },
  { name: "Teacher", users: 0, permissions: "Class management, attendance, marks", gradient: "from-blue-500 to-cyan-400" },
  { name: "Staff/Cashier", users: 0, permissions: "Fee collection, payment processing", gradient: "from-emerald-500 to-teal-400" },
];

export default function RBACPage() {
  const { t } = useI18n();
  return (
    <AnimatedPage className="space-y-6">
      <AnimatedSection>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight"><span className="gradient-text">{t("settings.rbacPage.title")}</span></h1>
            <p className="text-muted-foreground mt-1">{t("settings.rbacPage.subtitle")}</p>
          </div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-violet-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/25">
            <Plus className="h-4 w-4" /> {t("settings.rbacPage.addRole")}
          </motion.button>
        </div>
      </AnimatedSection>

      <div className="grid gap-4 md:grid-cols-2">
        {roles.map((role) => (
          <AnimatedSection key={role.name}>
            <motion.div whileHover={{ y: -3 }} className="glass-card rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`rounded-xl bg-gradient-to-br ${role.gradient} p-2.5 shadow-lg`}>
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{role.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{role.users} user(s)</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <motion.button whileHover={{ scale: 1.1 }} className="rounded-lg p-1.5 hover:bg-muted/60"><Edit className="h-4 w-4" /></motion.button>
                  {role.name !== "Super Admin" && (
                    <motion.button whileHover={{ scale: 1.1 }} className="rounded-lg p-1.5 hover:bg-red-500/10 text-red-500"><Trash2 className="h-4 w-4" /></motion.button>
                  )}
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-border/30">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Lock className="h-3.5 w-3.5" />
                  {role.permissions}
                </div>
              </div>
            </motion.div>
          </AnimatedSection>
        ))}
      </div>

      <AnimatedSection>
        <div className="glass-card rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">{t("settings.rbacPage.permissionMatrix")}</h2>
          <div className="p-10 text-center">
            <Lock className="mx-auto h-10 w-10 text-muted-foreground/20" />
            <p className="mt-2 text-sm text-muted-foreground">{t("settings.rbacPage.editRole")}</p>
          </div>
        </div>
      </AnimatedSection>
    </AnimatedPage>
  );
}
