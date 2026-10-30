"use client";

import { useTheme } from "next-themes";
import {
  Moon,
  Sun,
  Bell,
  Search,
  Menu,
  Globe,
  Building2,
  Check,
  ChevronDown,
  LogOut,
  User as UserIcon,
  Shield,
  Sparkles,
  Command,
  X,
  CreditCard,
  GraduationCap,
  Users,
  QrCode,
  ArrowRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUIStore } from "@/stores/ui-store";
import { useAuthStore } from "@/stores/auth-store";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { soundEngine } from "@/lib/sound";
import { useInstituteStore } from "@/stores/institute-store";

const branches = [
  { id: "all", name: "All Branches (Consolidated)", code: "APEX-ALL", students: "2,794 Enrolled" },
  { id: "inst-1", name: "Apex Colombo 07 (Main Campus)", code: "APEX-CMB", students: "1,284 Enrolled" },
  { id: "inst-2", name: "Apex Science Academy - Kandy", code: "APEX-KDY", students: "890 Enrolled" },
  { id: "inst-3", name: "Apex Study Center - Galle", code: "APEX-GLE", students: "620 Enrolled" },
];

export function Topbar() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { openMobileSidebar } = useUIStore();
  const { user, logout } = useAuthStore();
  const { locale, setLocale, t } = useI18n();
  const { selectedInstituteId, setSelectedInstituteId } = useInstituteStore();

  const [searchFocused, setSearchFocused] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [branchOpen, setBranchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const selectedBranch = branches.find((b) => b.id === selectedInstituteId) || branches[0];
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [notifications, setNotifications] = useState([
    {
      id: "n1",
      title: "Fee Reminder Sent",
      desc: "14 WhatsApp reminders dispatched for Combined Maths Grade 12",
      time: "5m ago",
      read: false,
      type: "finance",
    },
    {
      id: "n2",
      title: "Scanner Auto-Sync Complete",
      desc: "182 attendance records uploaded to main server",
      time: "18m ago",
      read: false,
      type: "attendance",
    },
    {
      id: "n3",
      title: "New Student Enrolled",
      desc: "Sachini Dissanayake joined A/L Physics Batch A",
      time: "1h ago",
      read: true,
      type: "student",
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Keyboard shortcut for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setCommandPaletteOpen(false);
        setNotificationsOpen(false);
        setBranchOpen(false);
        setUserMenuOpen(false);
        setLangOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  };

  const handleLogout = () => {
    logout();
    toast.success("Signed out successfully");
    router.push("/login");
  };

  const commandItems = [
    { title: "Dashboard Overview", href: "/", icon: Sparkles, section: "Navigation" },
    { title: "Students Registry", href: "/students", icon: Users, section: "Navigation" },
    { title: "QR Attendance Scanner", href: "/attendance/scan", icon: QrCode, section: "Quick Action" },
    { title: "Classes & Schedules", href: "/classes", icon: GraduationCap, section: "Navigation" },
    { title: "Finance & Fee Billing", href: "/finance", icon: CreditCard, section: "Navigation" },
    { title: "Teachers & Payouts", href: "/teachers", icon: Users, section: "Navigation" },
  ];

  const filteredCommands = commandItems.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <header className="glass sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/50 px-4 sm:px-6">
        {/* Left: Hamburger (mobile) + Branch Selector + Search trigger */}
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={openMobileSidebar}
            className="rounded-xl p-2 hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors lg:hidden shrink-0"
          >
            <Menu className="h-5 w-5" />
          </motion.button>

          {/* Branch Selector Dropdown */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setBranchOpen(!branchOpen)}
              className="flex items-center gap-2 rounded-xl border border-border/50 bg-muted/30 px-3 py-1.5 text-xs font-semibold hover:bg-muted/60 transition-colors"
            >
              <Building2 className="h-3.5 w-3.5 text-primary" />
              <span className="max-w-[150px] truncate">{selectedBranch.name}</span>
              <ChevronDown className="h-3 w-3 text-muted-foreground opacity-70" />
            </button>

            <AnimatePresence>
              {branchOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setBranchOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 top-full mt-2 z-50 w-72 rounded-2xl border border-border/60 glass-card shadow-2xl overflow-hidden p-1.5"
                  >
                    <div className="px-3 py-2 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                      Switch Institute Branch
                    </div>
                    {branches.map((b) => (
                      <button
                        key={b.id}
                        onClick={() => {
                          setSelectedInstituteId(b.id);
                          setBranchOpen(false);
                          try { soundEngine.playClick(); } catch {}
                          toast.success(`Active Institute Scope: ${b.name}`);
                        }}
                        className={cn(
                          "w-full flex items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition-colors hover:bg-muted/60",
                          selectedBranch.id === b.id && "bg-primary/10 text-primary font-bold"
                        )}
                      >
                        <div>
                          <p className="font-semibold">{b.name}</p>
                          <p className="text-[10px] text-muted-foreground">{b.students}</p>
                        </div>
                        {selectedBranch.id === b.id && <Check className="h-4 w-4 text-primary" />}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Search Bar / Cmd+K Trigger */}
          <div className="relative max-w-md flex-1 min-w-0">
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="w-full flex items-center justify-between rounded-xl border border-border/50 bg-muted/20 hover:bg-muted/40 px-3.5 py-2 text-sm text-muted-foreground transition-all duration-200"
            >
              <div className="flex items-center gap-2.5">
                <Search className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs sm:text-sm truncate">Search students, classes, records...</span>
              </div>
              <div className="hidden sm:flex items-center gap-1 text-[10px] text-muted-foreground/60 font-mono">
                <kbd className="rounded border bg-muted/60 px-1.5 py-0.5">⌘</kbd>
                <kbd className="rounded border bg-muted/60 px-1.5 py-0.5">K</kbd>
              </div>
            </button>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1 sm:gap-2 ml-3 shrink-0">
          {/* Language Switcher */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setLangOpen(!langOpen)}
              className="relative rounded-xl p-2 hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors"
              title="Change Language"
            >
              <Globe className="h-[18px] w-[18px]" />
              <span className="absolute -bottom-0.5 -right-0.5 text-[8px] font-bold bg-primary text-primary-foreground rounded px-1 leading-tight">
                {locale.toUpperCase()}
              </span>
            </motion.button>
            <AnimatePresence>
              {langOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 z-50 w-44 rounded-xl border border-border/60 glass-card shadow-xl overflow-hidden p-1"
                  >
                    <button
                      onClick={() => {
                        setLocale("en");
                        setLangOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors hover:bg-muted/50",
                        locale === "en" && "bg-primary/10 text-primary"
                      )}
                    >
                      <span>🇬🇧</span>
                      <span>English</span>
                      {locale === "en" && <Check className="ml-auto h-3.5 w-3.5 text-primary" />}
                    </button>
                    <button
                      onClick={() => {
                        setLocale("si");
                        setLangOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors hover:bg-muted/50",
                        locale === "si" && "bg-primary/10 text-primary"
                      )}
                    >
                      <span>🇱🇰</span>
                      <span>සිංහල</span>
                      {locale === "si" && <Check className="ml-auto h-3.5 w-3.5 text-primary" />}
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Theme Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              try { soundEngine.playClick(); } catch {}
              setTheme(theme === "dark" ? "light" : "dark");
            }}
            className="rounded-xl p-2 hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors"
          >
            <AnimatePresence mode="wait" initial={false}>
              {theme === "dark" ? (
                <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <Sun className="h-[18px] w-[18px]" />
                </motion.div>
              ) : (
                <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <Moon className="h-[18px] w-[18px]" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Notifications Popover */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative rounded-xl p-2 hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Bell className="h-[18px] w-[18px]" />
              {unreadCount > 0 && (
                <span className="absolute right-1.5 top-1.5 flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
                </span>
              )}
            </motion.button>

            <AnimatePresence>
              {notificationsOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setNotificationsOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 z-50 w-80 sm:w-96 rounded-2xl border border-border/60 glass-card shadow-2xl overflow-hidden"
                  >
                    <div className="flex items-center justify-between border-b border-border/50 px-4 py-3">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold">Notifications</h4>
                        {unreadCount > 0 && (
                          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllNotificationsAsRead}
                          className="text-[11px] font-semibold text-primary hover:underline"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div className="max-h-80 overflow-y-auto divide-y divide-border/40">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          className={cn(
                            "p-3.5 hover:bg-muted/40 transition-colors flex items-start gap-3",
                            !n.read && "bg-primary/5"
                          )}
                        >
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary mt-0.5">
                            {n.type === "finance" ? <CreditCard className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-xs font-bold text-foreground truncate">{n.title}</p>
                              <span className="text-[10px] text-muted-foreground shrink-0">{n.time}</span>
                            </div>
                            <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">
                              {n.desc}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* User Profile Dropdown */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 rounded-xl py-1 pl-1.5 pr-2 hover:bg-muted/60 transition-colors"
            >
              <div className="relative">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-violet-500 text-white text-[11px] font-bold shadow-sm">
                  {user?.first_name ? user.first_name[0] : "SA"}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-background" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold leading-none">{user?.first_name || "Super"} {user?.last_name || "Admin"}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{user?.role || "super_admin"}</p>
              </div>
            </motion.button>

            <AnimatePresence>
              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 z-50 w-56 rounded-2xl border border-border/60 glass-card shadow-2xl overflow-hidden p-1.5"
                  >
                    <div className="px-3 py-2.5 border-b border-border/40 mb-1">
                      <p className="text-xs font-bold text-foreground">{user?.email || "admin@ceyora.lk"}</p>
                      <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-semibold text-emerald-500 bg-emerald-500/10 rounded-full px-2 py-0.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Active Session
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        router.push("/settings");
                      }}
                      className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-foreground hover:bg-muted/50 transition-colors"
                    >
                      <UserIcon className="h-4 w-4 text-muted-foreground" />
                      <span>Account Settings</span>
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-red-500 hover:bg-red-500/10 transition-colors mt-1"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Global Command Palette / Spotlight Search Modal */}
      <AnimatePresence>
        {commandPaletteOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCommandPaletteOpen(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="relative z-50 w-full max-w-lg rounded-3xl border border-border/80 glass-card shadow-2xl overflow-hidden p-2"
            >
              <div className="flex items-center gap-3 border-b border-border/50 px-3.5 py-3">
                <Search className="h-5 w-5 text-primary" />
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Jump to page or command..."
                  className="w-full bg-transparent text-sm font-medium focus:outline-none placeholder:text-muted-foreground"
                />
                <button
                  onClick={() => setCommandPaletteOpen(false)}
                  className="rounded-lg p-1 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="max-h-72 overflow-y-auto p-2 space-y-1">
                {filteredCommands.length === 0 ? (
                  <p className="p-4 text-center text-xs text-muted-foreground">No matches found</p>
                ) : (
                  filteredCommands.map((cmd) => {
                    const Icon = cmd.icon;
                    return (
                      <button
                        key={cmd.title}
                        onClick={() => {
                          setCommandPaletteOpen(false);
                          router.push(cmd.href);
                        }}
                        className="w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs font-semibold text-foreground hover:bg-primary/10 hover:text-primary transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-muted/60 group-hover:bg-primary/20 text-muted-foreground group-hover:text-primary transition-colors">
                            <Icon className="h-4 w-4" />
                          </div>
                          <span>{cmd.title}</span>
                        </div>
                        <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    );
                  })
                )}
              </div>

              <div className="border-t border-border/40 px-3 py-2 flex items-center justify-between text-[10px] text-muted-foreground font-mono">
                <span>Navigate with mouse or arrow keys</span>
                <span>ESC to close</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
