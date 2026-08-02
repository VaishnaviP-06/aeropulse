import { useEffect, useMemo, useState } from "react";
import { useStaffStore } from "../../../store/staff.store";
import {
  getTotalStaff,
  getActiveShiftDates,
  getOvertimeCount,
  getLanguageCoverage,
  getRecentShifts,
} from "../utils/staffAnalytics";

export type StaffSortKey = "shift_date" | "staff_name" | "staff_id";

export const staffSortOptions: { value: StaffSortKey; label: string }[] = [
  { value: "shift_date", label: "Shift date" },
  { value: "staff_name", label: "Name" },
  { value: "staff_id", label: "Staff ID" },
];

export function useStaffOperations() {
  const shifts = useStaffStore((state) => state.shifts);
  const loading = useStaffStore((state) => state.loading);
  const loadStaffShifts = useStaffStore((state) => state.loadStaffShifts);

  useEffect(() => {
    loadStaffShifts();
  }, [loadStaffShifts]);

  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<StaffSortKey>("shift_date");

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    const matching = shifts.filter((shift) => {
      return (
        term.length === 0 ||
        shift.staff_id.toLowerCase().includes(term) ||
        shift.staff_name.toLowerCase().includes(term) ||
        shift.supervisor_id.toLowerCase().includes(term)
      );
    });

    return [...matching].sort((a, b) => {
      if (sortKey === "shift_date") {
        return (
          new Date(b.shift_date).getTime() - new Date(a.shift_date).getTime()
        );
      }
      if (sortKey === "staff_name") {
        return a.staff_name.localeCompare(b.staff_name);
      }
      return a.staff_id.localeCompare(b.staff_id);
    });
  }, [shifts, search, sortKey]);

  return {
    shifts: filtered,
    total: shifts.length,
    totalStaff: getTotalStaff(shifts),
    activeShiftDates: getActiveShiftDates(shifts),
    overtimeCount: getOvertimeCount(shifts),
    languageCoverage: getLanguageCoverage(shifts),
    recentShifts: getRecentShifts(shifts),
    search,
    setSearch,
    sortKey,
    setSortKey,
    loading,
  };
}
