import assert from "node:assert";
import { describe, test } from "node:test";
import {
  currentPeriod,
  daysPastDue,
  dueDateFor,
  isDay,
  isPeriod,
  nextPeriod,
  sessionDates,
  weekdayIndex,
} from "../lib/calendar";

describe("Tuition Calendar & Weekly Session Engine Suite", () => {
  test("identifies weekday names and abbreviations correctly", () => {
    assert.strictEqual(weekdayIndex("Sunday"), 0);
    assert.strictEqual(weekdayIndex("sun"), 0);
    assert.strictEqual(weekdayIndex("Monday"), 1);
    assert.strictEqual(weekdayIndex("Wednesday"), 3);
    assert.strictEqual(weekdayIndex("Saturday"), 6);
    assert.strictEqual(weekdayIndex("sat"), 6);
    // Unknown defaults to Monday (1)
    assert.strictEqual(weekdayIndex("unknown_day"), 1);
    assert.strictEqual(weekdayIndex(undefined), 1);
  });

  test("calculates accurate session dates for weekend tuition batches", () => {
    // October 2026:
    // Oct 1 is Thursday.
    // Saturdays (6): Oct 3, 10, 17, 24, 31 (5 sessions)
    // Sundays (0): Oct 4, 11, 18, 25 (4 sessions)
    const saturdays = sessionDates(2026, 10, 6);
    assert.strictEqual(saturdays.length, 5);
    assert.deepStrictEqual(saturdays, [
      "2026-10-03",
      "2026-10-10",
      "2026-10-17",
      "2026-10-24",
      "2026-10-31",
    ]);

    const sundays = sessionDates(2026, 10, 0);
    assert.strictEqual(sundays.length, 4);
    assert.deepStrictEqual(sundays, [
      "2026-10-04",
      "2026-10-11",
      "2026-10-18",
      "2026-10-25",
    ]);
  });

  test("calculates next billing period correctly including year turnover", () => {
    assert.strictEqual(nextPeriod("2026-01"), "2026-02");
    assert.strictEqual(nextPeriod("2026-09"), "2026-10");
    assert.strictEqual(nextPeriod("2026-12"), "2027-01");
  });

  test("computes cut-off due date and clamps to last day of month", () => {
    // Standard 31-day month
    assert.strictEqual(dueDateFor("2026-10", 10), "2026-10-10");
    assert.strictEqual(dueDateFor("2026-10", 15), "2026-10-15");

    // Clamping to month boundary: 30-day month (April)
    assert.strictEqual(dueDateFor("2026-04", 31), "2026-04-30");

    // Clamping in February (2026 is non-leap year: 28 days)
    assert.strictEqual(dueDateFor("2026-02", 30), "2026-02-28");

    // Leap year February (2028: 29 days)
    assert.strictEqual(dueDateFor("2028-02", 30), "2028-02-29");
  });

  test("validates period format and day format strictly", () => {
    assert.strictEqual(isPeriod("2026-10"), true);
    assert.strictEqual(isPeriod("2026-01"), true);
    assert.strictEqual(isPeriod("2026-13"), false); // Invalid month
    assert.strictEqual(isPeriod("2026-0"), false);
    assert.strictEqual(isPeriod("invalid"), false);

    assert.strictEqual(isDay("2026-10-15"), true);
    assert.strictEqual(isDay("2026-10-5"), false); // Needs 2 digits
    assert.strictEqual(isDay("2026/10/15"), false);
  });
});
