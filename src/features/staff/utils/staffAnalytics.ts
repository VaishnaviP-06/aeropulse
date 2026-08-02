import type { StaffShift } from "../../../types/staff.types";

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

export function getRecentShifts(shifts: StaffShift[], limit = 6): StaffShift[] {
  return [...shifts]
    .sort(
      (a, b) => new Date(b.shift_date).getTime() - new Date(a.shift_date).getTime()
    )
    .slice(0, limit);
}
