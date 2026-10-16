"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import { useUIStore } from "@/stores/ui-store";
import {
  LayoutDashboard,
  Building2,
  GraduationCap,
  Users,
  UserCircle,
  DollarSign,
  QrCode,
  BookOpen,
  BarChart3,
  Lightbulb,
  FileText,
  Upload,
  HeadphonesIcon,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  X,
  Menu,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Sidebar() {
  const pathname = usePathname();
  const { t } = useI18n();
  const { mobileSidebarOpen, closeMobileSidebar, desktopCollapsed, toggleDesktopCollapsed } = useUIStore();

  const translatedSectionLabels: Record<string, string> = {
    "nav.overview": t("nav.overview"),
    "nav.management": t("nav.management"),
    "nav.finance": t("nav.finance"),
    "nav.operations": t("nav.operations"),
    "nav.intelligence": t("nav.intelligence"),
    "nav.system": t("nav.system"),
  };

  const sections = [
    {
      labelKey: "nav.overview",
      items: [
        { labelKey: "nav.dashboard", href: "/", icon: LayoutDashboard },
      ],
    },
    {
      labelKey: "nav.management",
      items: [
        { labelKey: "nav.institutes", href: "/institutes", icon: Building2 },
        { labelKey: "nav.classes", href: "/classes", icon: GraduationCap },
        { labelKey: "nav.teachers", href: "/teachers", icon: Users },
        { labelKey: "nav.students", href: "/students", icon: UserCircle },
      ],
    },
    {
      labelKey: "nav.finance",
      items: [
        { labelKey: "nav.finance", href: "/finance", icon: DollarSign },
      ],
    },
    {
      labelKey: "nav.operations",
      items: [
        { labelKey: "nav.qrScanner", href: "/attendance/scan", icon: QrCode },
        { labelKey: "nav.attendance", href: "/attendance", icon: BookOpen },
        { labelKey: "nav.academic", href: "/academic", icon: GraduationCap },
      ],
    },
    {
      labelKey: "nav.intelligence",
      items: [
        { labelKey: "nav.analytics", href: "/analytics", icon: BarChart3 },
        { labelKey: "nav.recommendations", href: "/recommendations", icon: Lightbulb },
        { labelKey: "nav.reports", href: "/reports", icon: FileText },
      ],
    },
    {
      labelKey: "nav.system",
      items: [
        { labelKey: "nav.import", href: "/import", icon: Upload },
        { labelKey: "nav.support", href: "/support", icon: HeadphonesIcon },
        { labelKey: "nav.settings", href: "/settings", icon: Settings },
      ],
    },
  ];

  function handleNavClick() {
    closeMobileSidebar();
  }

  function SidebarNav({ collapsed }: { collapsed: boolean }) {
    return (
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5 relative z-10">
        {sections.map((section, sIdx) => (
          <div key={section.labelKey}>
            <AnimatePresence>
              {!collapsed && (
                <motion.p
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.2, delay: sIdx * 0.03 }}
                  className="px-3 mb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/60"
                >
                  {translatedSectionLabels[section.labelKey] ?? section.labelKey}
                </motion.p>
              )}
            </AnimatePresence>
            {section.items.map((item) => {
              const Icon = item.icon;
              const label = t(item.labelKey);
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleNavClick}
                  className={cn(
                    "group relative flex items-center rounded-xl text-sm font-medium transition-all duration-200",
                    collapsed ? "justify-center px-0 py-2.5 mb-1" : "gap-3 px-3 py-2.5 mb-0.5",
                    isActive
                      ? "bg-gradient-to-r from-primary/10 via-primary/5 to-transparent text-primary sidebar-active"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  )}
                  title={collapsed ? label : undefined}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  <Icon className={cn(
                    "h-[18px] w-[18px] shrink-0 relative z-10 transition-colors duration-200",
                    isActive ? "text-primary" : "group-hover:text-foreground"
                  )} />
                  {!collapsed && <span className="relative z-10">{label}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
    );
  }

  function UserSection() {
    return (
      <div className="border-t border-border/50 p-4 relative z-10">
        <div className="flex items-center gap-3 rounded-xl p-2 hover:bg-muted/50 transition-colors cursor-pointer">
          <div className="relative">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-violet-500 text-white text-xs font-bold avatar-ring">
              SA
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400 border-2 border-background" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">Super Admin</p>
            <p className="text-xs text-muted-foreground truncate">admin@ceyora.lk</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ===== DESKTOP SIDEBAR ===== */}
      <aside
        className={cn(
          "hidden lg:flex flex-col glass border-r transition-all duration-300 ease-in-out relative shrink-0",
          desktopCollapsed ? "w-[68px]" : "w-[260px]"
        )}
      >
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

        {/* Header */}
        <div className={cn(
          "flex h-16 items-center border-b border-border/50 relative z-10 shrink-0",
          desktopCollapsed ? "justify-center px-2" : "justify-between px-5"
        )}>
          {desktopCollapsed ? (
            /* Collapsed: only the expand button, no logo */
            <button
              onClick={toggleDesktopCollapsed}
              className="rounded-xl p-2 text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all duration-200"
              title="Expand sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
          ) : (
            /* Expanded: logo + collapse button */
            <>
              <Link href="/" className="flex items-center gap-2.5 group" onClick={handleNavClick}>
                <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-violet-500 text-white font-bold text-sm shadow-lg shadow-primary/25 group-hover:shadow-primary/40 transition-shadow duration-300">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-lg font-bold gradient-text">Ceyora</span>
                  <p className="text-[10px] text-muted-foreground -mt-0.5">{t("app.description")}</p>
                </div>
              </Link>
              <button
                onClick={toggleDesktopCollapsed}
                className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all duration-200"
                title="Collapse sidebar"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            </>
          )}
        </div>

        <SidebarNav collapsed={desktopCollapsed} />

        {!desktopCollapsed && <UserSection />}
      </aside>

      {/* ===== MOBILE SIDEBAR OVERLAY ===== */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden"
              onClick={closeMobileSidebar}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 350, damping: 35 }}
              className="fixed inset-y-0 left-0 z-50 w-[280px] flex flex-col glass border-r lg:hidden"
            >
              <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

              {/* Mobile header */}
              <div className="flex h-16 items-center justify-between px-5 border-b border-border/50 relative z-10">
                <Link href="/" className="flex items-center gap-2.5 group" onClick={handleNavClick}>
                  <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-violet-500 text-white font-bold text-sm shadow-lg shadow-primary/25">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-lg font-bold gradient-text">Ceyora</span>
                    <p className="text-[10px] text-muted-foreground -mt-0.5">{t("app.description")}</p>
                  </div>
                </Link>
                <button
                  onClick={closeMobileSidebar}
                  className="rounded-xl p-2 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <SidebarNav collapsed={false} />
              <UserSection />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
