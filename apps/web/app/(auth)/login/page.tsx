"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  GraduationCap,
  TrendingUp,
  QrCode,
  Users,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import toast from "react-hot-toast";

const demoAccounts = [
  { role: "Super Admin", email: "admin@ceyora.lk", pass: "admin123", icon: ShieldCheck, badge: "Full Access" },
  { role: "Branch Manager", email: "manager@ceyora.lk", pass: "manager123", icon: GraduationCap, badge: "Branch Hub" },
  { role: "Accountant", email: "finance@ceyora.lk", pass: "finance123", icon: TrendingUp, badge: "Billing & Fees" },
];

export default function LoginPage() {
  const router = useRouter();
  const { setUser, setToken } = useAuthStore();
  const [email, setEmail] = useState("admin@ceyora.lk");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDemo, setSelectedDemo] = useState(0);

  const handleSelectDemo = (index: number) => {
    setSelectedDemo(index);
    setEmail(demoAccounts[index].email);
    setPassword(demoAccounts[index].pass);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    setIsLoading(true);
    // Simulate brief network authentication
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Store user session
    const selectedAccount = demoAccounts[selectedDemo] || demoAccounts[0];
    const userRole = selectedAccount.role === "Super Admin" ? "super_admin" : "institute_admin";
    setUser({
      id: "usr-" + Math.random().toString(36).substring(7),
      email,
      role: userRole as any,
      first_name: selectedAccount.role.split(" ")[0],
      last_name: selectedAccount.role.split(" ")[1] || "Admin",
    });
    setToken("jwt_mock_token_" + Date.now());

    toast.success(`Welcome back, ${selectedAccount.role}!`, {
      icon: "✨",
      style: {
        borderRadius: "1rem",
        background: "hsl(var(--card))",
        color: "hsl(var(--foreground))",
        border: "1px solid hsl(var(--border))",
      },
    });

    setIsLoading(false);
    router.push("/");
  };

  return (
    <div className="grid gap-8 lg:grid-cols-12 items-center">
      {/* Left Column: Brand Hero & Intelligence Showcase */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="hidden lg:flex flex-col justify-between space-y-8 lg:col-span-7 pr-6"
      >
        <div className="space-y-6">
          {/* Logo badge */}
          <div className="inline-flex items-center gap-2.5 rounded-2xl border border-primary/20 bg-primary/10 px-4 py-2 backdrop-blur-md">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-violet-500 text-white shadow-md shadow-primary/30">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="text-sm font-bold tracking-wide text-foreground">
              CEYORA <span className="text-primary font-normal">INTELLIGENCE</span>
            </span>
            <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-semibold text-primary">
              v2.4
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-[1.15]">
            Tuition Management <br />
            <span className="gradient-text">Engineered for Scale.</span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl">
            Empowering tuition masters and multi-branch educational institutes across Sri Lanka with real-time biometric QR attendance, automated fee recovery, and predictive student BI.
          </p>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="glass-card rounded-2xl p-4 border border-border/50 hover:border-primary/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                  <QrCode className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold">Sub-second QR Scan</h4>
                  <p className="text-xs text-muted-foreground">Offline-first local sync</p>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-4 border border-border/50 hover:border-primary/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold">98.4% Fee Recovery</h4>
                  <p className="text-xs text-muted-foreground">Automated parent notifications</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Metrics Floating Card */}
        <div className="glass-card rounded-3xl p-5 border border-border/60 shadow-xl bg-card/60 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 h-32 w-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white font-bold shadow-lg shadow-emerald-500/25">
                  <Users className="h-5 w-5" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-background animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold">Institute Active Pulse</h4>
                  <span className="text-[10px] font-semibold bg-emerald-500/15 text-emerald-500 rounded px-1.5 py-0.5">
                    LIVE
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">Apex Academy Colombo & Kandy Campuses</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-muted-foreground">Today's Check-ins</p>
              <p className="text-lg font-black text-foreground">3,842 <span className="text-xs text-emerald-500 font-bold">+18%</span></p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Right Column: Glassmorphism Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
        className="lg:col-span-5"
      >
        <div className="glass-card rounded-3xl p-7 sm:p-9 shadow-2xl border border-border/60 bg-card/85 backdrop-blur-2xl relative overflow-hidden">
          {/* Subtle top gradient accent */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-violet-500 to-cyan-400" />

          <div className="mb-6">
            <h2 className="text-2xl font-black tracking-tight text-foreground">
              Sign In to Ceyora
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Select a quick demo role or enter your credentials.
            </p>
          </div>

          {/* Quick Demo Role Selector Pills */}
          <div className="mb-6 space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Quick Switch Role
            </p>
            <div className="grid grid-cols-3 gap-2">
              {demoAccounts.map((acc, idx) => {
                const Icon = acc.icon;
                const isSelected = selectedDemo === idx;
                return (
                  <button
                    key={acc.role}
                    type="button"
                    onClick={() => handleSelectDemo(idx)}
                    className={`flex flex-col items-center justify-center rounded-xl p-2.5 text-center transition-all border ${
                      isSelected
                        ? "border-primary bg-primary/10 shadow-sm shadow-primary/20 text-primary"
                        : "border-border/60 bg-muted/30 hover:bg-muted/60 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4 mb-1" />
                    <span className="text-xs font-bold leading-tight line-clamp-1">{acc.role}</span>
                    <span className="text-[9px] opacity-75 font-medium mt-0.5">{acc.badge}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                Work Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@ceyora.lk"
                  className="w-full rounded-xl border border-border/60 bg-muted/20 pl-10 pr-4 py-3 text-sm font-medium focus:outline-none focus:border-primary focus:bg-background transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Password
                </label>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    toast("Password reset instructions sent to your registered email.", { icon: "📧" });
                  }}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Forgot?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-border/60 bg-muted/20 pl-10 pr-10 py-3 text-sm font-medium focus:outline-none focus:border-primary focus:bg-background transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Remember device toggle */}
            <div className="flex items-center gap-2 pt-1">
              <input
                id="remember"
                type="checkbox"
                defaultChecked
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary accent-primary"
              />
              <label htmlFor="remember" className="text-xs font-medium text-muted-foreground cursor-pointer select-none">
                Remember this workstation for 30 days
              </label>
            </div>

            {/* Sign in button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary via-violet-600 to-indigo-600 py-3.5 px-6 text-sm font-bold text-white shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </div>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </motion.button>
          </form>

          {/* Security badge footer */}
          <div className="mt-6 pt-5 border-t border-border/50 flex items-center justify-between text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              256-Bit SSL Encrypted
            </span>
            <span className="font-semibold text-primary">Sri Lanka BI Ready</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
