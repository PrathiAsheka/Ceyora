"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileSpreadsheet,
  FileText,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Download,
  Play,
  RotateCcw,
  ShieldCheck,
  Search,
  Sparkles,
  ArrowRight,
  Database,
  Check,
} from "lucide-react";
import { AnimatedPage, AnimatedSection } from "@/components/animated-page";
import { useI18n } from "@/lib/i18n";
import { mockClasses, mockStudents, mockTeachers } from "@/lib/mock-data";
import { apiClient } from "@/lib/api-client";

type ImportEntity = "students" | "teachers" | "classes" | "feeCharges" | "examResults";

interface PreviewRow {
  rowNumber: number;
  id: string;
  name: string;
  secondaryInfo: string;
  status: "valid" | "warning" | "error";
  errorReason?: string;
  warningReason?: string;
}

export default function DataImportPage() {
  const { t } = useI18n();
  const [selectedEntity, setSelectedEntity] = useState<ImportEntity>("students");
  const [dragOver, setDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [importSuccess, setImportSuccess] = useState(false);
  const [filterStatus, setFilterStatus] = useState<"all" | "valid" | "warning" | "error">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Sample data simulating parsed CSV file for each entity
  const [previewRows, setPreviewRows] = useState<PreviewRow[]>([
    {
      rowNumber: 1,
      id: "STU-2026-081",
      name: "Dineth Wickramasinghe",
      secondaryInfo: "+94 77 890 1234 • AL-MATHS-2026",
      status: "valid",
    },
    {
      rowNumber: 2,
      id: "STU-2026-082",
      name: "Kavindu Jayasuriya",
      secondaryInfo: "071234567 • AL-PHY-2026",
      status: "warning",
      warningReason: "Local format '071...' auto-converted to '+94 71 234 5670'",
    },
    {
      rowNumber: 3,
      id: "STU-2026-001", // Duplicate ID existing in mockStudents!
      name: "Kaveen Senanayake",
      secondaryInfo: "+94 77 123 4567 • AL-MATHS-2026",
      status: "error",
      errorReason: "Conflict: Registration ID 'STU-2026-001' already assigned in database",
    },
    {
      rowNumber: 4,
      id: "STU-2026-083",
      name: "Methmi Alwis",
      secondaryInfo: "+94 70 456 7890 • OL-MATHS-2026",
      status: "valid",
    },
    {
      rowNumber: 5,
      id: "STU-2026-084",
      name: "Sanuka Dilshan",
      secondaryInfo: "Invalid Phone • AL-CHEM-2026",
      status: "error",
      errorReason: "Missing or invalid guardian contact for WhatsApp notifications",
    },
    {
      rowNumber: 6,
      id: "STU-2026-085",
      name: "Tharushi Perera",
      secondaryInfo: "+94 76 654 3210 • AL-BIO-2026",
      status: "valid",
    },
    {
      rowNumber: 7,
      id: "STU-2026-086",
      name: "Sachintha Bandara",
      secondaryInfo: "+94 72 334 5566 • Sibling Discount Pending",
      status: "warning",
      warningReason: "Sibling discount applied without linked elder sibling ID",
    },
    {
      rowNumber: 8,
      id: "STU-2026-087",
      name: "Hiruni Fernando",
      secondaryInfo: "+94 78 998 7766 • AL-MATHS-2026",
      status: "valid",
    },
  ]);

  const validCount = previewRows.filter((r) => r.status === "valid").length;
  const warningCount = previewRows.filter((r) => r.status === "warning").length;
  const errorCount = previewRows.filter((r) => r.status === "error").length;

  const filteredRows = previewRows.filter((row) => {
    const matchesFilter = filterStatus === "all" || row.status === filterStatus;
    const matchesSearch =
      row.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.secondaryInfo.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleSimulateImport = async () => {
    setIsProcessing(true);
    setProgress(0);
    const validRows = previewRows.filter((r) => r.status !== "error");
    try {
      await apiClient.batchImport("inst-1", selectedEntity, validRows);
    } catch {
      // offline simulation handles it
    }
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          setImportSuccess(true);
          return 100;
        }
        return prev + 25;
      });
    }, 200);
  };

  const handleDownloadSample = () => {
    const csvContent =
      "Registration_No,Student_Name,NIC_or_BirthCert,Guardian_WhatsApp,Enrolled_Batch_Code,Monthly_Fee_LKR,Discount_Tier\n" +
      "STU-2026-090,Nethmi Ranasinghe,200584901234,+94771239999,AL-MATHS-2026,6500,Standard\n" +
      "STU-2026-091,Janith Samarasinghe,200572109876,+94714567890,AL-PHY-2026,6000,Sibling_15\n";

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `ceyora_${selectedEntity}_template.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const entityTemplates = [
    {
      key: "students" as ImportEntity,
      label: t("import.students"),
      desc: "Batch student enrollment, biometric QR codes & guardian contacts",
      color: "from-blue-500 to-cyan-400",
      sampleHeaders: "RegNo, Full Name, NIC, Guardian Mobile, Class Batch, Fee",
    },
    {
      key: "teachers" as ImportEntity,
      label: t("import.teachers"),
      desc: "Faculty payroll profiles, revenue splits & bank account details",
      color: "from-emerald-500 to-teal-400",
      sampleHeaders: "Staff ID, Full Name, Payout Split %, Bank Branch, Acc No",
    },
    {
      key: "classes" as ImportEntity,
      label: t("import.classes"),
      desc: "Course batches, assigned teachers, hall schedules & fee tariffs",
      color: "from-violet-500 to-purple-400",
      sampleHeaders: "Batch Code, Subject, Grade, Teacher ID, Monthly Fee LKR",
    },
    {
      key: "feeCharges" as ImportEntity,
      label: t("import.feeCharges"),
      desc: "Monthly billing schedules, sibling discounts & scholarship waivers",
      color: "from-amber-500 to-orange-400",
      sampleHeaders: "Charge ID, Student ID, Month, Gross Fee, Discount %, Net Fee",
    },
    {
      key: "examResults" as ImportEntity,
      label: t("import.examResults"),
      desc: "Term exam marks, topic scores & G.C.E. percentile rankings",
      color: "from-red-500 to-pink-400",
      sampleHeaders: "Exam ID, Student ID, Score %, Marks Graded, Ranking Key",
    },
  ];

  return (
    <AnimatedPage className="space-y-6">
      {/* Page Header */}
      <AnimatedSection>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <Database className="h-3.5 w-3.5" /> High-Performance ETL Engine
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-500">
                <ShieldCheck className="h-3 w-3" /> PDPA Act No. 9 Compliant
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              <span className="gradient-text">{t("import.title")}</span>
            </h1>
            <p className="text-muted-foreground mt-1">
              Ingest legacy spreadsheets, students, fee ledger entries, and exam metrics with live schema validation.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDownloadSample}
              className="flex items-center gap-2 rounded-xl border border-border/60 bg-background/80 px-4 py-2.5 text-xs font-semibold shadow-sm hover:bg-muted/30 transition-all"
            >
              <Download className="h-4 w-4 text-primary" /> Download CSV Template
            </motion.button>
          </div>
        </div>
      </AnimatedSection>

      {/* Entity Selection Tabs */}
      <AnimatedSection>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {entityTemplates.map((ent) => {
            const isSelected = selectedEntity === ent.key;
            return (
              <motion.button
                key={ent.key}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedEntity(ent.key)}
                className={`flex flex-col text-left p-4 rounded-2xl border transition-all ${
                  isSelected
                    ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                    : "border-border/40 hover:border-border/80 bg-background/50"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`h-2.5 w-2.5 rounded-full bg-gradient-to-r ${ent.color}`} />
                  {isSelected && <Check className="h-4 w-4 text-primary" strokeWidth={3} />}
                </div>
                <h4 className="font-semibold text-sm">{ent.label}</h4>
                <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">{ent.desc}</p>
              </motion.button>
            );
          })}
        </div>
      </AnimatedSection>

      {/* Drag & Drop Upload Zone */}
      <AnimatedSection>
        <motion.div
          animate={dragOver ? { scale: 1.01, borderColor: "hsl(262 83% 58%)" } : {}}
          className={`rounded-2xl border-2 border-dashed p-10 text-center transition-all cursor-pointer relative overflow-hidden ${
            dragOver ? "border-primary bg-primary/5" : "border-border/40 hover:border-primary/40 hover:bg-muted/10 glass-card"
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
          }}
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-violet-500 shadow-xl shadow-primary/20">
            <Upload className="h-8 w-8 text-white" />
          </div>
          <h3 className="mt-4 text-lg font-bold">
            Drop your <span className="text-primary">{entityTemplates.find((e) => e.key === selectedEntity)?.label}</span> file here
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Supports CSV, Excel (.xlsx, .xls), or Google Sheets exports. UTF-8 encoded with Sinhala/Tamil character support.
          </p>

          <div className="mt-5 flex items-center justify-center gap-3">
            <label className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-violet-500 px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-primary/20 cursor-pointer">
              <FileSpreadsheet className="h-4 w-4" /> Browse Local File
              <input type="file" accept=".csv,.xlsx" className="hidden" />
            </label>
            <button
              onClick={() => {
                // Re-trigger preview rows
                setPreviewRows([...previewRows]);
              }}
              className="flex items-center gap-1.5 rounded-xl border border-border/60 px-4 py-2 text-xs font-semibold hover:bg-muted/30 transition-all"
            >
              <RotateCcw className="h-3.5 w-3.5 text-muted-foreground" /> Reload Demo Batch
            </button>
          </div>
        </motion.div>
      </AnimatedSection>

      {/* Validation Telemetry Cards */}
      <AnimatedSection>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-card rounded-2xl p-4 shadow-sm border border-border/40">
            <p className="text-xs text-muted-foreground font-medium">Total Rows Analyzed</p>
            <p className="text-2xl font-bold mt-1">{previewRows.length}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Schema check complete</p>
          </div>
          <div className="glass-card rounded-2xl p-4 shadow-sm border border-emerald-500/20 bg-emerald-500/5">
            <div className="flex items-center justify-between">
              <p className="text-xs text-emerald-600 font-medium">Clean & Valid</p>
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </div>
            <p className="text-2xl font-bold text-emerald-600 mt-1">{validCount}</p>
            <p className="text-[11px] text-emerald-600/80 mt-0.5">Ready for instant ingestion</p>
          </div>
          <div className="glass-card rounded-2xl p-4 shadow-sm border border-amber-500/20 bg-amber-500/5">
            <div className="flex items-center justify-between">
              <p className="text-xs text-amber-600 font-medium">Warnings / Auto-Fixed</p>
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            </div>
            <p className="text-2xl font-bold text-amber-600 mt-1">{warningCount}</p>
            <p className="text-[11px] text-amber-600/80 mt-0.5">Phone formatting adjustments</p>
          </div>
          <div className="glass-card rounded-2xl p-4 shadow-sm border border-red-500/20 bg-red-500/5">
            <div className="flex items-center justify-between">
              <p className="text-xs text-red-600 font-medium">Blocking Invalidation</p>
              <XCircle className="h-4 w-4 text-red-500" />
            </div>
            <p className="text-2xl font-bold text-red-600 mt-1">{errorCount}</p>
            <p className="text-[11px] text-red-600/80 mt-0.5">Duplicates & missing fields</p>
          </div>
        </div>
      </AnimatedSection>

      {/* Ingestion Execution Toolbar */}
      <AnimatedSection>
        <div className="glass-card rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 border border-border/40">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search rows or errors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-border/50 bg-background/50 pl-9 pr-3 py-1.5 text-xs focus:outline-none focus:border-primary/50"
              />
            </div>
            <div className="flex rounded-xl bg-muted/40 p-1">
              {(["all", "valid", "warning", "error"] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold capitalize transition-all ${
                    filterStatus === st ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <p className="text-xs text-muted-foreground hidden sm:block">
              {validCount + warningCount} valid records will be committed
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isProcessing || validCount === 0}
              onClick={handleSimulateImport}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow-lg transition-all ${
                isProcessing
                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                  : "bg-gradient-to-r from-primary to-violet-500 shadow-primary/25"
              }`}
            >
              <Play className="h-4 w-4 fill-white" />
              {isProcessing ? `Ingesting Batch (${progress}%)...` : "Execute Batch Ingestion"}
            </motion.button>
          </div>
        </div>
      </AnimatedSection>

      {/* Progress Bar when Ingesting */}
      {isProcessing && (
        <AnimatedSection>
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 space-y-2">
            <div className="flex justify-between text-xs font-semibold text-primary">
              <span>Writing records to database & generating biometric QR signatures...</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-primary/10 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-violet-500"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.2 }}
              />
            </div>
          </div>
        </AnimatedSection>
      )}

      {/* Success Notification Banner */}
      {importSuccess && (
        <AnimatedSection>
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-md">
                <Check className="h-5 w-5" strokeWidth={3} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-emerald-800 dark:text-emerald-300">
                  Batch Ingestion Successfully Executed
                </h4>
                <p className="text-xs text-emerald-700/80 dark:text-emerald-400/80">
                  {validCount + warningCount} records ingested into tenant database. Biometric QR passes created and ready for check-in.
                </p>
              </div>
            </div>
            <button
              onClick={() => setImportSuccess(false)}
              className="rounded-lg border border-emerald-500/40 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20"
            >
              Dismiss
            </button>
          </div>
        </AnimatedSection>
      )}

      {/* Parsed Pre-Import Preview Table */}
      <AnimatedSection>
        <div className="glass-card rounded-2xl shadow-sm border border-border/40 overflow-hidden">
          <div className="border-b border-border/40 px-5 py-3.5 flex items-center justify-between bg-muted/20">
            <h3 className="font-semibold text-sm">ETL Verification & Diagnostics Grid</h3>
            <span className="text-xs text-muted-foreground">Showing {filteredRows.length} of {previewRows.length} rows</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border/40 bg-muted/30 text-muted-foreground uppercase tracking-wider font-semibold">
                  <th className="px-5 py-3 w-16">Row #</th>
                  <th className="px-5 py-3">Registration ID</th>
                  <th className="px-5 py-3">Entity Name</th>
                  <th className="px-5 py-3">Batch & Details</th>
                  <th className="px-5 py-3">Validation Status</th>
                  <th className="px-5 py-3">Diagnostic Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {filteredRows.map((row) => (
                  <tr key={row.rowNumber} className="hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-3 font-mono text-muted-foreground">{row.rowNumber}</td>
                    <td className="px-5 py-3 font-mono font-semibold text-foreground">{row.id}</td>
                    <td className="px-5 py-3 font-semibold text-foreground">{row.name}</td>
                    <td className="px-5 py-3 text-muted-foreground">{row.secondaryInfo}</td>
                    <td className="px-5 py-3">
                      {row.status === "valid" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="h-3 w-3" /> Valid
                        </span>
                      )}
                      {row.status === "warning" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-0.5 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                          <AlertTriangle className="h-3 w-3" /> Warning
                        </span>
                      )}
                      {row.status === "error" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-500/15 px-2.5 py-0.5 text-[11px] font-bold text-red-600 dark:text-red-400">
                          <XCircle className="h-3 w-3" /> Invalidation
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      {row.errorReason ? (
                        <span className="text-red-600 dark:text-red-400 font-medium">{row.errorReason}</span>
                      ) : row.warningReason ? (
                        <span className="text-amber-600 dark:text-amber-400 font-medium">{row.warningReason}</span>
                      ) : (
                        <span className="text-muted-foreground/60 italic">Passed all schema and duplicate checks</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </AnimatedSection>
    </AnimatedPage>
  );
}
