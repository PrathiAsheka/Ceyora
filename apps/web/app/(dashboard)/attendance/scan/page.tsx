"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  QrCode,
  Calendar,
  Users,
  TrendingUp,
  AlertTriangle,
  Wifi,
  WifiOff,
  Clock,
  Camera,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Search,
  Sparkles,
  Volume2,
  UserCheck,
  Send,
} from "lucide-react";
import { AnimatedPage, AnimatedSection } from "@/components/animated-page";
import { useOfflineQueue } from "@/hooks/use-offline-queue";
import { useI18n } from "@/lib/i18n";
import toast from "react-hot-toast";

interface ScanRecord {
  id: string;
  studentId: string;
  name: string;
  className: string;
  time: string;
  status: "verified" | "fee_due" | "already_marked";
  feeDueAmount?: number;
}

const initialRecentScans: ScanRecord[] = [
  {
    id: "sc-1",
    studentId: "STU-0421",
    name: "Kavindu Perera",
    className: "A/L Combined Mathematics (Hall A)",
    time: "10:14 AM",
    status: "fee_due",
    feeDueAmount: 4500,
  },
  {
    id: "sc-2",
    studentId: "STU-0512",
    name: "Dinuka Rajapaksha",
    className: "A/L Combined Mathematics (Hall A)",
    time: "10:12 AM",
    status: "verified",
  },
  {
    id: "sc-3",
    studentId: "STU-0601",
    name: "Ashen Wickramasinghe",
    className: "A/L Physics (Hall B)",
    time: "10:08 AM",
    status: "verified",
  },
];

const mockStudentsPool = [
  { studentId: "STU-0389", name: "Minoli Senanayake", className: "A/L Chemistry (Hall B)", status: "verified" as const },
  { studentId: "STU-0294", name: "Tharushi Fernando", className: "O/L Mathematics (Hall C)", status: "fee_due" as const, feeDueAmount: 3200 },
  { studentId: "STU-0782", name: "Sahan Jayawardena", className: "A/L Physics (Hall A)", status: "verified" as const },
  { studentId: "STU-0914", name: "Anuki Silva", className: "A/L Biology (Hall B)", status: "verified" as const },
];

export default function QRScannerPage() {
  const { isOnline, pendingCount } = useOfflineQueue();
  const { t } = useI18n();

  const [isScanning, setIsScanning] = useState(true);
  const [recentScans, setRecentScans] = useState<ScanRecord[]>(initialRecentScans);
  const [manualId, setManualId] = useState("");
  const [lastScannedResult, setLastScannedResult] = useState<ScanRecord | null>(initialRecentScans[0]);
  const [selectedClass, setSelectedClass] = useState("A/L Combined Mathematics (Hall A)");
  const [soundEnabled, setSoundEnabled] = useState(true);

  const triggerBeep = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.12);
    } catch (e) {
      // AudioContext unavailable or restricted
    }
  };

  const handleSimulateScan = () => {
    triggerBeep();
    const candidate = mockStudentsPool[Math.floor(Math.random() * mockStudentsPool.length)];
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

    const newScan: ScanRecord = {
      id: "scan-" + Date.now(),
      studentId: candidate.studentId,
      name: candidate.name,
      className: selectedClass,
      time: timeStr,
      status: candidate.status,
      feeDueAmount: candidate.feeDueAmount,
    };

    setLastScannedResult(newScan);
    setRecentScans([newScan, ...recentScans.slice(0, 7)]);

    if (newScan.status === "fee_due") {
      toast(`Fee Due Alert: LKR ${newScan.feeDueAmount} for ${newScan.name}`, {
        icon: "⚠️",
      });
    } else {
      toast.success(`Check-in verified: ${newScan.name}`, {
        icon: "✅",
      });
    }
  };

  const handleManualCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualId.trim()) return;

    triggerBeep();
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const newScan: ScanRecord = {
      id: "scan-" + Date.now(),
      studentId: manualId.toUpperCase(),
      name: `Student (${manualId.toUpperCase()})`,
      className: selectedClass,
      time: timeStr,
      status: "verified",
    };

    setLastScannedResult(newScan);
    setRecentScans([newScan, ...recentScans.slice(0, 7)]);
    setManualId("");
    toast.success(`Manual check-in recorded for ${newScan.studentId}`);
  };

  return (
    <AnimatedPage className="space-y-6">
      {/* Header */}
      <AnimatedSection>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-[11px] font-bold text-emerald-500 uppercase tracking-widest">
                Sub-Second Gate Scanner
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
              QR Biometric <span className="gradient-text">Attendance Gate</span>
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Scan student ID badges for automatic check-in, SMS parent triggers, and instant fee checks.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isOnline ? (
              <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-500 border border-emerald-500/20">
                <Wifi className="h-3.5 w-3.5" /> Online Cloud Sync
              </span>
            ) : (
              <span className="flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1.5 text-xs font-bold text-amber-500 border border-amber-500/20">
                <WifiOff className="h-3.5 w-3.5" /> Offline Buffer ({pendingCount})
              </span>
            )}

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? "Mute audio beeps" : "Unmute audio beeps"}
              className={`rounded-2xl p-2.5 border transition-colors ${
                soundEnabled
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-border/60 bg-muted/30 text-muted-foreground"
              }`}
            >
              <Volume2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </AnimatedSection>

      {/* Main Scanner Grid */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column: Live Viewfinder */}
        <AnimatedSection className="lg:col-span-7">
          <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-sm border border-border/60 space-y-5">
            {/* Class session selector */}
            <div className="flex items-center justify-between gap-3">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Current Class Hall
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="rounded-xl border border-border/60 bg-muted/30 px-3 py-1.5 text-xs font-semibold text-foreground focus:outline-none focus:border-primary"
              >
                <option value="A/L Combined Mathematics (Hall A)">A/L Combined Mathematics (Hall A)</option>
                <option value="A/L Physics (Hall B)">A/L Physics Revision (Hall B)</option>
                <option value="A/L Chemistry (Hall C)">A/L Chemistry (Hall C)</option>
                <option value="O/L Mathematics (Hall D)">O/L Mathematics (Hall D)</option>
              </select>
            </div>

            {/* Viewfinder simulation box */}
            <div className="relative aspect-[4/3] w-full rounded-3xl border-2 border-border/60 bg-black/90 overflow-hidden flex flex-col items-center justify-center shadow-2xl">
              {/* Corner brackets */}
              <div className="absolute top-4 left-4 h-8 w-8 border-t-2 border-l-2 border-primary rounded-tl-xl" />
              <div className="absolute top-4 right-4 h-8 w-8 border-t-2 border-r-2 border-primary rounded-tr-xl" />
              <div className="absolute bottom-4 left-4 h-8 w-8 border-b-2 border-l-2 border-primary rounded-bl-xl" />
              <div className="absolute bottom-4 right-4 h-8 w-8 border-b-2 border-r-2 border-primary rounded-br-xl" />

              {/* Scanning laser line animation */}
              <div className="absolute inset-x-8 top-1/4 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-bounce" style={{ animationDuration: "2.4s" }} />

              {/* Central target badge */}
              <div className="relative z-10 flex flex-col items-center justify-center p-6 text-center">
                <div className="h-24 w-24 rounded-3xl border-2 border-dashed border-primary/50 flex items-center justify-center bg-primary/10 backdrop-blur-sm shadow-xl shadow-primary/20">
                  <QrCode className="h-12 w-12 text-primary" />
                </div>
                <p className="mt-4 text-xs font-bold text-white uppercase tracking-wider">
                  Align Student QR Badge Inside Frame
                </p>
                <p className="text-[11px] text-gray-400 mt-1">
                  Works offline with zero latency biometric recognition
                </p>
              </div>

              {/* Bottom camera controls overlay */}
              <div className="absolute bottom-3 inset-x-4 flex items-center justify-between text-[11px] text-gray-400">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  Scanner Active (60 FPS)
                </span>
                <span className="font-mono">CAM-01: Front Gate</span>
              </div>
            </div>

            {/* Simulation & Trigger Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSimulateScan}
                className="w-full sm:flex-1 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-violet-600 py-3 px-5 text-xs font-bold text-white shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-shadow"
              >
                <QrCode className="h-4 w-4" />
                Trigger Test Student Scan
              </motion.button>

              {/* Manual Entry Form */}
              <form onSubmit={handleManualCheckIn} className="w-full sm:flex-1 flex gap-2">
                <input
                  type="text"
                  value={manualId}
                  onChange={(e) => setManualId(e.target.value)}
                  placeholder="Enter Student ID (STU-...)"
                  className="w-full rounded-2xl border border-border/60 bg-muted/30 px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-primary"
                />
                <button
                  type="submit"
                  className="rounded-2xl border border-border/60 bg-muted/40 hover:bg-muted/70 px-4 text-xs font-bold transition-colors shrink-0"
                >
                  Enter
                </button>
              </form>
            </div>
          </div>
        </AnimatedSection>

        {/* Right Column: Instant Verification Card & Scan Feed */}
        <AnimatedSection className="lg:col-span-5 space-y-6">
          {/* Last Scanned Result Display */}
          <div className="glass-card rounded-3xl p-6 shadow-sm border border-border/60">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">
              Latest Scanned Verification
            </h3>

            {lastScannedResult ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary to-violet-500 text-white font-black text-base shadow-md">
                    {lastScannedResult.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <h4 className="text-base font-black text-foreground">{lastScannedResult.name}</h4>
                    <p className="text-xs font-mono font-bold text-primary">{lastScannedResult.studentId}</p>
                    <p className="text-[11px] text-muted-foreground">{lastScannedResult.className}</p>
                  </div>
                </div>

                {/* Status Result Pill */}
                {lastScannedResult.status === "verified" ? (
                  <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Admission Approved • Fees Cleared</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground">{lastScannedResult.time}</span>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-red-500 font-bold text-xs">
                      <AlertCircle className="h-4 w-4" />
                      <span>Fee Arrears: LKR {lastScannedResult.feeDueAmount?.toLocaleString()}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground">{lastScannedResult.time}</span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground text-center py-6">Ready to scan student badges</p>
            )}
          </div>

          {/* Real-time Scans Stream */}
          <div className="glass-card rounded-3xl p-6 shadow-sm border border-border/60">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Live Gate Stream
              </h3>
              <span className="text-[10px] font-bold text-primary bg-primary/10 rounded-full px-2 py-0.5">
                {recentScans.length} Check-ins
              </span>
            </div>

            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
              {recentScans.map((scan) => (
                <div
                  key={scan.id}
                  className="flex items-center justify-between rounded-2xl border border-border/50 bg-muted/20 p-3 hover:bg-muted/40 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <div className={`h-2 w-2 rounded-full shrink-0 ${scan.status === "verified" ? "bg-emerald-500" : "bg-red-500"}`} />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-foreground truncate">{scan.name}</p>
                      <p className="text-[10px] text-muted-foreground font-mono">{scan.studentId} • {scan.time}</p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                    scan.status === "verified" ? "bg-emerald-500/15 text-emerald-500" : "bg-red-500/15 text-red-500"
                  }`}>
                    {scan.status === "verified" ? "VERIFIED" : "FEE DUE"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </AnimatedPage>
  );
}
