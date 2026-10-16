"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  BookOpen,
  Edit,
  Trash2,
  GraduationCap,
  Users,
  Layers,
  X,
  Check,
  Sparkles,
} from "lucide-react";
import { AnimatedPage, AnimatedSection } from "@/components/animated-page";
import { useI18n } from "@/lib/i18n";
import { mockClasses, mockTeachers, mockStudents } from "@/lib/mock-data";

interface SubjectItem {
  id: string;
  code: string;
  name: string;
  stream: "Physical Science" | "Biological Science" | "Commerce" | "Technology" | "Ordinary Level" | "General";
  grades: string;
  mediums: string[];
  activeBatches: number;
  enrolledStudents: number;
  facultyCount: number;
  color: string;
}

export default function SubjectsPage() {
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStream, setSelectedStream] = useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Initial subjects linked with mock data
  const [subjects, setSubjects] = useState<SubjectItem[]>([
    {
      id: "sub-1",
      code: "AL-MATHS",
      name: "Combined Mathematics",
      stream: "Physical Science",
      grades: "12 - 13 (A/L)",
      mediums: ["Sinhala", "English"],
      activeBatches: 2,
      enrolledStudents: 104,
      facultyCount: 1,
      color: "from-blue-500 to-cyan-400",
    },
    {
      id: "sub-2",
      code: "AL-PHY",
      name: "Physics",
      stream: "Physical Science",
      grades: "12 - 13 (A/L)",
      mediums: ["Sinhala", "English"],
      activeBatches: 1,
      enrolledStudents: 48,
      facultyCount: 1,
      color: "from-violet-500 to-purple-400",
    },
    {
      id: "sub-3",
      code: "AL-CHEM",
      name: "Chemistry",
      stream: "Physical Science",
      grades: "12 - 13 (A/L)",
      mediums: ["Sinhala", "English"],
      activeBatches: 1,
      enrolledStudents: 38,
      facultyCount: 1,
      color: "from-amber-500 to-orange-400",
    },
    {
      id: "sub-4",
      code: "AL-BIO",
      name: "Biology",
      stream: "Biological Science",
      grades: "12 - 13 (A/L)",
      mediums: ["Sinhala", "English"],
      activeBatches: 1,
      enrolledStudents: 32,
      facultyCount: 1,
      color: "from-emerald-500 to-teal-400",
    },
    {
      id: "sub-5",
      code: "OL-MATHS",
      name: "Mathematics (Ordinary Level)",
      stream: "Ordinary Level",
      grades: "10 - 11 (O/L)",
      mediums: ["Sinhala", "English", "Tamil"],
      activeBatches: 1,
      enrolledStudents: 42,
      facultyCount: 1,
      color: "from-cyan-500 to-blue-400",
    },
    {
      id: "sub-6",
      code: "AL-ICT",
      name: "Information & Communication Technology",
      stream: "Technology",
      grades: "12 - 13 (A/L)",
      mediums: ["English"],
      activeBatches: 1,
      enrolledStudents: 28,
      facultyCount: 1,
      color: "from-red-500 to-pink-400",
    },
  ]);

  // New subject form state
  const [newCode, setNewCode] = useState("");
  const [newName, setNewName] = useState("");
  const [newStream, setNewStream] = useState<SubjectItem["stream"]>("Physical Science");
  const [newGrades, setNewGrades] = useState("12 - 13 (A/L)");
  const [newMedium, setNewMedium] = useState("Sinhala & English");

  const filteredSubjects = subjects.filter((sub) => {
    const matchesStream = selectedStream === "all" || sub.stream === selectedStream;
    const matchesSearch =
      sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStream && matchesSearch;
  });

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newCode.trim()) return;

    const newSub: SubjectItem = {
      id: `sub-${Date.now()}`,
      code: newCode.toUpperCase(),
      name: newName,
      stream: newStream,
      grades: newGrades,
      mediums: newMedium.split("&").map((s) => s.trim()),
      activeBatches: 0,
      enrolledStudents: 0,
      facultyCount: 0,
      color: "from-primary to-violet-500",
    };

    setSubjects([...subjects, newSub]);
    setNewCode("");
    setNewName("");
    setIsAddModalOpen(false);
  };

  const handleDeleteSubject = (id: string) => {
    setSubjects(subjects.filter((s) => s.id !== id));
  };

  return (
    <AnimatedPage className="space-y-6">
      {/* Header */}
      <AnimatedSection>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <BookOpen className="h-3.5 w-3.5" /> Sri Lanka National Curriculum
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-500">
                <Check className="h-3 w-3" /> G.C.E. A/L & O/L Aligned
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              <span className="gradient-text">{t("settings.subjectsPage.title")}</span>
            </h1>
            <p className="text-muted-foreground mt-1">{t("settings.subjectsPage.subtitle")}</p>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-violet-500 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-primary/25"
            >
              <Plus className="h-4 w-4" /> {t("settings.subjectsPage.addSubject")}
            </motion.button>
          </div>
        </div>
      </AnimatedSection>

      {/* Filter and Search Bar */}
      <AnimatedSection>
        <div className="glass-card rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 border border-border/40">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={t("settings.subjectsPage.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-border/50 bg-background/50 pl-9 pr-3 py-1.5 text-xs focus:outline-none focus:border-primary/50"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            {["all", "Physical Science", "Biological Science", "Commerce", "Technology", "Ordinary Level"].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStream(st)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedStream === st ? "bg-primary text-white shadow-sm" : "bg-muted/40 text-muted-foreground hover:text-foreground"
                }`}
              >
                {st === "all" ? "All Streams" : st}
              </button>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Subjects Grid Table */}
      <AnimatedSection>
        <div className="glass-card rounded-2xl shadow-sm border border-border/40 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border/40 bg-muted/30 text-muted-foreground uppercase tracking-wider font-semibold">
                  <th className="px-6 py-3.5">Subject & Code</th>
                  <th className="px-5 py-3.5">Stream Category</th>
                  <th className="px-5 py-3.5">Grades & Medium</th>
                  <th className="px-5 py-3.5 text-center">Active Batches</th>
                  <th className="px-5 py-3.5 text-center">Enrolled Students</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {filteredSubjects.map((sub) => (
                  <tr key={sub.id} className="hover:bg-muted/15 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${sub.color} text-white font-bold text-xs shadow-md`}
                        >
                          {sub.code.split("-")[1]?.substring(0, 2) || sub.name.substring(0, 2)}
                        </div>
                        <div>
                          <span className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                            {sub.name}
                          </span>
                          <p className="font-mono text-[11px] text-muted-foreground">{sub.code}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 rounded-full bg-muted/60 px-2.5 py-0.5 text-[11px] font-semibold text-foreground/80">
                        {sub.stream}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="text-xs font-semibold text-foreground">{sub.grades}</div>
                      <div className="text-[11px] text-muted-foreground">{sub.mediums.join(", ")} Medium</div>
                    </td>

                    <td className="px-5 py-4 text-center">
                      <span className="font-mono font-bold text-xs text-foreground bg-primary/10 text-primary px-2 py-0.5 rounded-lg">
                        {sub.activeBatches} Batches
                      </span>
                    </td>

                    <td className="px-5 py-4 text-center font-bold text-xs text-foreground">
                      {sub.enrolledStudents}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleDeleteSubject(sub.id)}
                          className="rounded-lg p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
                          title="Delete Subject"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </AnimatedSection>

      {/* Add Subject Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card rounded-2xl p-6 shadow-2xl border border-border/50 max-w-md w-full bg-background"
            >
              <div className="flex items-center justify-between pb-4 border-b border-border/40">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <h3 className="font-bold text-base">Add New Subject Definition</h3>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-lg p-1 hover:bg-muted/50 text-muted-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleAddSubject} className="space-y-4 pt-4 text-xs">
                <div>
                  <label className="font-semibold text-foreground/80 block mb-1">Subject Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Accounting (A/L)"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full rounded-xl border border-border/50 bg-muted/20 px-3.5 py-2 text-xs focus:outline-none focus:border-primary/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-foreground/80 block mb-1">Subject Code</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. AL-ACC"
                      value={newCode}
                      onChange={(e) => setNewCode(e.target.value)}
                      className="w-full rounded-xl border border-border/50 bg-muted/20 px-3 py-2 text-xs font-mono uppercase focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-foreground/80 block mb-1">Stream</label>
                    <select
                      value={newStream}
                      onChange={(e) => setNewStream(e.target.value as any)}
                      className="w-full rounded-xl border border-border/50 bg-muted/20 px-3 py-2 text-xs focus:outline-none"
                    >
                      <option value="Physical Science">Physical Science</option>
                      <option value="Biological Science">Biological Science</option>
                      <option value="Commerce">Commerce</option>
                      <option value="Technology">Technology</option>
                      <option value="Ordinary Level">Ordinary Level</option>
                      <option value="General">General / Languages</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-foreground/80 block mb-1">Grade Levels</label>
                    <input
                      type="text"
                      value={newGrades}
                      onChange={(e) => setNewGrades(e.target.value)}
                      className="w-full rounded-xl border border-border/50 bg-muted/20 px-3 py-2 text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-foreground/80 block mb-1">Medium</label>
                    <input
                      type="text"
                      value={newMedium}
                      onChange={(e) => setNewMedium(e.target.value)}
                      placeholder="e.g. Sinhala & English"
                      className="w-full rounded-xl border border-border/50 bg-muted/20 px-3 py-2 text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="rounded-xl border border-border/60 px-4 py-2 font-semibold hover:bg-muted/40"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-gradient-to-r from-primary to-violet-500 px-5 py-2 font-bold text-white shadow-lg shadow-primary/20"
                  >
                    Save Subject
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
