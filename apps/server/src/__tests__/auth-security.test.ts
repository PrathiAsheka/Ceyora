import assert from "node:assert";
import { test, describe } from "node:test";
import {
  hashPassword,
  verifyPassword,
  newToken,
  sha256,
  newAccessCode,
} from "../auth/crypto";
import {
  normalizeCode,
  normalizeUsername,
  passwordProblem,
  sanitizePermissions,
  usernameProblem,
} from "../auth/permissions";

describe("Authentication & Cyber Security Test Suite", () => {
  test("hashes passwords with PBKDF2-SHA256 and verifies correctly", async () => {
    const rawPass = "CeyoraSecret2026!";
    const hashed = await hashPassword(rawPass);

    assert.ok(hashed.startsWith("pbkdf2$120000$"), "Hash must use PBKDF2 with 120,000 iterations");

    const valid = await verifyPassword(rawPass, hashed);
    assert.strictEqual(valid, true, "Verification should succeed with matching password");

    const invalid = await verifyPassword("WrongPassword123", hashed);
    assert.strictEqual(invalid, false, "Verification should fail with wrong password");
  });

  test("generates secure session tokens and verifies SHA-256 integrity", () => {
    const token1 = newToken();
    const token2 = newToken();

    assert.strictEqual(typeof token1, "string");
    assert.strictEqual(token1.length, 64);
    assert.notStrictEqual(token1, token2, "Session tokens must be cryptographically random and unique");

    const hash = sha256(token1);
    assert.strictEqual(hash.length, 64);
    assert.strictEqual(hash, sha256(token1), "SHA-256 hash must be deterministic");
  });

  test("validates username constraints and sanitizes input", () => {
    assert.strictEqual(usernameProblem("admin"), null);
    assert.strictEqual(usernameProblem("super_admin_2026"), null);
    assert.notStrictEqual(usernameProblem("a"), null, "Too short username should be rejected");
    assert.notStrictEqual(usernameProblem("user with spaces"), null, "Spaces in username should be rejected");

    assert.strictEqual(normalizeUsername("  AdminUser_LK  "), "adminuser_lk");
  });

  test("enforces password complexity constraints", () => {
    assert.strictEqual(passwordProblem("StrongPass123!"), null);
    assert.notStrictEqual(passwordProblem("short"), null, "Passwords under 8 chars must be rejected");
  });

  test("generates and normalizes human-readable access codes", () => {
    const { display, normalized } = newAccessCode();
    assert.ok(display.includes("-"), "Access codes should use readable hyphen format");
    assert.strictEqual(normalizeCode(display), normalized);
  });

  test("sanitizes permissions to recognized scopes only", () => {
    const mixed = ["students.view", "fees.collect", "MALICIOUS_INJECTION_SCOPE", "admin.hack"] as any;
    const sanitized = sanitizePermissions(mixed);

    assert.ok(sanitized.includes("students.view"));
    assert.ok(sanitized.includes("fees.collect"));
    assert.ok(!sanitized.includes("MALICIOUS_INJECTION_SCOPE" as any));
  });
});
