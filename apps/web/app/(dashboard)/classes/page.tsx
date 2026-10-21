"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  Plus,
  Search,
  Filter,
  Users,
  DollarSign,
  Clock,
  MapPin,
  ChevronRight,
  Sparkles,
  QrCode,
  Calendar,
  X,
  User,
  ArrowUpRight,
} from "lucide-react";
import { AnimatedPage, AnimatedSection } from "@/components/animated-page";
import { mockClasses, mockTeachers, ClassData } from "@/lib/mock-data";
import Link from "next/link";
import toast from "react-hot-toast";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { useInstituteStore } from "@/stores/institute-store";

export default function ClassesPage() {
  const { selectedInstituteId, selectedInstitute } = useInstituteStore();
  const [classes, setClasses] = useState<ClassData[]>(mockClasses);
  const [searchQuery, setSearchQuery] = useState("");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Class Form State
  const [newName, setNewName] = useState("");
  const [newSubject, setNewSubject] = useState("Combined Mathematics");
  const [newTeacherId, setNewTeacherId] = useState(mockTeachers[0].id);
  const [newGrade, setNewGrade] = useState("Grade 12 (2026 A/L)");
  const [newMedium, setNewMedium] = useState<"Sinhala" | "English">("Sinhala");
  const [newFee, setNewFee] = useState(4500);
  const [newHall, setNewHall] = useState("Auditorium A (Smart Wing)");
  const [newSlot, setNewSlot] = useState("Saturdays 08:30 AM - 01:00 PM");

  const filteredClasses = classes.filter((cls) => {
    const matchesInstitute = !selectedInstituteId || selectedInstituteId === "all" || cls.instituteId === selectedInstituteId;
    const matchesSearch =
      cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGrade = gradeFilter === "all" || cls.grade.includes(gradeFilter);
    return matchesInstitute && matchesSearch && matchesGrade;
  });

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) {
      toast.error("Please enter class name");
      return;
    }

    const newRecord: ClassData = {
      id: "cls-" + (classes.length + 1),
      name: newName,
      code: `CLS-${Math.floor(100 + Math.random() * 900)}`,
      subject: newSubject,
      teacherId: newTeacherId,
      instituteId: selectedInstituteId && selectedInstituteId !== "all" ? selectedInstituteId : "inst-1",
      grade: newGrade,
      medium: newMedium,
      dayOfWeek: newSlot.split(" ")[0] || "Saturday",
      timeSlot: newSlot,
      hall: newHall,
      monthlyFee: Number(newFee),
      enrolledStudentsCount: 0,
      presentLastClass: 0,
      monthlyCollection: 0,
      teacherSharePercentage: 80,
      instituteSharePercentage: 20,
      hallChargesDeduction: 10000,
      status: "active",
    };

    setClasses([...classes, newRecord]);
    setIsAddModalOpen(false);
    setNewName("");
    toast.success(`Batch "${newRecord.name}" scheduled successfully!`);
  };

  const totalEnrolled = classes.reduce((acc, c) => acc + c.enrolledStudentsCount, 0);
  const totalMonthlyBilled = classes.reduce((acc, c) => acc + c.monthlyCollection, 0);

  return (
    <AnimatedPage className="space-y-6">
      {/* Breadcrumbs Navigation */}
      <Breadcrumbs items={[{ label: "Classes" }]} />

      {/* Header */}
      <AnimatedSection>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="flex h-2 w-2 rounded-full bg-primary" />
              <span className="text-[11px] font-bold text-primary uppercase tracking-widest">
                Academic Batches & Hall Schedules
              </span>
              {selectedInstitute && (
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary border border-primary/20">
                  {selectedInstitute.city} Branch
                </span>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
              Class <span className="gradient-text">Directory</span>
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Manage class fees, hall allocations, teacher revenue splits, and batch enrollments.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/attendance/scan">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-1.5 rounded-2xl border border-border/60 bg-muted/30 px-3.5 py-2.5 text-xs font-semibold hover:bg-muted/60"
              >
                <QrCode className="h-4 w-4" /> Gate Scanner
              </motion.button>
            </Link>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-violet-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow"
            >
              <Plus className="h-4 w-4" />
              Schedule Class Batch
            </motion.button>
          </div>
        </div>
      </AnimatedSection>

      {/* Class Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AnimatedSection>
          <div className="glass-card rounded-2xl p-5 border border-border/60">
            <span className="text-xs font-bold text-muted-foreground uppercase">Active Batches</span>
            <p className="text-2xl font-black text-foreground mt-1">{classes.length} Classes</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Across 3 Lecture Auditoriums</p>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div className="glass-card rounded-2xl p-5 border border-border/60">
            <span className="text-xs font-bold text-muted-foreground uppercase">Total Students</span>
            <p className="text-2xl font-black text-emerald-500 mt-1">{totalEnrolled.toLocaleString()}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Average 170 per batch</p>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div className="glass-card rounded-2xl p-5 border border-border/60">
            <span className="text-xs font-bold text-muted-foreground uppercase">Class Billing</span>
            <p className="text-2xl font-black text-foreground mt-1">LKR {(totalMonthlyBilled / 1000000).toFixed(2)}M</p>
            <p className="text-[11px] text-emerald-500 font-semibold mt-0.5">94.8% Collection Efficiency</p>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div className="glass-card rounded-2xl p-5 border border-border/60">
            <span className="text-xs font-bold text-muted-foreground uppercase">Faculty Split</span>
            <p className="text-2xl font-black text-primary mt-1">80% / 20%</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Standard Tuition Split Formula</p>
          </div>
        </AnimatedSection>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search class title, code, or subject..."
            className="w-full rounded-xl border border-border/60 bg-muted/30 pl-10 pr-4 py-2 text-xs font-semibold focus:outline-none focus:border-primary"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "all", label: "All Grades" },
            { id: "Grade 12", label: "Grade 12 (2026)" },
            { id: "Grade 13", label: "Grade 13 (2025)" },
            { id: "Grade 11", label: "Grade 11 (O/L)" },
          ].map((g) => (
            <button
              key={g.id}
              onClick={() => setGradeFilter(g.id)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                gradeFilter === g.id
                  ? "bg-primary text-white shadow-sm"
                  : "bg-muted/40 text-muted-foreground hover:text-foreground"
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {/* Classes Grid */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filteredClasses.map((cls) => {
          const teacher = mockTeachers.find((t) => t.id === cls.teacherId);
          const attendancePct = Math.round((cls.presentLastClass / cls.enrolledStudentsCount) * 100);
          return (
            <AnimatedSection key={cls.id}>
              <div className="glass-card rounded-3xl p-6 border border-border/60 hover:border-primary/40 transition-all shadow-sm hover:shadow-xl flex flex-col justify-between space-y-4 group">
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                        {cls.code}
                      </span>
                      <h3 className="text-base font-bold text-foreground mt-1.5 group-hover:text-primary transition-colors">
                        {cls.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{cls.grade} • {cls.medium} Medium</p>
                    </div>

                    <span className="text-xs font-black text-foreground bg-muted/60 px-2.5 py-1 rounded-xl">
                      LKR {cls.monthlyFee.toLocaleString()}/mo
                    </span>
                  </div>

                  {/* Connected Teacher info */}
                  <div className="mt-4 p-3 rounded-2xl border border-border/40 bg-muted/20 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-xs">
                        {teacher?.name.split(" ")[1]?.[0] || "T"}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground">{teacher?.name}</p>
                        <p className="text-[10px] text-muted-foreground">Split: {cls.teacherSharePercentage}% Teacher / {cls.instituteSharePercentage}% Institute</p>
                      </div>
                    </div>
                  </div>

                  {/* Schedule & Hall details */}
                  <div className="mt-3 space-y-1.5 text-xs">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-3.5 w-3.5 text-primary" />
                      <span>{cls.timeSlot}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      <span>{cls.hall}</span>
                    </div>
                  </div>

                  {/* Attendance & Enrollment Bar */}
                  <div className="mt-4 pt-3 border-t border-border/40">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground mb-1">
                      <span>Enrollment: <strong className="text-foreground">{cls.enrolledStudentsCount} Students</strong></span>
                      <span className="font-bold text-emerald-500">Attendance: {attendancePct}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted/60 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-emerald-400 rounded-full"
                        style={{ width: `${attendancePct}%` }}
                      />
                    </div>
                  </div>
                </div>

                <Link href={`/classes/${cls.id}`}>
                  <button className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-border/60 py-2.5 text-xs font-bold text-foreground hover:bg-primary hover:text-white hover:border-primary transition-all">
                    <span>View Class Intelligence</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </Link>
              </div>
            </AnimatedSection>
          );
        })}
      </div>

      {/* Schedule Class Batch Modal */}
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
              className="relative z-50 w-full max-w-lg rounded-3xl border border-border/80 glass-card shadow-2xl p-6"
            >
              <div className="flex items-center justify-between border-b border-border/50 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  <h3 className="text-base font-bold text-foreground">Schedule Tuition Batch</h3>
                </div>
                <button onClick={() => setIsAddModalOpen(false)}>
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>

              <form onSubmit={handleCreateClass} className="space-y-3.5">
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase">Batch Title</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. A/L Combined Mathematics 2026 (Paper Class)"
                    className="mt-1 w-full rounded-xl border border-border/60 bg-muted/20 px-3 py-2 text-xs font-semibold focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase">Subject</label>
                    <input
                      type="text"
                      value={newSubject}
                      onChange={(e) => setNewSubject(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-border/60 bg-muted/20 px-3 py-2 text-xs font-semibold focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase">Lead Teacher</label>
                    <select
                      value={newTeacherId}
                      onChange={(e) => setNewTeacherId(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-border/60 bg-muted/20 px-3 py-2 text-xs font-semibold focus:outline-none focus:border-primary"
                    >
                      {mockTeachers.map((t) => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase">Grade / Target Year</label>
                    <input
                      type="text"
                      value={newGrade}
                      onChange={(e) => setNewGrade(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-border/60 bg-muted/20 px-3 py-2 text-xs font-semibold focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase">Monthly Tuition Fee (LKR)</label>
                    <input
                      type="number"
                      value={newFee}
                      onChange={(e) => setNewFee(Number(e.target.value))}
                      className="mt-1 w-full rounded-xl border border-border/60 bg-muted/20 px-3 py-2 text-xs font-semibold focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase">Allocated Lecture Hall</label>
                    <input
                      type="text"
                      value={newHall}
                      onChange={(e) => setNewHall(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-border/60 bg-muted/20 px-3 py-2 text-xs font-semibold focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase">Weekly Slot</label>
                    <input
                      type="text"
                      value={newSlot}
                      onChange={(e) => setNewSlot(e.target.value)}
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
                    Schedule Batch
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
