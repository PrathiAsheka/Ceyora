"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Plus,
  Search,
  Filter,
  Award,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Eye,
  EyeOff,
  GraduationCap,
  X,
  Calendar,
} from "lucide-react";
import { AnimatedPage, AnimatedSection } from "@/components/animated-page";
import { mockExams, mockClasses, mockStudents, ExamData } from "@/lib/mock-data";
import toast from "react-hot-toast";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ModuleSubNav } from "@/components/layout/module-sub-nav";
import { academicNavItems } from "@/lib/sub-nav-items";
import { useInstituteStore } from "@/stores/institute-store";
import { mockInstitutes } from "@/lib/mock-data";

export default function ExamsPage() {
  const { selectedInstituteId } = useInstituteStore();
  const currentInstitute = mockInstitutes.find((i) => i.id === selectedInstituteId) || mockInstitutes[0];

  const instituteClasses = mockClasses.filter(
    (c) => !selectedInstituteId || c.instituteId === selectedInstituteId
  );
  const instituteClassIds = instituteClasses.map((c) => c.id);

  const [exams, setExams] = useState<ExamData[]>(mockExams);
  const instituteExams = exams.filter((e) => instituteClassIds.includes(e.classId));

  const [selectedExamId, setSelectedExamId] = useState(
    instituteExams[0]?.id || mockExams[0].id
  );
  const [anonymizePdpa, setAnonymizePdpa] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Exam Form State
  const [newTitle, setNewTitle] = useState("");
  const [newClassId, setNewClassId] = useState(instituteClasses[0]?.id || mockClasses[0].id);
  const [newTotalMarks, setNewTotalMarks] = useState(100);
  const [newPassingMarks, setNewPassingMarks] = useState(40);

  const selectedExam =
    instituteExams.find((e) => e.id === selectedExamId) ||
    instituteExams[0] ||
    exams[0];
  const examClass = mockClasses.find((c) => c.id === selectedExam.classId);

  // Derive students belonging to this institute/class
  const classStudents = mockStudents.filter(
    (s) =>
      s.enrolledClassIds.includes(selectedExam.classId) ||
      (selectedInstituteId && s.instituteId === selectedInstituteId)
  );

  const studentResults = classStudents.map((s, idx) => ({
    student: s,
    marks: Math.max(35, Math.min(98, Math.round(s.averageMarks + (idx % 2 === 0 ? 4 : -3)))),
    grade: s.averageMarks >= 75 ? "A" : s.averageMarks >= 65 ? "B" : s.averageMarks >= 50 ? "C" : "S",
    rank: s.recentRank,
    status: s.averageMarks >= 40 ? "pass" : "fail",
  }));

  const filteredResults = studentResults.filter(
    (r) =>
      r.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.student.studentId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) {
      toast.error("Please enter exam title");
      return;
    }

    const newRecord: ExamData = {
      id: "ex-" + Date.now(),
      classId: newClassId,
      name: newTitle,
      date: new Date().toISOString().split("T")[0],
      totalMarks: Number(newTotalMarks),
      passingMarks: Number(newPassingMarks),
      averageScore: 70,
      highestScore: 95,
      lowestScore: 30,
      passPercentage: 85,
      topicsCovered: ["General Assessment"],
    };

    setExams([newRecord, ...exams]);
    setSelectedExamId(newRecord.id);
    setIsAddModalOpen(false);
    setNewTitle("");
    toast.success(`Exam "${newRecord.name}" created and ready for marks entry!`);
  };

  return (
    <AnimatedPage className="space-y-6">
      {/* Breadcrumbs & Navigation */}
      <Breadcrumbs items={[{ label: "Academic", href: "/academic" }, { label: "Exams & Results" }]} />

      {/* Header */}
      <AnimatedSection>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="flex h-2 w-2 rounded-full bg-violet-500" />
              <span className="text-[11px] font-bold text-violet-500 uppercase tracking-widest">
                Academic Evaluations & PDPA Privacy Rankings
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
              Exams & <span className="gradient-text">Results</span>
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Manage term test scores, grade boundaries, and generate anonymized student ranking lists.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* PDPA Privacy Toggle */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setAnonymizePdpa(!anonymizePdpa);
                toast(anonymizePdpa ? "Showing Student Names" : "Anonymized via Student ID (PDPA Public Mode)", {
                  icon: "🔒",
                });
              }}
              className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold border transition-colors ${
                anonymizePdpa
                  ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-500"
                  : "border-border/60 bg-muted/30 text-muted-foreground hover:text-foreground"
              }`}
            >
              {anonymizePdpa ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              <span>{anonymizePdpa ? "PDPA Anonymized" : "Public Anonymization"}</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-violet-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow"
            >
              <Plus className="h-4 w-4" />
              Schedule Exam
            </motion.button>
          </div>
        </div>

        {/* Academic Sub-Navigation Bar */}
        <div className="pt-2">
          <ModuleSubNav items={academicNavItems} />
        </div>
      </AnimatedSection>

      {/* Select Exam Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {exams.map((ex) => (
          <button
            key={ex.id}
            onClick={() => setSelectedExamId(ex.id)}
            className={`rounded-2xl px-4 py-2 text-xs font-bold whitespace-nowrap transition-all border ${
              selectedExamId === ex.id
                ? "border-primary bg-primary text-white shadow-md shadow-primary/25"
                : "border-border/60 bg-muted/30 text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            {ex.name}
          </button>
        ))}
      </div>

      {/* Selected Exam Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AnimatedSection>
          <div className="glass-card rounded-2xl p-5 border border-border/60">
            <span className="text-xs font-bold text-muted-foreground uppercase">Class Average</span>
            <p className="text-2xl font-black text-foreground mt-1">{selectedExam.averageScore}/100</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">{examClass?.name}</p>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div className="glass-card rounded-2xl p-5 border border-border/60">
            <span className="text-xs font-bold text-muted-foreground uppercase">Pass Rate</span>
            <p className="text-2xl font-black text-emerald-500 mt-1">{selectedExam.passPercentage}%</p>
            <p className="text-[11px] text-emerald-500 font-semibold mt-0.5">Passing Mark: {selectedExam.passingMarks}</p>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div className="glass-card rounded-2xl p-5 border border-border/60">
            <span className="text-xs font-bold text-muted-foreground uppercase">Highest Score</span>
            <p className="text-2xl font-black text-primary mt-1">{selectedExam.highestScore}/100</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Rank #1 Student</p>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div className="glass-card rounded-2xl p-5 border border-border/60">
            <span className="text-xs font-bold text-muted-foreground uppercase">Lowest Score</span>
            <p className="text-2xl font-black text-red-500 mt-1">{selectedExam.lowestScore}/100</p>
            <p className="text-[11px] text-red-500 font-semibold mt-0.5">Requires Remediation</p>
          </div>
        </AnimatedSection>
      </div>

      {/* Results Table */}
      <AnimatedSection>
        <div className="glass-card rounded-3xl shadow-sm border border-border/60 overflow-hidden">
          <div className="flex items-center justify-between gap-3 border-b border-border/50 p-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search student or admission ID..."
                className="w-full rounded-xl border border-border/60 bg-muted/30 pl-10 pr-4 py-2 text-xs font-semibold focus:outline-none focus:border-primary"
              />
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {anonymizePdpa && (
                <span className="flex items-center gap-1 font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                  <ShieldCheck className="h-3.5 w-3.5" /> PDPA Anonymized
                </span>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border/50 text-[11px] font-bold text-muted-foreground uppercase tracking-wider bg-muted/10">
                  <th className="py-3.5 pl-4">Percentile Rank</th>
                  <th className="py-3.5">{anonymizePdpa ? "Admission ID (Anonymized)" : "Student Name & ID"}</th>
                  <th className="py-3.5">Score / 100</th>
                  <th className="py-3.5">Grade</th>
                  <th className="py-3.5 pr-4 text-right">Result Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filteredResults.map((r) => (
                  <tr key={r.student.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3.5 pl-4 font-mono font-bold text-foreground text-xs">
                      #{r.rank}
                    </td>

                    <td className="py-3.5">
                      {anonymizePdpa ? (
                        <p className="font-mono font-bold text-primary text-xs">{r.student.studentId}</p>
                      ) : (
                        <div>
                          <p className="font-bold text-foreground text-xs">{r.student.name}</p>
                          <p className="text-[10px] font-mono text-muted-foreground">{r.student.studentId} • {r.student.school}</p>
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 font-bold text-foreground text-xs">{r.marks}/100</td>

                    <td className="py-3.5 font-black text-primary text-sm">{r.grade}</td>

                    <td className="py-3.5 pr-4 text-right">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        r.status === "pass" ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
                      }`}>
                        {r.status === "pass" ? <CheckCircle2 className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                        {r.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </AnimatedSection>

      {/* Schedule Exam Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-50 w-full max-w-md rounded-3xl border border-border/80 glass-card shadow-2xl p-6"
            >
              <div className="flex items-center justify-between border-b border-border/50 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <h3 className="text-base font-bold text-foreground">Schedule Exam Evaluation</h3>
                </div>
                <button onClick={() => setIsAddModalOpen(false)}>
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>

              <form onSubmit={handleCreateExam} className="space-y-3.5">
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase">Exam Title</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Monthly Evaluation #5 - Trigonometry"
                    className="mt-1 w-full rounded-xl border border-border/60 bg-muted/20 px-3 py-2 text-xs font-semibold focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase">Target Class Batch</label>
                  <select
                    value={newClassId}
                    onChange={(e) => setNewClassId(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-border/60 bg-muted/20 px-3 py-2 text-xs font-semibold focus:outline-none focus:border-primary"
                  >
                    {mockClasses.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase">Total Marks</label>
                    <input
                      type="number"
                      value={newTotalMarks}
                      onChange={(e) => setNewTotalMarks(Number(e.target.value))}
                      className="mt-1 w-full rounded-xl border border-border/60 bg-muted/20 px-3 py-2 text-xs font-semibold focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase">Passing Mark</label>
                    <input
                      type="number"
                      value={newPassingMarks}
                      onChange={(e) => setNewPassingMarks(Number(e.target.value))}
                      className="mt-1 w-full rounded-xl border border-border/60 bg-muted/20 px-3 py-2 text-xs font-semibold focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="rounded-xl border border-border/60 px-4 py-2 text-xs font-semibold hover:bg-muted/50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-gradient-to-r from-primary to-violet-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-primary/25"
                  >
                    Register Exam
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AnimatedPage>
  );
}
