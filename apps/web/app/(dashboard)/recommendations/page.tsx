"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lightbulb,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Filter,
  DollarSign,
  Users,
  GraduationCap,
  Sparkles,
  Zap,
} from "lucide-react";
import { AnimatedPage, AnimatedSection } from "@/components/animated-page";
import { mockRecommendations, RecommendationData } from "@/lib/mock-data";
import toast from "react-hot-toast";

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<RecommendationData[]>(mockRecommendations);
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filteredRecs = recommendations.filter(
    (r) => categoryFilter === "all" || r.category === categoryFilter
  );

  const handleExecuteAction = (rec: RecommendationData) => {
    setRecommendations((prev) =>
      prev.map((r) => (r.id === rec.id ? { ...r, followUpStatus: "resolved" } : r))
    );
    toast.success(`Action executed for "${rec.title}"! Automated workflow triggered.`, {
      icon: "⚡",
    });
  };

  return (
    <AnimatedPage className="space-y-6">
      {/* Header */}
      <AnimatedSection>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-ping" />
              <span className="text-[11px] font-bold text-amber-500 uppercase tracking-widest">
                Automated Decision Support Chain
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
              Actionable <span className="gradient-text">Recommendations</span>
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Deterministic evidence-backed actions: identifying what changed, why it matters, and who is affected.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: "all", label: "All Insights" },
              { id: "finance", label: "Financial Arrears" },
              { id: "attendance", label: "Attendance Deficits" },
              { id: "academic", label: "Academic Remediation" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`rounded-2xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                  categoryFilter === cat.id
                    ? "bg-primary text-white shadow-md shadow-primary/25"
                    : "bg-muted/40 text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Structured Recommendations Feed */}
      <div className="space-y-4">
        {filteredRecs.map((rec) => (
          <AnimatedSection key={rec.id}>
            <div className="glass-card rounded-3xl p-6 border border-border/60 hover:border-primary/40 transition-all shadow-sm hover:shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/40 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-2xl ${
                    rec.priority === "urgent" ? "bg-red-500/10 text-red-500" : "bg-amber-500/10 text-amber-500"
                  }`}>
                    {rec.priority === "urgent" ? <AlertTriangle className="h-5 w-5" /> : <Lightbulb className="h-5 w-5" />}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">{rec.title}</h3>
                    <p className="text-[11px] text-muted-foreground capitalize">Category: {rec.category} Intelligence</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${
                    rec.priority === "urgent" ? "bg-red-500/10 text-red-500" : "bg-amber-500/10 text-amber-500"
                  }`}>
                    {rec.priority} Priority
                  </span>
                  <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${
                    rec.followUpStatus === "resolved" ? "bg-emerald-500/10 text-emerald-500" : "bg-muted text-muted-foreground"
                  }`}>
                    {rec.followUpStatus.replace("_", " ")}
                  </span>
                </div>
              </div>

              {/* Structured Recommendation Matrix as defined in Section 8.9 */}
              <div className="grid gap-3 sm:grid-cols-2 text-xs">
                <div className="p-3.5 rounded-2xl border border-border/40 bg-muted/20 space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">1. Detected Issue</span>
                  <p className="font-semibold text-foreground">{rec.issue}</p>
                </div>

                <div className="p-3.5 rounded-2xl border border-border/40 bg-muted/20 space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">2. Deterministic Evidence</span>
                  <p className="font-semibold text-primary">{rec.evidence}</p>
                </div>
              </div>

              {/* Action Box */}
              <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">
                    3. Recommended Autonomous Action
                  </span>
                  <p className="text-xs font-bold text-foreground leading-relaxed">
                    {rec.recommendedAction}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Target: <strong className="text-foreground">{rec.affectedCount} {rec.affectedLabel}</strong>
                  </p>
                </div>

                {rec.followUpStatus !== "resolved" ? (
                  <button
                    onClick={() => handleExecuteAction(rec)}
                    className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-shadow shrink-0 self-start sm:self-auto"
                  >
                    <Zap className="h-3.5 w-3.5" />
                    <span>Execute Action</span>
                  </button>
                ) : (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-xl">
                    <CheckCircle2 className="h-4 w-4" /> Action Resolved
                  </span>
                )}
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </AnimatedPage>
  );
}
