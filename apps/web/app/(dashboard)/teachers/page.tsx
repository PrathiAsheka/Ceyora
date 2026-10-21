"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Plus,
  Search,
  Filter,
  DollarSign,
  GraduationCap,
  Award,
  BookOpen,
  Phone,
  Mail,
  ChevronRight,
  CreditCard,
  Building2,
  X,
  ExternalLink,
} from "lucide-react";
import { AnimatedPage, AnimatedSection } from "@/components/animated-page";
import { mockTeachers, mockClasses, TeacherData } from "@/lib/mock-data";
import Link from "next/link";
import toast from "react-hot-toast";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { useInstituteStore } from "@/stores/institute-store";

export default function TeachersPage() {
  const { selectedInstituteId, selectedInstitute } = useInstituteStore();
  const [teachers, setTeachers] = useState<TeacherData[]>(mockTeachers);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [newName, setNewName] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newNic, setNewNic] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newSubject, setNewSubject] = useState("Combined Mathematics");
  const [newCompType, setNewCompType] = useState<"percentage" | "flat_student" | "hourly_rate">("percentage");
  const [newCompValue, setNewCompValue] = useState(80);
  const [newBank, setNewBank] = useState("Commercial Bank");
  const [newAccount, setNewAccount] = useState("");

  const filteredTeachers = teachers.filter((t) => {
    const matchesInstitute =
      !selectedInstituteId ||
      selectedInstituteId === "all" ||
      t.assignedClassIds.some((cid) => mockClasses.some((c) => c.id === cid && c.instituteId === selectedInstituteId));
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subjects.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      t.nic.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesInstitute && matchesSearch;
  });

  const handleAddTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone) {
      toast.error("Please enter teacher name and contact phone");
      return;
    }

    const newRecord: TeacherData = {
      id: "tea-" + (teachers.length + 1),
      name: newName,
      title: newTitle || "Senior Lecturer",
      nic: newNic || "198500000000",
      phone: newPhone,
      whatsapp: newPhone,
      email: `${newName.toLowerCase().replace(/[^a-z]/g, "")}@gmail.com`,
      subjects: [newSubject],
      assignedClassIds: [],
      compensationType: newCompType,
      compensationValue: Number(newCompValue),
      bankName: newBank,
      bankAccount: newAccount || "0000000000",
      totalStudents: 0,
      monthlyPayout: 0,
      passRate: 90,
      retentionRate: 95,
    };

    setTeachers([...teachers, newRecord]);
    setIsAddModalOpen(false);
    setNewName("");
    setNewTitle("");
    setNewPhone("");
    toast.success(`Faculty profile for ${newRecord.name} registered!`);
  };

  const totalFacultyPayout = teachers.reduce((acc, t) => acc + t.monthlyPayout, 0);
  const totalStudentsTaught = teachers.reduce((acc, t) => acc + t.totalStudents, 0);

  return (
    <AnimatedPage className="space-y-6">
      {/* Breadcrumbs Navigation */}
      <Breadcrumbs items={[{ label: "Teachers" }]} />

      {/* Header */}
      <AnimatedSection>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="flex h-2 w-2 rounded-full bg-violet-500" />
              <span className="text-[11px] font-bold text-violet-500 uppercase tracking-widest">
                Academic Faculty & Compensation Engine
              </span>
              {selectedInstitute && (
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary border border-primary/20">
                  {selectedInstitute.city} Branch
                </span>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
              Teacher <span className="gradient-text">Directory</span>
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Manage tuition masters, split formulas (percentage/flat/hourly), payouts, and class outcomes.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-violet-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow"
          >
            <Plus className="h-4 w-4" />
            Add Faculty Member
          </motion.button>
        </div>
      </AnimatedSection>

      {/* Faculty Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AnimatedSection>
          <div className="glass-card rounded-2xl p-5 border border-border/60">
            <span className="text-xs font-bold text-muted-foreground uppercase">Teaching Faculty</span>
            <p className="text-2xl font-black text-foreground mt-1">{teachers.length} Masters</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">A/L & O/L Subject Specialists</p>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div className="glass-card rounded-2xl p-5 border border-border/60">
            <span className="text-xs font-bold text-muted-foreground uppercase">Students Taught</span>
            <p className="text-2xl font-black text-emerald-500 mt-1">{totalStudentsTaught.toLocaleString()}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Across all registered batches</p>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div className="glass-card rounded-2xl p-5 border border-border/60">
            <span className="text-xs font-bold text-muted-foreground uppercase">Monthly Faculty Payout</span>
            <p className="text-2xl font-black text-foreground mt-1">LKR {(totalFacultyPayout / 1000000).toFixed(2)}M</p>
            <p className="text-[11px] text-primary font-semibold mt-0.5">Double-entry ledger verified</p>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div className="glass-card rounded-2xl p-5 border border-border/60">
            <span className="text-xs font-bold text-muted-foreground uppercase">Average Pass Rate</span>
            <p className="text-2xl font-black text-emerald-500 mt-1">92.4%</p>
            <p className="text-[11px] text-emerald-500 font-semibold mt-0.5">Evaluated across term exams</p>
          </div>
        </AnimatedSection>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search teacher name, subject, or NIC..."
            className="w-full rounded-xl border border-border/60 bg-muted/30 pl-10 pr-4 py-2 text-xs font-semibold focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* Teachers Grid */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-2">
        {filteredTeachers.map((tea) => {
          const assignedClasses = mockClasses.filter((c) => tea.assignedClassIds.includes(c.id));
          return (
            <AnimatedSection key={tea.id}>
              <div className="glass-card rounded-3xl p-6 border border-border/60 hover:border-primary/40 transition-all shadow-sm hover:shadow-xl space-y-4 group">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3.5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary to-violet-600 text-white font-black text-base shadow-md">
                      {tea.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                        {tea.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{tea.title}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {tea.subjects.map((sub) => (
                          <span key={sub} className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                            {sub}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Compensation Badge */}
                  <div className="text-right">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500">
                      {tea.compensationType === "percentage" ? `${tea.compensationValue}% Split` : tea.compensationType === "flat_student" ? `LKR ${tea.compensationValue}/Student` : `LKR ${tea.compensationValue}/Hr`}
                    </span>
                    <p className="text-sm font-black text-foreground mt-1">LKR {(tea.monthlyPayout / 1000).toLocaleString()}k/mo</p>
                  </div>
                </div>

                {/* Assigned Classes */}
                <div className="rounded-2xl border border-border/40 bg-muted/20 p-3.5 space-y-2">
                  <p className="text-[11px] font-bold text-muted-foreground uppercase">Assigned Classes ({assignedClasses.length})</p>
                  <div className="space-y-1.5">
                    {assignedClasses.map((cls) => (
                      <div key={cls.id} className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-foreground truncate">{cls.name}</span>
                        <span className="text-[10px] text-muted-foreground font-mono shrink-0">{cls.enrolledStudentsCount} Students</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Performance stats row */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/40 text-center text-xs">
                  <div>
                    <span className="text-[10px] text-muted-foreground">Total Students</span>
                    <p className="font-bold text-foreground mt-0.5">{tea.totalStudents}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground">Pass Rate</span>
                    <p className="font-bold text-emerald-500 mt-0.5">{tea.passRate}%</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground">Retention Rate</span>
                    <p className="font-bold text-foreground mt-0.5">{tea.retentionRate}%</p>
                  </div>
                </div>

                <Link href={`/teachers/${tea.id}`}>
                  <button className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-border/60 py-2.5 text-xs font-bold text-foreground hover:bg-primary hover:text-white hover:border-primary transition-all">
                    <span>View Faculty Profile & Compensation</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </Link>
              </div>
            </AnimatedSection>
          );
        })}
      </div>

      {/* Add Faculty Modal */}
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
                  <Users className="h-5 w-5 text-primary" />
                  <h3 className="text-base font-bold text-foreground">Add Teaching Faculty</h3>
                </div>
                <button onClick={() => setIsAddModalOpen(false)}>
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>

              <form onSubmit={handleAddTeacher} className="space-y-3.5">
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase">Full Name</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Eng. Dilantha Fernando"
                    className="mt-1 w-full rounded-xl border border-border/60 bg-muted/20 px-3 py-2 text-xs font-semibold focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase">Academic Title</label>
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="e.g. Senior Lecturer (B.Sc Eng)"
                      className="mt-1 w-full rounded-xl border border-border/60 bg-muted/20 px-3 py-2 text-xs font-semibold focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase">NIC Number</label>
                    <input
                      type="text"
                      value={newNic}
                      onChange={(e) => setNewNic(e.target.value)}
                      placeholder="e.g. 821450912V"
                      className="mt-1 w-full rounded-xl border border-border/60 bg-muted/20 px-3 py-2 text-xs font-semibold focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase">Phone / WhatsApp</label>
                    <input
                      type="tel"
                      required
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      placeholder="+94 77 ..."
                      className="mt-1 w-full rounded-xl border border-border/60 bg-muted/20 px-3 py-2 text-xs font-semibold focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase">Subject Area</label>
                    <input
                      type="text"
                      value={newSubject}
                      onChange={(e) => setNewSubject(e.target.value)}
                      placeholder="e.g. Physics"
                      className="mt-1 w-full rounded-xl border border-border/60 bg-muted/20 px-3 py-2 text-xs font-semibold focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase">Compensation Model</label>
                    <select
                      value={newCompType}
                      onChange={(e) => setNewCompType(e.target.value as any)}
                      className="mt-1 w-full rounded-xl border border-border/60 bg-muted/20 px-3 py-2 text-xs font-semibold focus:outline-none focus:border-primary"
                    >
                      <option value="percentage">Percentage Split (%)</option>
                      <option value="flat_student">Flat Fee per Student (LKR)</option>
                      <option value="hourly_rate">Hourly Teaching Rate (LKR)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase">Compensation Value</label>
                    <input
                      type="number"
                      value={newCompValue}
                      onChange={(e) => setNewCompValue(Number(e.target.value))}
                      className="mt-1 w-full rounded-xl border border-border/60 bg-muted/20 px-3 py-2 text-xs font-semibold focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase">Bank Name</label>
                    <input
                      type="text"
                      value={newBank}
                      onChange={(e) => setNewBank(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-border/60 bg-muted/20 px-3 py-2 text-xs font-semibold focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase">Account Number</label>
                    <input
                      type="text"
                      value={newAccount}
                      onChange={(e) => setNewAccount(e.target.value)}
                      placeholder="Bank Account #"
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
                    Register Teacher
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
