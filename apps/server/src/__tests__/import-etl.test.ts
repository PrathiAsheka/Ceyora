import assert from "node:assert";
import { describe, test } from "node:test";
import {
  normalizeSriLankanPhone,
  studentImportRowSchema,
} from "../routes/import";

describe("Data Import ETL & Sri Lankan Phone Normalization Suite", () => {
  test("normalizes standard local 10-digit Sri Lankan mobile numbers", () => {
    const res1 = normalizeSriLankanPhone("0771234567");
    assert.strictEqual(res1.normalized, "+94771234567");
    assert.ok(res1.warning?.includes("+94"));

    const res2 = normalizeSriLankanPhone("0719876543");
    assert.strictEqual(res2.normalized, "+94719876543");
  });

  test("normalizes 9-digit numbers missing leading zero", () => {
    const res = normalizeSriLankanPhone("771234567");
    assert.strictEqual(res.normalized, "+94771234567");
    assert.ok(res.warning?.includes("auto-prepended"));
  });

  test("preserves and cleans already internationalized numbers with formatting", () => {
    const res1 = normalizeSriLankanPhone("+94 77 123 4567");
    assert.strictEqual(res1.normalized, "+94771234567");

    const res2 = normalizeSriLankanPhone("+94 (71) 987-6543");
    assert.strictEqual(res2.normalized, "+94719876543");
  });

  test("validates valid student import record schema", () => {
    const validRow = {
      name: "Kasun Bandara",
      parent_name: "Sunil Bandara",
      parent_phone: "+94771234567",
      school: "Ananda College",
      date_of_birth: "2008-05-14",
    };

    const parsed = studentImportRowSchema.safeParse(validRow);
    assert.strictEqual(parsed.success, true);
    if (parsed.success) {
      assert.strictEqual(parsed.data.name, "Kasun Bandara");
      assert.strictEqual(parsed.data.parent_phone, "+94771234567");
    }
  });

  test("rejects malformed student import record missing mandatory fields", () => {
    const missingName = {
      name: "",
      parent_name: "Sunil Bandara",
      parent_phone: "+94771234567",
    };
    assert.strictEqual(studentImportRowSchema.safeParse(missingName).success, false);

    const invalidPhone = {
      name: "Kasun Bandara",
      parent_name: "Sunil Bandara",
      parent_phone: "123", // Too short
    };
    assert.strictEqual(studentImportRowSchema.safeParse(invalidPhone).success, false);
  });
});
