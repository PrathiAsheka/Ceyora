import assert from "node:assert";
import { describe, test } from "node:test";
import {
  slotHours,
  teacherEarnings,
  teacherRateLabel,
  type EarningsData,
} from "../services/payroll";
import type { Class, Teacher } from "../dto";

describe("Faculty Remittance & Teacher Payroll Calculation Suite", () => {
  test("computes accurate class duration from various time slot formats", () => {
    // 8:30 to 13:00 = 4.5 hours (Sri Lankan tuition morning session)
    assert.strictEqual(slotHours("08:30 - 13:00"), 4.5);
    assert.strictEqual(slotHours("08.30 - 13.00"), 4.5);

    // 8:00 to 10:00 = 2 hours
    assert.strictEqual(slotHours("08:00 - 10:00"), 2);

    // 13:30 to 17:30 = 4 hours
    assert.strictEqual(slotHours("13:30 - 17:30"), 4);

    // Fallback for unparseable format
    assert.strictEqual(slotHours("TBD / Flexible"), 2);
  });

  test("generates human-readable compensation rate descriptions", () => {
    const teacherPct: Teacher = {
      id: "tea-1",
      institute_id: "inst-1",
      first_name: "Dilantha",
      last_name: "Fernando",
      phone: "+94777123456",
      subjects: ["Combined Mathematics"],
      compensation_type: "percentage",
      compensation_value: 80,
      created_at: "2026-01-01",
    };

    const teacherFlat: Teacher = {
      id: "tea-2",
      institute_id: "inst-1",
      first_name: "Nimal",
      last_name: "Siriwardena",
      phone: "+94768901234",
      subjects: ["Chemistry"],
      compensation_type: "flat_student",
      compensation_value: 2400,
      created_at: "2026-01-01",
    };

    const teacherHourly: Teacher = {
      id: "tea-3",
      institute_id: "inst-1",
      first_name: "Rashmi",
      last_name: "Jayathilake",
      phone: "+94783334455",
      subjects: ["Physics"],
      compensation_type: "hourly_rate",
      compensation_value: 3500,
      created_at: "2026-01-01",
    };

    assert.strictEqual(teacherRateLabel(teacherPct), "80% of class fees");
    assert.strictEqual(teacherRateLabel(teacherFlat), "Rs 2,400 / student");
    assert.strictEqual(teacherRateLabel(teacherHourly), "Rs 3,500 / hour");
  });

  test("computes percentage-based teacher earnings accurately", () => {
    const teacher: Teacher = {
      id: "tea-1",
      institute_id: "inst-1",
      first_name: "Dilantha",
      last_name: "Fernando",
      phone: "+94777123456",
      subjects: ["Combined Mathematics"],
      compensation_type: "percentage",
      compensation_value: 80, // 80% to teacher
      created_at: "2026-01-01",
    };

    const klass: Class = {
      id: "cls-1",
      institute_id: "inst-1",
      teacher_id: "tea-1",
      subject_id: "sub-1",
      name: "A/L Combined Mathematics 2026",
      student_count: 100,
      day_of_week: "Saturday",
      time_slot: "08:30 - 13:00",
      monthly_fee: 4500,
      medium: "sinhala",
      created_at: "2026-01-01",
    };

    const earningsData: EarningsData = {
      classes: [klass],
      students: new Map([["cls-1", 100]]), // 100 enrolled students
      billed: new Map([["cls-1", 450000]]), // LKR 450,000 billed
    };

    const lines = teacherEarnings(teacher, "2026-10", earningsData);
    assert.strictEqual(lines.length, 1);
    assert.strictEqual(lines[0].fee_base, 450000);
    // 80% of 450,000 = 360,000
    assert.strictEqual(lines[0].amount, 360000);
  });

  test("computes flat per-student teacher earnings accurately", () => {
    const teacher: Teacher = {
      id: "tea-2",
      institute_id: "inst-1",
      first_name: "Nimal",
      last_name: "Siriwardena",
      phone: "+94768901234",
      subjects: ["Chemistry"],
      compensation_type: "flat_student",
      compensation_value: 2400, // LKR 2400 per student
      created_at: "2026-01-01",
    };

    const klass: Class = {
      id: "cls-2",
      institute_id: "inst-1",
      teacher_id: "tea-2",
      subject_id: "sub-2",
      name: "A/L Chemistry 2026",
      student_count: 80,
      day_of_week: "Saturday",
      time_slot: "13:30 - 17:30",
      monthly_fee: 4200,
      medium: "sinhala",
      created_at: "2026-01-01",
    };

    const earningsData: EarningsData = {
      classes: [klass],
      students: new Map([["cls-2", 80]]), // 80 students
      billed: new Map([["cls-2", 336000]]),
    };

    const lines = teacherEarnings(teacher, "2026-10", earningsData);
    assert.strictEqual(lines.length, 1);
    // 80 students * 2400 = 192,000
    assert.strictEqual(lines[0].amount, 192000);
    assert.strictEqual(lines[0].students, 80);
  });
});
