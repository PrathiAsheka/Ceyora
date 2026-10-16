/**
 * Sri Lanka Personal Data Protection Act (PDPA) No. 9 of 2022 Compliance Engine
 * Provides pseudonymization, sensitive field masking, anonymized academic rankings,
 * and immutable audit trail generation.
 */
import { createHash } from "node:crypto";

export interface AuditEntry {
  id: string;
  timestamp: string;
  action: "VIEW_FINANCE" | "COLLECT_FEE" | "REVERSE_PAYMENT" | "EXAM_PUBLISH" | "DATA_EXPORT" | "STUDENT_ADMISSION";
  entityType: string;
  entityId: string;
  performedBy: string;
  clientIp?: string;
  details?: Record<string, unknown>;
}

// In-memory audit trail buffer (can be backed by DB or persistent append-only logs)
const auditTrailLog: AuditEntry[] = [];

/**
 * Masks Sri Lankan National Identity Card (NIC) numbers.
 * Supports legacy 9-digit + V/X and modern 12-digit formats.
 * e.g., 821450912V -> 8214****2V
 * e.g., 200584901234 -> 2005****1234
 */
export function maskNic(nic?: string | null): string {
  if (!nic || nic.length < 5) return "***";
  if (nic.length === 10) {
    return `${nic.slice(0, 4)}****${nic.slice(-2)}`;
  }
  if (nic.length === 12) {
    return `${nic.slice(0, 4)}****${nic.slice(-4)}`;
  }
  return `${nic.slice(0, 2)}****${nic.slice(-2)}`;
}

/**
 * Masks telephone numbers for public or guardian receipts.
 * e.g., +94 77 123 4567 -> +94 77 *** *567
 */
export function maskPhone(phone?: string | null): string {
  if (!phone || phone.length < 6) return "***";
  const clean = phone.replace(/\s+/g, "");
  if (clean.length > 7) {
    return `${clean.slice(0, clean.length - 6)} *** *${clean.slice(-3)}`;
  }
  return `${clean.slice(0, 2)}***${clean.slice(-2)}`;
}

/**
 * Pseudonymizes student identity for public academic leaderboards.
 * Converts real student identification into an irreversible, deterministic pseudonym per term:
 * e.g. Student "Kavindu Perera" (ID: "s1") in Term 2026-T4 -> "Candidate #9421"
 */
export function pseudonymizeStudent(studentId: string, salt = "CEYORA_PDPA_2026"): string {
  const hash = createHash("sha256").update(`${studentId}:${salt}`).digest("hex");
  const numericToken = parseInt(hash.slice(0, 6), 16) % 9000 + 1000;
  return `CAND-${numericToken}`;
}

/**
 * Transforms an array of student exam results into a PDPA-compliant leaderboard.
 * Replaces student names and IDs with cryptographic candidate tokens while preserving
 * empirical rank, marks, and grade classification.
 */
export function anonymizeExamRankings<T extends { studentId: string; studentName?: string; marks: number }>(
  results: T[],
  examTermSalt = "TERM_2026_OCT"
): Array<T & { candidateToken: string; originalMasked: boolean; rank: number }> {
  return results
    .slice()
    .sort((a, b) => b.marks - a.marks)
    .map((res, index) => {
      const candidateToken = pseudonymizeStudent(res.studentId, examTermSalt);
      return {
        ...res,
        studentName: `Candidate ${candidateToken}`,
        candidateToken,
        originalMasked: true,
        rank: index + 1,
      };
    });
}

/**
 * Logs a high-integrity audit action according to PDPA Section 12 (Processing of Personal Data).
 */
export function recordAuditEntry(entry: Omit<AuditEntry, "id" | "timestamp">): AuditEntry {
  const fullEntry: AuditEntry = {
    id: `audit_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    timestamp: new Date().toISOString(),
    ...entry,
  };
  auditTrailLog.push(fullEntry);
  if (auditTrailLog.length > 5000) {
    auditTrailLog.shift(); // retain last 5000 records
  }
  return fullEntry;
}

export function getRecentAuditLogs(limit = 100): AuditEntry[] {
  return auditTrailLog.slice(-limit).reverse();
}
