import assert from "node:assert";
import { test, describe } from "node:test";
import {
  maskNic,
  maskPhone,
  pseudonymizeStudent,
  anonymizeExamRankings,
  recordAuditEntry,
  getRecentAuditLogs,
} from "../lib/pdpa";

describe("Sri Lanka PDPA Compliance & Anonymization Suite", () => {
  test("masks legacy 10-char National Identity Cards correctly", () => {
    const masked = maskNic("821450912V");
    assert.strictEqual(masked, "8214****2V");
    assert.strictEqual(masked.length, 10);
  });

  test("masks modern 12-char National Identity Cards correctly", () => {
    const masked = maskNic("200584901234");
    assert.strictEqual(masked, "2005****1234");
    assert.strictEqual(masked.length, 12);
  });

  test("masks guardian telephone numbers for privacy", () => {
    const masked = maskPhone("+94771234567");
    assert.ok(masked.includes("***"), "Masked phone must obscure central subscriber digits");
    assert.ok(masked.endsWith("567"), "Masked phone should retain last 3 digits for verification");
  });

  test("generates deterministic student pseudonyms for term leaderboards", () => {
    const token1 = pseudonymizeStudent("s1", "TERM_OCT_2026");
    const token2 = pseudonymizeStudent("s1", "TERM_OCT_2026");
    const tokenOther = pseudonymizeStudent("s2", "TERM_OCT_2026");

    assert.strictEqual(token1, token2, "Pseudonyms for same student and term must match");
    assert.notStrictEqual(token1, tokenOther, "Different students must receive distinct pseudonyms");
    assert.ok(token1.startsWith("CAND-"));
  });

  test("anonymizes exam leaderboard while preserving empirical rank order", () => {
    const rawResults = [
      { studentId: "s1", studentName: "Kavindu Perera", marks: 76.5 },
      { studentId: "s2", studentName: "Minoli Senanayake", marks: 94.0 },
      { studentId: "s3", studentName: "Dinuka Rajapaksha", marks: 88.0 },
    ];

    const anonymized = anonymizeExamRankings(rawResults);

    assert.strictEqual(anonymized.length, 3);
    assert.strictEqual(anonymized[0].marks, 94.0);
    assert.strictEqual(anonymized[0].rank, 1);
    assert.strictEqual(anonymized[0].originalMasked, true);
    assert.ok(!anonymized[0].studentName.includes("Minoli"), "Original student name must not appear in leaderboard");
    assert.ok(anonymized[0].studentName.includes("Candidate"));
  });

  test("records and retrieves high-integrity audit entries", () => {
    const entry = recordAuditEntry({
      action: "REVERSE_PAYMENT",
      entityType: "PaymentTransaction",
      entityId: "tx-test-8899",
      performedBy: "super_admin",
      clientIp: "127.0.0.1",
      details: { amount: 4500, reason: "Duplicate charge correction" },
    });

    assert.ok(entry.id.startsWith("audit_"));
    assert.strictEqual(entry.action, "REVERSE_PAYMENT");

    const recent = getRecentAuditLogs(5);
    assert.ok(recent.some((log) => log.entityId === "tx-test-8899"));
  });
});
