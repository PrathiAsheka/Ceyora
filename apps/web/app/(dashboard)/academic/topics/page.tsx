"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Lightbulb,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  BookOpen,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { AnimatedPage, AnimatedSection } from "@/components/animated-page";
import { mockTopicDiagnostics, TopicDiagnosticData } from "@/lib/mock-data";
import toast from "react-hot-toast";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ModuleSubNav } from "@/components/layout/module-sub-nav";
import { academicNavItems } from "@/lib/sub-nav-items";

export default function TopicsPage() {
  const [topics, setTopics] = useState<TopicDiagnosticData[]>(mockTopicDiagnostics);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTopics = topics.filter(
    (t) =>
      t.topicName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleIssueRemediation = (topic: TopicDiagnosticData) => {
    toast.success(`Generated targeted practice worksheet for ${topic.topicName} dispatched to students!`, {
      icon: "📚",
    });
  };

  return (
    <AnimatedPage className="space-y-6">
      {/* Breadcrumbs & Navigation */}
      <Breadcrumbs items={[{ label: "Academic", href: "/academic" }, { label: "Topic Diagnostics" }]} />

      {/* Header */}
      <AnimatedSection>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="flex h-2 w-2 rounded-full bg-amber-500" />
              <span className="text-[11px] font-bold text-amber-500 uppercase tracking-widest">
                Curriculum Diagnostics & Weak-Point Analysis
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
              Topic <span className="gradient-text">Diagnostics</span>
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Pinpoint student comprehension bottlenecks across specific syllabus modules and dispatch targeted worksheets.
            </p>
          </div>
        </div>

        {/* Academic Sub-Navigation Bar */}
        <div className="pt-2">
          <ModuleSubNav items={academicNavItems} />
        </div>
      </AnimatedSection>

      {/* Topic Cards */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filteredTopics.map((top) => (
          <AnimatedSection key={top.id}>
            <div className="glass-card rounded-3xl p-6 border border-border/60 hover:border-primary/40 transition-all shadow-sm hover:shadow-xl flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-md">
                    {top.subject} • {top.grade}
                  </span>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                    top.status === "critical"
                      ? "bg-red-500/10 text-red-500"
                      : top.status === "warning"
                      ? "bg-amber-500/10 text-amber-500"
                      : "bg-emerald-500/10 text-emerald-500"
                  }`}>
                    {top.status}
                  </span>
                </div>

                <h3 className="text-base font-bold text-foreground mt-2">{top.topicName}</h3>

                {/* Mastery Bar */}
                <div className="mt-4 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Class Mastery Score</span>
                    <span className={`font-black ${
                      top.masteryPercentage < 60 ? "text-red-500" : top.masteryPercentage < 75 ? "text-amber-500" : "text-emerald-500"
                    }`}>
                      {top.masteryPercentage}%
                    </span>
                  </div>
                  <div className="h-2 w-full bg-muted/60 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        top.masteryPercentage < 60 ? "bg-red-500" : top.masteryPercentage < 75 ? "bg-amber-500" : "bg-emerald-500"
                      }`}
                      style={{ width: `${top.masteryPercentage}%` }}
                    />
                  </div>
                </div>

                <div className="mt-4 p-3 rounded-2xl border border-border/40 bg-muted/20 text-xs space-y-1">
                  <p className="font-bold text-foreground">Teacher Actionable Focus:</p>
                  <p className="text-muted-foreground text-[11px] leading-relaxed">{top.recommendation}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-border/40 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-red-500">
                  {top.weakStudentCount} Students Below Pass Threshold
                </span>
                <button
                  onClick={() => handleIssueRemediation(top)}
                  className="rounded-xl bg-primary/10 hover:bg-primary/20 text-primary px-3 py-1.5 text-xs font-bold transition-colors"
                >
                  Issue Drill Paper
                </button>
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </AnimatedPage>
  );
}
