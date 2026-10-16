"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Filter,
  GraduationCap,
  Upload,
  QrCode,
  Phone,
  Mail,
  CheckCircle2,
  Clock,
  AlertCircle,
  MoreVertical,
  X,
  CreditCard,
  UserCheck,
  Building2,
  Download,
} from "lucide-react";
import { AnimatedPage, AnimatedSection } from "@/components/animated-page";
import { useI18n } from "@/lib/i18n";
import toast from "react-hot-toast";

interface StudentRecord {
  id: string;
  studentId: string;
  name: string;
  guardianName: string;
  phone: string;
  school: string;
  grade: string;
  enrolledClasses: string[];
  attendanceRate: number;
  paymentStatus: "paid" | "pending" | "overdue";
  balance: number;
}

const initialStudents: StudentRecord[] = [
  {
    id: "s1",
    studentId: "STU-0421",
    name: "Kavindu Perera",
    guardianName: "Sunil Perera",
    phone: "+94 77 123 4567",
    school: "Royal College, Colombo",
    grade: "Grade 12",
    enrolledClasses: ["A/L Combined Maths", "A/L Physics"],
    attendanceRate: 94,
    paymentStatus: "overdue",
    balance: 4500,
  },
  {
    id: "s2",
    studentId: "STU-0389",
    name: "Minoli Senanayake",
    guardianName: "Kamal Senanayake",
    phone: "+94 71 987 6543",
    school: "Visakha Vidyalaya, Colombo",
    grade: "Grade 13",
    enrolledClasses: ["A/L Chemistry", "A/L Biology"],
    attendanceRate: 88,
    paymentStatus: "paid",
    balance: 0,
  },
  {
    id: "s3",
    studentId: "STU-0512",
    name: "Dinuka Rajapaksha",
    guardianName: "Nihal Rajapaksha",
    phone: "+94 76 555 1212",
    school: "Ananda College, Colombo",
    grade: "Grade 12",
    enrolledClasses: ["A/L Combined Maths", "A/L ICT"],
    attendanceRate: 96,
    paymentStatus: "paid",
    balance: 0,
  },
  {
    id: "s4",
    studentId: "STU-0294",
    name: "Tharushi Fernando",
    guardianName: "Malini Fernando",
    phone: "+94 78 444 3322",
    school: "Devi Balika Vidyalaya",
    grade: "Grade 11",
    enrolledClasses: ["O/L Mathematics", "O/L Science"],
    attendanceRate: 72,
    paymentStatus: "pending",
    balance: 3200,
  },
  {
    id: "s5",
    studentId: "STU-0601",
    name: "Ashen Wickramasinghe",
    guardianName: "Bandula Wickramasinghe",
    phone: "+94 75 888 9900",
    school: "Nalanda College, Colombo",
    grade: "Grade 13",
    enrolledClasses: ["A/L Physics Revision"],
    attendanceRate: 91,
    paymentStatus: "paid",
    balance: 0,
  },
];

export default function StudentsPage() {
  const { t } = useI18n();
  const [students, setStudents] = useState<StudentRecord[]>(initialStudents);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "paid" | "pending" | "overdue">("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedStudentForQr, setSelectedStudentForQr] = useState<StudentRecord | null>(null);

  // New Student Form State
  const [newName, setNewName] = useState("");
  const [newSchool, setNewSchool] = useState("");
  const [newGrade, setNewGrade] = useState("Grade 12");
  const [newGuardian, setNewGuardian] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newClass, setNewClass] = useState("A/L Combined Maths");

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.school.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.phone.includes(searchQuery);

    const matchesStatus = statusFilter === "all" || student.paymentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone) {
      toast.error("Please fill in student name and phone");
      return;
    }

    const newRecord: StudentRecord = {
      id: "s-" + Date.now(),
      studentId: `STU-${Math.floor(1000 + Math.random() * 9000)}`,
      name: newName,
      guardianName: newGuardian || "Parent / Guardian",
      phone: newPhone,
      school: newSchool || "Colombo School",
      grade: newGrade,
      enrolledClasses: [newClass],
      attendanceRate: 100,
      paymentStatus: "paid",
      balance: 0,
    };

    setStudents([newRecord, ...students]);
    setIsAddModalOpen(false);
    setNewName("");
    setNewSchool("");
    setNewGuardian("");
    setNewPhone("");

    toast.success(`Enrolled ${newRecord.name} successfully! QR generated.`, {
      icon: "🎓",
    });
  };

  return (
    <AnimatedPage className="space-y-6">
      {/* Header */}
      <AnimatedSection>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
              Student <span className="gradient-text">Directory</span>
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Manage student admissions, biometric QR digital badges, and fee statuses.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => toast("Exporting student directory CSV...", { icon: "📥" })}
              className="flex items-center gap-2 rounded-2xl border border-border/60 bg-muted/30 px-3.5 py-2.5 text-xs font-semibold hover:bg-muted/60 transition-colors"
            >
              <Download className="h-4 w-4" />
              Export
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-violet-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow"
            >
              <Plus className="h-4 w-4" />
              Enroll Student
            </motion.button>
          </div>
        </div>
      </AnimatedSection>

      {/* Metrics Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AnimatedSection>
          <div className="glass-card rounded-2xl p-4 border border-border/60">
            <p className="text-xs font-bold text-muted-foreground uppercase">Total Enrolled</p>
            <p className="text-2xl font-black text-foreground mt-1">{students.length} Active</p>
          </div>
        </AnimatedSection>
        <AnimatedSection>
          <div className="glass-card rounded-2xl p-4 border border-border/60">
            <p className="text-xs font-bold text-muted-foreground uppercase">Average Attendance</p>
            <p className="text-2xl font-black text-emerald-500 mt-1">92.2%</p>
          </div>
        </AnimatedSection>
        <AnimatedSection>
          <div className="glass-card rounded-2xl p-4 border border-border/60">
            <p className="text-xs font-bold text-muted-foreground uppercase">Fee Arrears</p>
            <p className="text-2xl font-black text-red-500 mt-1">
              LKR {students.reduce((acc, s) => acc + s.balance, 0).toLocaleString()}
            </p>
          </div>
        </AnimatedSection>
        <AnimatedSection>
          <div className="glass-card rounded-2xl p-4 border border-border/60">
            <p className="text-xs font-bold text-muted-foreground uppercase">At Risk (&lt; 75% Attendance)</p>
            <p className="text-2xl font-black text-amber-500 mt-1">
              {students.filter((s) => s.attendanceRate < 75).length} Students
            </p>
          </div>
        </AnimatedSection>
      </div>

      {/* Main Student Table Card */}
      <AnimatedSection>
        <div className="glass-card rounded-3xl shadow-sm border border-border/60 overflow-hidden">
          {/* Controls toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/50 p-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name, ID, phone, school..."
                className="w-full rounded-xl border border-border/60 bg-muted/30 pl-10 pr-4 py-2 text-xs font-medium focus:outline-none focus:bg-background focus:border-primary transition-all"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {(["all", "paid", "pending", "overdue"] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-bold capitalize transition-all ${
                    statusFilter === status
                      ? "bg-primary text-white shadow-sm"
                      : "bg-muted/40 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border/50 text-[11px] font-bold text-muted-foreground uppercase tracking-wider bg-muted/10">
                  <th className="py-3.5 pl-4">Student</th>
                  <th className="py-3.5">School & Grade</th>
                  <th className="py-3.5">Enrolled Classes</th>
                  <th className="py-3.5">Attendance</th>
                  <th className="py-3.5">Fee Status</th>
                  <th className="py-3.5 pr-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-muted-foreground text-sm">
                      No matching students found
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 pl-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-violet-500 text-white font-bold text-xs shadow-sm">
                            {student.name.split(" ").map((n) => n[0]).join("")}
                          </div>
                          <div>
                            <p className="font-bold text-foreground text-xs">{student.name}</p>
                            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                              <span className="font-mono text-primary font-semibold">{student.studentId}</span>
                              <span>•</span>
                              <span>{student.phone}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3">
                        <p className="font-semibold text-foreground text-xs">{student.school}</p>
                        <p className="text-[10px] text-muted-foreground">{student.grade}</p>
                      </td>

                      <td className="py-3">
                        <div className="flex flex-wrap gap-1">
                          {student.enrolledClasses.map((cls) => (
                            <span
                              key={cls}
                              className="rounded-md bg-muted/60 border border-border/40 px-2 py-0.5 text-[10px] font-semibold text-foreground"
                            >
                              {cls}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-bold ${
                              student.attendanceRate < 75
                                ? "text-red-500"
                                : student.attendanceRate < 90
                                ? "text-amber-500"
                                : "text-emerald-500"
                            }`}
                          >
                            {student.attendanceRate}%
                          </span>
                          <div className="h-1.5 w-16 bg-muted/60 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                student.attendanceRate < 75 ? "bg-red-500" : "bg-emerald-500"
                              }`}
                              style={{ width: `${student.attendanceRate}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="py-3">
                        {student.paymentStatus === "paid" && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-500">
                            <CheckCircle2 className="h-3 w-3" /> Paid Up
                          </span>
                        )}
                        {student.paymentStatus === "pending" && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-500">
                            <Clock className="h-3 w-3" /> Due LKR {student.balance.toLocaleString()}
                          </span>
                        )}
                        {student.paymentStatus === "overdue" && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2.5 py-0.5 text-[10px] font-bold text-red-500">
                            <AlertCircle className="h-3 w-3" /> Overdue LKR {student.balance.toLocaleString()}
                          </span>
                        )}
                      </td>

                      <td className="py-3 pr-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedStudentForQr(student)}
                            title="View Student QR Badge"
                            className="rounded-xl border border-border/60 bg-muted/30 hover:bg-primary/10 hover:text-primary p-2 text-muted-foreground transition-colors"
                          >
                            <QrCode className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => toast.success(`Payment recorded for ${student.name}`)}
                            title="Quick Collect Fee"
                            className="rounded-xl border border-border/60 bg-muted/30 hover:bg-emerald-500/10 hover:text-emerald-500 p-2 text-muted-foreground transition-colors"
                          >
                            <CreditCard className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </AnimatedSection>

      {/* Add Student Modal */}
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
              className="relative z-50 w-full max-w-lg rounded-3xl border border-border/80 glass-card shadow-2xl p-6 sm:p-8"
            >
              <div className="flex items-center justify-between border-b border-border/50 pb-4 mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">Enroll New Student</h3>
                    <p className="text-xs text-muted-foreground">Creates student record and biometric QR badge</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-xl p-1 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleAddStudent} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase">Full Name</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Kasun Chamara"
                    className="mt-1 w-full rounded-xl border border-border/60 bg-muted/20 px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase">School</label>
                    <input
                      type="text"
                      value={newSchool}
                      onChange={(e) => setNewSchool(e.target.value)}
                      placeholder="e.g. Royal College"
                      className="mt-1 w-full rounded-xl border border-border/60 bg-muted/20 px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase">Grade / Batch</label>
                    <select
                      value={newGrade}
                      onChange={(e) => setNewGrade(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-border/60 bg-muted/20 px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-primary"
                    >
                      <option value="Grade 10">Grade 10</option>
                      <option value="Grade 11">Grade 11 (O/L)</option>
                      <option value="Grade 12">Grade 12 (A/L 2026)</option>
                      <option value="Grade 13">Grade 13 (A/L 2025)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase">Guardian Name</label>
                    <input
                      type="text"
                      value={newGuardian}
                      onChange={(e) => setNewGuardian(e.target.value)}
                      placeholder="e.g. Nimal Chamara"
                      className="mt-1 w-full rounded-xl border border-border/60 bg-muted/20 px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase">Guardian Phone</label>
                    <input
                      type="tel"
                      required
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      placeholder="+94 77 ..."
                      className="mt-1 w-full rounded-xl border border-border/60 bg-muted/20 px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase">Enrolling Class</label>
                  <select
                    value={newClass}
                    onChange={(e) => setNewClass(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-border/60 bg-muted/20 px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-primary"
                  >
                    <option value="A/L Combined Maths">A/L Combined Maths (Theory)</option>
                    <option value="A/L Physics">A/L Physics (Revision)</option>
                    <option value="A/L Chemistry">A/L Chemistry</option>
                    <option value="O/L Mathematics">O/L Mathematics</option>
                  </select>
                </div>

                <div className="pt-3 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="rounded-xl border border-border/60 px-4 py-2.5 text-xs font-semibold hover:bg-muted/50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-gradient-to-r from-primary to-violet-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-primary/30 hover:shadow-primary/50"
                  >
                    Confirm Admission
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Student QR Badge Preview Modal */}
      <AnimatePresence>
        {selectedStudentForQr && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedStudentForQr(null)}
              className="fixed inset-0 bg-background/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-50 w-full max-w-sm rounded-3xl border border-border/80 glass-card shadow-2xl p-6 text-center"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-3">
                <QrCode className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-black text-foreground">{selectedStudentForQr.name}</h3>
              <p className="text-xs font-mono text-primary font-bold">{selectedStudentForQr.studentId}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{selectedStudentForQr.school}</p>

              {/* Digital QR Graphic */}
              <div className="my-5 mx-auto w-48 aspect-square rounded-2xl border-2 border-primary/30 p-3 bg-white flex flex-col items-center justify-center shadow-lg">
                <QrCode className="h-36 w-36 text-black" />
              </div>

              <div className="text-[11px] text-muted-foreground mb-4">
                Scan at hall entrance gate for instant sub-second verification and parent SMS alert.
              </div>

              <button
                onClick={() => {
                  toast.success("QR ID Card dispatched to student's guardian WhatsApp!");
                  setSelectedStudentForQr(null);
                }}
                className="w-full rounded-xl bg-gradient-to-r from-primary to-violet-600 py-2.5 text-xs font-bold text-white shadow-md shadow-primary/25"
              >
                Send Digital ID to WhatsApp
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AnimatedPage>
  );
}
