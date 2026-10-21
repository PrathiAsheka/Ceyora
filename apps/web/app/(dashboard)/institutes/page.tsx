"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Plus,
  Search,
  Filter,
  Users,
  GraduationCap,
  DollarSign,
  MapPin,
  Phone,
  Mail,
  ChevronRight,
  CreditCard,
  Calendar,
  CheckCircle2,
  Clock,
  X,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import { AnimatedPage, AnimatedSection } from "@/components/animated-page";
import { mockInstitutes, InstituteData } from "@/lib/mock-data";
import { useInstituteStore } from "@/stores/institute-store";
import Link from "next/link";
import toast from "react-hot-toast";

export default function InstitutesPage() {
  const { selectedInstituteId, setSelectedInstituteId } = useInstituteStore();
  const [institutes, setInstitutes] = useState<InstituteData[]>(mockInstitutes);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [newName, setNewName] = useState("");
  const [newCity, setNewCity] = useState("Colombo");
  const [newPhone, setNewPhone] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newCutOff, setNewCutOff] = useState(10);

  const filteredInstitutes = institutes.filter(
    (inst) =>
      inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddInstitute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) {
      toast.error("Please enter institute name");
      return;
    }

    const codeSlug = newCity.substring(0, 3).toUpperCase();
    const newRecord: InstituteData = {
      id: "inst-" + (institutes.length + 1),
      name: newName,
      code: `APEX-${codeSlug}`,
      city: newCity,
      address: `Main Campus, ${newCity}`,
      phone: newPhone || "+94 11 200 0000",
      email: newEmail || "branch@apexedu.lk",
      branchesCount: 1,
      activeStudents: 0,
      activeClasses: 0,
      monthlyRevenue: 0,
      billingCutOffDay: newCutOff,
      gatewayStatus: "testing",
      currency: "LKR",
      status: "active",
    };

    setInstitutes([...institutes, newRecord]);
    setIsAddModalOpen(false);
    setNewName("");
    setNewPhone("");
    setNewEmail("");
    toast.success(`Institute branch ${newRecord.name} provisioned!`);
  };

  const totalStudents = institutes.reduce((acc, i) => acc + i.activeStudents, 0);
  const totalRevenue = institutes.reduce((acc, i) => acc + i.monthlyRevenue, 0);
  const totalClasses = institutes.reduce((acc, i) => acc + i.activeClasses, 0);

  return (
    <AnimatedPage className="space-y-6">
      {/* Header */}
      <AnimatedSection>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-[11px] font-bold text-emerald-500 uppercase tracking-widest">
                Multi-Branch Network Architecture
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
              Institutes & <span className="gradient-text">Branches</span>
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Centralized telemetry, billing cut-off schedules, and campus operations across Sri Lanka.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-violet-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow"
          >
            <Plus className="h-4 w-4" />
            Provision New Branch
          </motion.button>
        </div>
      </AnimatedSection>

      {/* Cross-Network Telemetry Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AnimatedSection>
          <div className="glass-card rounded-2xl p-5 border border-border/60">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground uppercase">Campus Campuses</span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                <Building2 className="h-4 w-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-foreground mt-2">{institutes.length} Locations</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Autonomous RLS Tenant Isolation</p>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div className="glass-card rounded-2xl p-5 border border-border/60">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground uppercase">Network Enrollment</span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-emerald-500 mt-2">{totalStudents.toLocaleString()}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Active biometric QR cardholders</p>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div className="glass-card rounded-2xl p-5 border border-border/60">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground uppercase">Total Batches</span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10 text-violet-500">
                <GraduationCap className="h-4 w-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-foreground mt-2">{totalClasses} Active Classes</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">O/L & A/L Science & Commerce</p>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div className="glass-card rounded-2xl p-5 border border-border/60">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground uppercase">Network Turnover</span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                <DollarSign className="h-4 w-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-foreground mt-2">LKR {(totalRevenue / 1000000).toFixed(2)}M</p>
            <p className="text-[11px] text-emerald-500 font-semibold mt-0.5">+16.4% YoY Growth</p>
          </div>
        </AnimatedSection>
      </div>

      {/* Branch List Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search branch name, code, or city..."
              className="w-full rounded-xl border border-border/60 bg-muted/30 pl-10 pr-4 py-2 text-xs font-semibold focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredInstitutes.map((inst) => (
            <AnimatedSection key={inst.id}>
              <div className="glass-card rounded-3xl p-6 border border-border/60 hover:border-primary/40 transition-all shadow-sm hover:shadow-xl flex flex-col justify-between space-y-4 group">
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                          {inst.code}
                        </span>
                        {selectedInstituteId === inst.id && (
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-md border border-emerald-500/30">
                            Active Context
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-foreground mt-1.5 group-hover:text-primary transition-colors">
                        {inst.name}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{inst.address}</span>
                      </div>
                    </div>

                    <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
                  </div>

                  {/* Branch Metrics */}
                  <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-border/40 text-center">
                    <div>
                      <p className="text-[10px] text-muted-foreground font-semibold">Students</p>
                      <p className="text-sm font-bold text-foreground">{inst.activeStudents.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground font-semibold">Classes</p>
                      <p className="text-sm font-bold text-foreground">{inst.activeClasses}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground font-semibold">Cut-off Day</p>
                      <p className="text-sm font-bold text-primary">{inst.billingCutOffDay}th of Mo.</p>
                    </div>
                  </div>

                  {/* Operational Settings Badge */}
                  <div className="mt-4 rounded-xl border border-border/40 bg-muted/20 p-2.5 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <CreditCard className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="font-semibold text-muted-foreground">PayHere Gateway</span>
                    </div>
                    <span className={`font-bold uppercase text-[9px] px-2 py-0.5 rounded-full ${
                      inst.gatewayStatus === "active" ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                    }`}>
                      {inst.gatewayStatus}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setSelectedInstituteId(inst.id);
                      toast.success(`Switched active branch to ${inst.name}`);
                    }}
                    className={`flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold transition-all ${
                      selectedInstituteId === inst.id
                        ? "bg-primary text-white shadow-md shadow-primary/25"
                        : "border border-border/60 hover:bg-muted/50 text-foreground"
                    }`}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>{selectedInstituteId === inst.id ? "Active Branch" : "Set Active"}</span>
                  </button>
                  <Link href={`/institutes/${inst.id}`}>
                    <button className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-border/60 py-2.5 text-xs font-bold text-foreground hover:bg-muted/50 transition-all">
                      <span>Hub Details</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </Link>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>

      {/* Provision Branch Modal */}
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
                  <Building2 className="h-5 w-5 text-primary" />
                  <h3 className="text-base font-bold text-foreground">Provision Institute Branch</h3>
                </div>
                <button onClick={() => setIsAddModalOpen(false)}>
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>

              <form onSubmit={handleAddInstitute} className="space-y-3.5">
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase">Branch Name</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Apex Learning Campus - Negombo"
                    className="mt-1 w-full rounded-xl border border-border/60 bg-muted/20 px-3 py-2 text-xs font-semibold focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase">City</label>
                    <select
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-border/60 bg-muted/20 px-3 py-2 text-xs font-semibold focus:outline-none focus:border-primary"
                    >
                      <option value="Colombo">Colombo</option>
                      <option value="Kandy">Kandy</option>
                      <option value="Galle">Galle</option>
                      <option value="Negombo">Negombo</option>
                      <option value="Kurunegala">Kurunegala</option>
                      <option value="Matara">Matara</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase">Billing Cut-Off Day</label>
                    <input
                      type="number"
                      min={1}
                      max={28}
                      value={newCutOff}
                      onChange={(e) => setNewCutOff(Number(e.target.value))}
                      className="mt-1 w-full rounded-xl border border-border/60 bg-muted/20 px-3 py-2 text-xs font-semibold focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase">Phone Contact</label>
                  <input
                    type="tel"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+94 11 ..."
                    className="mt-1 w-full rounded-xl border border-border/60 bg-muted/20 px-3 py-2 text-xs font-semibold focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase">Official Email</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="campus@apexedu.lk"
                    className="mt-1 w-full rounded-xl border border-border/60 bg-muted/20 px-3 py-2 text-xs font-semibold focus:outline-none focus:border-primary"
                  />
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
                    Provision Tenant
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
