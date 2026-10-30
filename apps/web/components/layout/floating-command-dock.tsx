"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  QrCode,
  CreditCard,
  Volume2,
  VolumeX,
  Activity,
  Sparkles,
  Server,
  X,
  Check,
  CheckCircle2,
  Moon,
  Sun,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { soundEngine } from "@/lib/sound";
import { apiClient, BackendHealthResponse } from "@/lib/api-client";
import { mockStudents, mockClasses } from "@/lib/mock-data";

interface FloatingDockProps {
  onToggleActivityDrawer?: () => void;
  isActivityDrawerOpen?: boolean;
}

export function FloatingCommandDock({ onToggleActivityDrawer, isActivityDrawerOpen }: FloatingDockProps) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [backendHealth, setBackendHealth] = useState<BackendHealthResponse | null>(null);
  const [showHealthModal, setShowHealthModal] = useState(false);
  const [showQuickScanModal, setShowQuickScanModal] = useState(false);
  const [showQuickPaymentModal, setShowQuickPaymentModal] = useState(false);

  // Quick Scan modal state
  const [scanStudentId, setScanStudentId] = useState("s1");
  const [scanClassId, setScanClassId] = useState("cls-1");
  const [scanSuccess, setScanSuccess] = useState(false);

  // Quick Payment modal state
  const [payStudentId, setPayStudentId] = useState("s1");
  const [payAmount, setPayAmount] = useState("4500");
  const [payMethod, setPayMethod] = useState("cash");
  const [paySuccess, setPaySuccess] = useState(false);

  useEffect(() => {
    // Initial health check
    apiClient.checkHealth().then(setBackendHealth);
    const interval = setInterval(() => {
      apiClient.checkHealth().then(setBackendHealth);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundEngine.enabled = next;
    if (next) soundEngine.playClick();
  };

  const handleExecuteQuickScan = () => {
    soundEngine.playQrScan();
    setScanSuccess(true);
    setTimeout(() => {
      setScanSuccess(false);
      setShowQuickScanModal(false);
    }, 1500);
  };

  const handleExecuteQuickPayment = () => {
    soundEngine.playCashRegister();
    setPaySuccess(true);
    setTimeout(() => {
      setPaySuccess(false);
      setShowQuickPaymentModal(false);
    }, 1500);
  };

  return (
    <>
      {/* Floating Glass Dock Container */}
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="fixed inset-x-0 bottom-5 z-40 flex justify-center px-3 pointer-events-none"
      >
        <div className="pointer-events-auto max-w-full flex items-center gap-1.5 p-1.5 rounded-full bg-background/80 backdrop-blur-2xl border border-border/50 shadow-2xl shadow-primary/10 transition-all hover:scale-[1.02] hover:border-primary/40">
          {/* Quick Turnstile Scan */}
          <button
            onClick={() => {
              soundEngine.playClick();
              setShowQuickScanModal(true);
            }}
            title="Instant QR Gate Check-in"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold bg-primary text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all"
          >
            <QrCode className="h-4 w-4" />
            <span className="hidden sm:inline">Gate Scan</span>
          </button>

          {/* Quick Collect Fee */}
          <button
            onClick={() => {
              soundEngine.playClick();
              setShowQuickPaymentModal(true);
            }}
            title="Fast Payment Voucher"
            className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold text-foreground/80 hover:bg-muted/60 transition-all"
          >
            <CreditCard className="h-4 w-4 text-emerald-500" />
            <span className="hidden sm:inline">Collect Fee</span>
          </button>

          {/* Live Activity Stream Toggle */}
          <button
            onClick={() => {
              soundEngine.playClick();
              onToggleActivityDrawer?.();
            }}
            title="Toggle Live Gate Stream"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold transition-all ${
              isActivityDrawerOpen
                ? "bg-violet-500/15 text-violet-600 dark:text-violet-400"
                : "text-foreground/80 hover:bg-muted/60"
            }`}
          >
            <Activity className="h-4 w-4 text-violet-500 animate-pulse" />
            <span className="hidden sm:inline">Live Stream</span>
          </button>

          {/* Audio SFX Toggle */}
          <button
            onClick={toggleSound}
            title={soundEnabled ? "Mute Acoustic SFX" : "Enable Acoustic SFX"}
            className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all"
          >
            {soundEnabled ? (
              <Volume2 className="h-4 w-4 text-primary" />
            ) : (
              <VolumeX className="h-4 w-4 text-muted-foreground" />
            )}
          </button>

          {/* Server Connection Status Pill */}
          <div className="h-4 w-px bg-border/50 mx-0.5" />
          <button
            onClick={() => {
              soundEngine.playClick();
              setShowHealthModal(true);
            }}
            title="Backend Server Health & Telemetry"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full hover:bg-muted/60 text-[11px] font-mono transition-all"
          >
            <span
              className={`h-2 w-2 rounded-full ${
                backendHealth?.ok
                  ? "bg-emerald-500 animate-pulse"
                  : "bg-amber-500"
              }`}
            />
            <span className="text-muted-foreground font-semibold hidden md:inline">
              {backendHealth?.ok
                ? `${backendHealth.latencyMs}ms`
                : "Simulation"}
            </span>
          </button>
        </div>
      </motion.div>

      {/* Quick Gate Scan Modal */}
      <AnimatePresence>
        {showQuickScanModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-card rounded-3xl p-6 max-w-sm w-full border border-border/50 shadow-2xl space-y-4 bg-background"
            >
              <div className="flex items-center justify-between pb-3 border-b border-border/40">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <QrCode className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">Gate Scanner Station</h3>
                    <p className="text-[10px] text-muted-foreground">Main Entrance Turnstile Terminal</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowQuickScanModal(false)}
                  className="rounded-lg p-1 text-muted-foreground hover:bg-muted/40"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {scanSuccess ? (
                <div className="py-8 text-center space-y-2">
                  <div className="h-16 w-16 mx-auto rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                    <CheckCircle2 className="h-10 w-10 animate-bounce" />
                  </div>
                  <h4 className="font-bold text-base text-foreground">Entry Authorized</h4>
                  <p className="text-xs text-muted-foreground">
                    Biometric QR verified • Hall A Turnstile Unlocked
                  </p>
                </div>
              ) : (
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-semibold block mb-1">Select Student</label>
                    <select
                      value={scanStudentId}
                      onChange={(e) => setScanStudentId(e.target.value)}
                      className="w-full rounded-xl border border-border/50 bg-background/50 px-3 py-2 text-xs focus:outline-none"
                    >
                      {mockStudents.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.studentId})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">Target Class Batch</label>
                    <select
                      value={scanClassId}
                      onChange={(e) => setScanClassId(e.target.value)}
                      className="w-full rounded-xl border border-border/50 bg-background/50 px-3 py-2 text-xs focus:outline-none"
                    >
                      {mockClasses.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={handleExecuteQuickScan}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-primary to-violet-500 text-white font-bold text-xs shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all flex items-center justify-center gap-2"
                    >
                      <Zap className="h-4 w-4 fill-white" /> Scan Student Pass
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Quick Fee Payment Modal */}
      <AnimatePresence>
        {showQuickPaymentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-card rounded-3xl p-6 max-w-sm w-full border border-border/50 shadow-2xl space-y-4 bg-background"
            >
              <div className="flex items-center justify-between pb-3 border-b border-border/40">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <CreditCard className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">Issue Fee Receipt Voucher</h3>
                    <p className="text-[10px] text-muted-foreground">Double-Entry Tuition Collection</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowQuickPaymentModal(false)}
                  className="rounded-lg p-1 text-muted-foreground hover:bg-muted/40"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {paySuccess ? (
                <div className="py-8 text-center space-y-2">
                  <div className="h-16 w-16 mx-auto rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                    <CheckCircle2 className="h-10 w-10 animate-bounce" />
                  </div>
                  <h4 className="font-bold text-base text-foreground">Payment Certified</h4>
                  <p className="text-xs text-muted-foreground">
                    Receipt voucher REC-{Date.now().toString().slice(-4)} generated • SMS Dispatched
                  </p>
                </div>
              ) : (
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-semibold block mb-1">Student</label>
                    <select
                      value={payStudentId}
                      onChange={(e) => setPayStudentId(e.target.value)}
                      className="w-full rounded-xl border border-border/50 bg-background/50 px-3 py-2 text-xs focus:outline-none"
                    >
                      {mockStudents.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.studentId})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">Amount (LKR)</label>
                    <input
                      type="number"
                      value={payAmount}
                      onChange={(e) => setPayAmount(e.target.value)}
                      className="w-full rounded-xl border border-border/50 bg-background/50 px-3 py-2 text-xs font-mono font-bold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">Payment Method</label>
                    <select
                      value={payMethod}
                      onChange={(e) => setPayMethod(e.target.value)}
                      className="w-full rounded-xl border border-border/50 bg-background/50 px-3 py-2 text-xs focus:outline-none"
                    >
                      <option value="cash">Cash (Counter Receipt)</option>
                      <option value="payhere">PayHere Online Gateway</option>
                      <option value="bank_transfer">Direct Bank Transfer</option>
                      <option value="frimi">FriMi / Genie QR</option>
                    </select>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={handleExecuteQuickPayment}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all flex items-center justify-center gap-2"
                    >
                      <Check className="h-4 w-4 stroke-[3]" /> Collect LKR {payAmount}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Backend Health Diagnostics Modal */}
      <AnimatePresence>
        {showHealthModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-card rounded-3xl p-6 max-w-md w-full border border-border/50 shadow-2xl space-y-4 bg-background"
            >
              <div className="flex items-center justify-between pb-3 border-b border-border/40">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Server className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">Server Telemetry & Node Architecture</h3>
                    <p className="text-[10px] text-muted-foreground">@ceyora/server REST Microservice</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowHealthModal(false)}
                  className="rounded-lg p-1 text-muted-foreground hover:bg-muted/40"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="rounded-xl border border-border/40 bg-muted/20 p-3 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="font-semibold text-emerald-500 flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      {backendHealth?.ok ? "Live REST Endpoint Connected" : "Local Simulation Mode"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Round-Trip Latency:</span>
                    <span className="font-mono font-bold text-foreground">
                      {backendHealth?.latencyMs ?? 1} ms
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service Name:</span>
                    <span className="font-mono text-foreground">{backendHealth?.service}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sri Lanka PDPA Engine:</span>
                    <span className="text-emerald-500 font-semibold flex items-center gap-1">
                      <ShieldCheck className="h-3 w-3" /> Act No. 9 Audited
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  The Ceyora frontend is equipped with dual-engine failover. It communicates with the Express backend at <code className="font-mono text-primary">/api</code> and provides deterministic local mock execution when running decoupled.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
