"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Activity,
  Play,
  Square,
  QrCode,
  DollarSign,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";
import { soundEngine } from "@/lib/sound";

export interface LiveEvent {
  id: string;
  type: "attendance" | "payment" | "whatsapp" | "system";
  title: string;
  subtitle: string;
  time: string;
  amount?: string;
}

interface LiveActivityDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LiveActivityDrawer({ isOpen, onClose }: LiveActivityDrawerProps) {
  const [isSimulating, setIsSimulating] = useState(false);
  const [filterType, setFilterType] = useState<string>("all");
  const [events, setEvents] = useState<LiveEvent[]>([
    {
      id: "ev-1",
      type: "attendance",
      title: "Biometric QR Check-in",
      subtitle: "Kavindu Perera (STU-0421) entered Auditorium A",
      time: "Just now",
    },
    {
      id: "ev-2",
      type: "payment",
      title: "PayHere Online Settlement",
      subtitle: "Minoli Senanayake settled Combined Maths",
      time: "1m ago",
      amount: "LKR 3,825.00",
    },
    {
      id: "ev-3",
      type: "whatsapp",
      title: "Automated Arrears Dispatch",
      subtitle: "Meta WhatsApp Cloud API delivered reminder to +94 77 123 4567",
      time: "3m ago",
    },
    {
      id: "ev-4",
      type: "attendance",
      title: "Biometric QR Check-in",
      subtitle: "Dinuka Rajapaksha (STU-0512) entered Science Wing Hall B",
      time: "5m ago",
    },
    {
      id: "ev-5",
      type: "payment",
      title: "Counter Cashier Voucher",
      subtitle: "Sachini Dissanayake issued physical receipt REC-8903",
      time: "8m ago",
      amount: "LKR 4,500.00",
    },
  ]);

  useEffect(() => {
    if (!isSimulating) return;

    const sampleFeed: Array<Omit<LiveEvent, "id" | "time">> = [
      {
        type: "attendance",
        title: "Biometric QR Check-in",
        subtitle: "Tharushi Fernando (STU-0294) checked into O/L Math Hall",
      },
      {
        type: "payment",
        title: "PayHere Online Settlement",
        subtitle: "Ashen Wickramasinghe paid A/L Physics tuition",
        amount: "LKR 2,500.00",
      },
      {
        type: "attendance",
        title: "Biometric QR Check-in",
        subtitle: "Dineth Wickramasinghe verified at Turnstile #2",
      },
      {
        type: "whatsapp",
        title: "Meta Cloud Dispatch",
        subtitle: "Gate check-in alert sent to parent WhatsApp (+94 71 987 6543)",
      },
    ];

    const timer = setInterval(() => {
      const randomItem = sampleFeed[Math.floor(Math.random() * sampleFeed.length)];
      const newEvent: LiveEvent = {
        id: `ev-${Date.now()}`,
        time: "Just now",
        ...randomItem,
      };

      if (randomItem.type === "attendance") soundEngine.playQrScan();
      else if (randomItem.type === "payment") soundEngine.playCashRegister();

      setEvents((prev) => [newEvent, ...prev.slice(0, 19)]);
    }, 3800);

    return () => clearInterval(timer);
  }, [isSimulating]);

  const filteredEvents = events.filter(
    (ev) => filterType === "all" || ev.type === filterType
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />

          {/* Drawer Body */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 350, damping: 35 }}
            className="fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] bg-background/95 backdrop-blur-2xl border-l border-border/50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border/40">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center text-white shadow-lg shadow-primary/25">
                  <Activity className="h-4 w-4 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-foreground">Live Telemetry Stream</h3>
                  <p className="text-[10px] text-muted-foreground">Real-Time Biometric & Financial Feed</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsSimulating(!isSimulating)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isSimulating
                      ? "bg-red-500/15 text-red-600 dark:text-red-400 hover:bg-red-500/25"
                      : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/25"
                  }`}
                >
                  {isSimulating ? (
                    <>
                      <Square className="h-3 w-3 fill-current" /> Stop Sim
                    </>
                  ) : (
                    <>
                      <Play className="h-3 w-3 fill-current" /> Auto-Sim
                    </>
                  )}
                </button>
                <button
                  onClick={onClose}
                  className="rounded-xl p-1.5 text-muted-foreground hover:bg-muted/50"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Filter Chips */}
            <div className="px-5 py-3 border-b border-border/30 flex items-center gap-2 overflow-x-auto">
              {[
                { key: "all", label: "All Events" },
                { key: "attendance", label: "Gate QR" },
                { key: "payment", label: "Payments" },
                { key: "whatsapp", label: "WhatsApp" },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => setFilterType(item.key)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    filterType === item.key
                      ? "bg-primary text-white shadow-sm"
                      : "bg-muted/40 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Feed List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {filteredEvents.map((ev) => (
                <motion.div
                  key={ev.id}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-border/40 p-3.5 bg-muted/15 hover:bg-muted/30 transition-all space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {ev.type === "attendance" && (
                        <div className="h-6 w-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                          <QrCode className="h-3.5 w-3.5" />
                        </div>
                      )}
                      {ev.type === "payment" && (
                        <div className="h-6 w-6 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                          <DollarSign className="h-3.5 w-3.5" />
                        </div>
                      )}
                      {ev.type === "whatsapp" && (
                        <div className="h-6 w-6 rounded-lg bg-green-500/10 text-green-600 flex items-center justify-center">
                          <MessageSquare className="h-3.5 w-3.5" />
                        </div>
                      )}
                      <span className="font-bold text-xs text-foreground">{ev.title}</span>
                    </div>

                    <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-mono">
                      <Clock className="h-2.5 w-2.5" /> {ev.time}
                    </span>
                  </div>

                  <p className="text-[11px] text-muted-foreground leading-relaxed pl-8">
                    {ev.subtitle}
                  </p>

                  {ev.amount && (
                    <div className="pl-8 pt-0.5">
                      <span className="inline-block px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-bold">
                        {ev.amount}
                      </span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Footer Summary */}
            <div className="p-4 border-t border-border/40 bg-muted/20 flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1 text-[11px]">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Web Audio Synthesizer Live
              </span>
              <button
                onClick={() => setEvents([])}
                className="text-[11px] text-primary hover:underline font-semibold"
              >
                Clear Feed
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
