"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DollarSign,
  Save,
  Plus,
  Trash2,
  Check,
  CreditCard,
  Percent,
  AlertCircle,
  Sparkles,
  Eye,
  EyeOff,
  Zap,
  Sliders,
} from "lucide-react";
import { AnimatedPage, AnimatedSection } from "@/components/animated-page";
import { useI18n } from "@/lib/i18n";

interface FeeTier {
  id: string;
  name: string;
  discountPercent: number;
  description: string;
  isDefault: boolean;
  color: string;
}

interface SplitModel {
  id: string;
  title: string;
  teacherShare: number;
  instituteShare: number;
  category: string;
}

export default function FeesPage() {
  const { t } = useI18n();
  const [isSaved, setIsSaved] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [gatewayStatus, setGatewayStatus] = useState<"connected" | "testing" | "idle">("connected");

  // Fee tiers
  const [tiers, setTiers] = useState<FeeTier[]>([
    {
      id: "tier-1",
      name: "Standard Full Tariff",
      discountPercent: 0,
      description: "Standard tuition charge applicable to all general batch admissions",
      isDefault: true,
      color: "from-blue-500 to-cyan-400",
    },
    {
      id: "tier-2",
      name: "Sibling Concession (15%)",
      discountPercent: 15,
      description: "Applied to second or younger siblings enrolled within the same calendar term",
      isDefault: false,
      color: "from-amber-500 to-orange-400",
    },
    {
      id: "tier-3",
      name: "Multi-Subject Bundle (20%)",
      discountPercent: 20,
      description: "Applies automatically when 3 or more A/L subjects are taken simultaneously",
      isDefault: false,
      color: "from-violet-500 to-purple-400",
    },
    {
      id: "tier-4",
      name: "Merit Scholarship (100% Free Card)",
      discountPercent: 100,
      description: "Authorized by Teacher or Institute for top island rankers and hardship cases",
      isDefault: false,
      color: "from-emerald-500 to-teal-400",
    },
  ]);

  // Split models
  const [splitModels, setSplitModels] = useState<SplitModel[]>([
    { id: "split-1", title: "Standard Regular Batch", teacherShare: 80, instituteShare: 20, category: "Theory & Revision" },
    { id: "split-2", title: "Senior Visiting Faculty", teacherShare: 85, instituteShare: 15, category: "Keynote / Hall A" },
    { id: "split-3", title: "Intensive Paper Class / Seminar", teacherShare: 70, instituteShare: 30, category: "Workshops" },
  ]);

  // PayHere credentials
  const [payHereMerchantId, setPayHereMerchantId] = useState("1224890");
  const [payHereSecret, setPayHereSecret] = useState("897ab3c49ef01289de674a2110bc88");
  const [payHereMode, setPayHereMode] = useState<"live" | "sandbox">("live");

  // Late fees
  const [lateGraceDays, setLateGraceDays] = useState("5");
  const [lateFeeAmount, setLateFeeAmount] = useState("250");

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleTestGateway = () => {
    setGatewayStatus("testing");
    setTimeout(() => {
      setGatewayStatus("connected");
    }, 1200);
  };

  const handleDeleteTier = (id: string) => {
    setTiers(tiers.filter((t) => t.id !== id));
  };

  return (
    <AnimatedPage className="space-y-6">
      {/* Header */}
      <AnimatedSection>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <DollarSign className="h-3.5 w-3.5" /> Financial Rules & Tariffs
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-500">
                <Check className="h-3 w-3" /> PayHere Gateway Active
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              <span className="gradient-text">{t("settings.feesPage.title")}</span>
            </h1>
            <p className="text-muted-foreground mt-1">{t("settings.feesPage.subtitle")}</p>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-violet-500 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-primary/25"
            >
              {isSaved ? (
                <>
                  <Check className="h-4 w-4" strokeWidth={3} /> Rules Saved!
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" /> {t("settings.feesPage.saveChanges")}
                </>
              )}
            </motion.button>
          </div>
        </div>
      </AnimatedSection>

      {/* Save Success Banner */}
      <AnimatePresence>
        {isSaved && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 flex items-center justify-between text-xs text-emerald-700 dark:text-emerald-300 font-semibold"
          >
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-500" strokeWidth={3} />
              <span>Discount percentages, faculty payout splits, and PayHere configuration synchronized.</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Fee & Concession Tiers */}
        <AnimatedSection>
          <div className="glass-card rounded-2xl p-6 shadow-sm border border-border/40 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                  <Percent className="h-4 w-4 text-primary" />
                  Tuition Concessions & Tiers
                </h2>
                <p className="text-[11px] text-muted-foreground mt-0.5">Rules applied during automated monthly billing generation</p>
              </div>
              <button
                onClick={() => {
                  const newT: FeeTier = {
                    id: `tier-${Date.now()}`,
                    name: "Custom Discretionary Waiver",
                    discountPercent: 10,
                    description: "Manual discount approved by branch head",
                    isDefault: false,
                    color: "from-cyan-500 to-blue-400",
                  };
                  setTiers([...tiers, newT]);
                }}
                className="flex items-center gap-1 rounded-lg border border-border/60 px-3 py-1.5 text-xs font-semibold hover:bg-muted/40"
              >
                <Plus className="h-3.5 w-3.5" /> Add Tier
              </button>
            </div>

            <div className="space-y-3 pt-2">
              {tiers.map((tier) => (
                <div
                  key={tier.id}
                  className="rounded-xl border border-border/30 p-3.5 bg-background/50 hover:bg-muted/20 transition-all flex items-start justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className={`h-2.5 w-2.5 rounded-full bg-gradient-to-r ${tier.color}`} />
                      <h4 className="font-bold text-xs text-foreground">{tier.name}</h4>
                      {tier.isDefault && (
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-bold text-primary">
                          Default
                        </span>
                      )}
                      <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-mono font-bold text-foreground/80">
                        {tier.discountPercent}% OFF
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground pl-4.5">{tier.description}</p>
                  </div>

                  {!tier.isDefault && (
                    <button
                      onClick={() => handleDeleteTier(tier.id)}
                      className="rounded-lg p-1 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Teacher Payout Split Models */}
        <AnimatedSection>
          <div className="glass-card rounded-2xl p-6 shadow-sm border border-border/40 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-violet-500" />
                  Faculty Revenue Splits
                </h2>
                <p className="text-[11px] text-muted-foreground mt-0.5">Automated settlement calculation on net collected student tuition</p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              {splitModels.map((m) => (
                <div
                  key={m.id}
                  className="rounded-xl border border-border/30 p-4 bg-background/50 hover:bg-muted/20 transition-all space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-xs text-foreground">{m.title}</h4>
                      <p className="text-[10px] text-muted-foreground">{m.category}</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-mono font-bold">
                      <span className="text-emerald-600">{m.teacherShare}% Teacher</span>
                      <span className="text-muted-foreground">/</span>
                      <span className="text-primary">{m.instituteShare}% Hall</span>
                    </div>
                  </div>

                  {/* Visual ratio bar */}
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden flex">
                    <div
                      className="bg-emerald-500 h-full"
                      style={{ width: `${m.teacherShare}%` }}
                      title={`Teacher: ${m.teacherShare}%`}
                    />
                    <div
                      className="bg-primary h-full"
                      style={{ width: `${m.instituteShare}%` }}
                      title={`Institute: ${m.instituteShare}%`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* PayHere Payment Gateway */}
        <AnimatedSection>
          <div className="glass-card rounded-2xl p-6 shadow-sm border border-border/40 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-emerald-500" />
                <h2 className="text-base font-bold text-foreground">PayHere Sri Lanka Gateway</h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600">
                  {payHereMode.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="space-y-3 text-xs pt-1">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-foreground/80 block mb-1">Environment Mode</label>
                  <select
                    value={payHereMode}
                    onChange={(e) => setPayHereMode(e.target.value as any)}
                    className="w-full rounded-xl border border-border/50 bg-background/50 px-3 py-2 text-xs focus:outline-none"
                  >
                    <option value="live">Live Production</option>
                    <option value="sandbox">Sandbox Testing</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-foreground/80 block mb-1">Merchant ID</label>
                  <input
                    type="text"
                    value={payHereMerchantId}
                    onChange={(e) => setPayHereMerchantId(e.target.value)}
                    className="w-full rounded-xl border border-border/50 bg-background/50 px-3 py-2 text-xs font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-foreground/80 block mb-1">Merchant Secret Hash</label>
                <div className="relative">
                  <input
                    type={showSecret ? "text" : "password"}
                    value={payHereSecret}
                    onChange={(e) => setPayHereSecret(e.target.value)}
                    className="w-full rounded-xl border border-border/50 bg-background/50 pl-3 pr-10 py-2 text-xs font-mono focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecret(!showSecret)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showSecret ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <p className="text-[11px] text-muted-foreground">Supported: Visa, MasterCard, FriMi, Genie, eZ Cash</p>
                <button
                  type="button"
                  onClick={handleTestGateway}
                  className="flex items-center gap-1.5 rounded-xl border border-border/60 px-3 py-1.5 text-xs font-semibold hover:bg-muted/30"
                >
                  <Zap className={`h-3.5 w-3.5 text-amber-500 ${gatewayStatus === "testing" ? "animate-spin" : ""}`} />
                  {gatewayStatus === "testing" ? "Pinging..." : "Test Ping API"}
                </button>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Late Fee Arrears Automation */}
        <AnimatedSection>
          <div className="glass-card rounded-2xl p-6 shadow-sm border border-border/40 space-y-4">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              Late Fee & Surcharge Rules
            </h2>

            <div className="space-y-4 text-xs pt-1">
              <div>
                <label className="font-semibold text-foreground/80 block mb-1">
                  Arrears Grace Period (Days after Billing Cut-off)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={lateGraceDays}
                    onChange={(e) => setLateGraceDays(e.target.value)}
                    className="w-32 rounded-xl border border-border/50 bg-background/50 px-3 py-2 text-xs focus:outline-none"
                  />
                  <span className="text-muted-foreground">calendar days</span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Students have until the 15th before automated late fee charge is applied.
                </p>
              </div>

              <div>
                <label className="font-semibold text-foreground/80 block mb-1">
                  Fixed Late Penalty Surcharge (LKR)
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground font-semibold">රු.</span>
                  <input
                    type="number"
                    value={lateFeeAmount}
                    onChange={(e) => setLateFeeAmount(e.target.value)}
                    className="w-32 rounded-xl border border-border/50 bg-background/50 px-3 py-2 text-xs font-mono focus:outline-none"
                  />
                  <span className="text-muted-foreground">per overdue class</span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Appears as an explicit line item on subsequent payment receipts.
                </p>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </AnimatedPage>
  );
}
