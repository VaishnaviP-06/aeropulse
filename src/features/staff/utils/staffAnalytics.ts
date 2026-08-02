import type { StaffShift } from "../../../types/staff.types";

/**
 * staff_shifts.csv models a single Ops/Agent workforce segment —
 * department, role, terminal, base_location, shift length, overtime and
 * language are constant across all 600 rows. supervisor_id doesn't match
 * any staff_id in this file, and the two shift timestamps don't reliably
 * order against shift_date or each other, so neither is treated as a
 * join key or used to derive duration. KPIs below lean on what genuinely
 * varies: staff roster size, shift date spread, and certification dates.
 */

export function getTotalStaff(shifts: StaffShift[]) {
  return new Set(shifts.map((s) => s.staff_id)).size;
}

export function getActiveShiftDates(shifts: StaffShift[]) {
  return new Set(shifts.map((s) => s.shift_date)).size;
}

export function getOvertimeCount(shifts: StaffShift[]) {
  return shifts.filter(
    (s) => s.overtime === true || String(s.overtime) === "True"
  ).length;
}

export function getLanguageCoverage(shifts: StaffShift[]) {
  return new Set(shifts.map((s) => s.primary_language)).size;
}

/**
 * Most recently scheduled shifts by shift_date — a rolling roster feed.
 */
export function getRecentShifts(shifts: StaffShift[], limit = 6): StaffShift[] {
  return [...shifts]
    .sort(
      (a, b) => new Date(b.shift_date).getTime() - new Date(a.shift_date).getTime()
    )
    .slice(0, limit);
}
