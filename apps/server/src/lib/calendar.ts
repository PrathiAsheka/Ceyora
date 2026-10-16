/** Weekly-session helpers (same rules as apps/web/lib/attendance-calendar.ts). */

const WEEKDAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const WEEKDAY_INDEX: Record<string, number> = {};
WEEKDAY_NAMES.forEach((name, index) => {
  WEEKDAY_INDEX[name.toLowerCase()] = index;
  WEEKDAY_INDEX[name.slice(0, 3).toLowerCase()] = index;
});

/** Weekday index for a class's `day_of_week`; unknown values fall back to Monday. */
export const weekdayIndex = (dayOfWeek?: string) =>
  dayOfWeek ? (WEEKDAY_INDEX[dayOfWeek.trim().toLowerCase()] ?? 1) : 1;

/** Every "YYYY-MM-DD" in the month that falls on `weekday` (0 = Sunday). */
export function sessionDates(year: number, month: number, weekday: number): string[] {
  const total = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const dates: string[] = [];
  for (let d = 1; d <= total; d++) {
    if (new Date(Date.UTC(year, month - 1, d)).getUTCDay() === weekday) {
      dates.push(`${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`);
    }
  }
  return dates;
}

/** Current billing cycle, "YYYY-MM" (UTC). */
export const currentPeriod = () => new Date().toISOString().slice(0, 7);

/** "YYYY-MM" one month after `period`. */
export function nextPeriod(period: string): string {
  const [y, m] = period.split("-").map(Number);
  return `${m === 12 ? y + 1 : y}-${String(m === 12 ? 1 : m + 1).padStart(2, "0")}`;
}

/** Due date for a cycle on the institute's cut-off day, clamped to the month. */
export function dueDateFor(period: string, cutOffDay: number): string {
  const [year, month] = period.split("-").map(Number);
  const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const d = Math.min(Math.max(1, cutOffDay || 10), lastDay);
  return `${period}-${String(d).padStart(2, "0")}`;
}

/** Whole days a "YYYY-MM-DD" due date is in the past (0 when not yet due). */
export const daysPastDue = (due: string) =>
  Math.max(0, Math.floor((Date.now() - new Date(due).getTime()) / 86_400_000));

export const isPeriod = (value: unknown): value is string =>
  typeof value === "string" && /^\d{4}-(0[1-9]|1[0-2])$/.test(value);
export const isDay = (value: unknown): value is string =>
  typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
