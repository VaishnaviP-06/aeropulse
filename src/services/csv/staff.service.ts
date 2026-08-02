import { loadCSV } from "./csvLoader";
import staffCSV from "../../csv/staff_shifts.csv?url";
import type { StaffShift } from "../../types/staff.types";

const staffHeaders = [
  "staff_id",
  "staff_name",
  "department",
  "role",
  "shift_date",
  "shift_start_time",
  "shift_end_time",
  "terminal",
  "base_location",
  "supervisor_id",
  "shift_length_hours",
  "overtime",
  "unused_1",
  "certification_date",
  "primary_language",
];

export async function getStaffShifts(): Promise<StaffShift[]> {
  return loadCSV<StaffShift>(staffCSV, staffHeaders);
}
