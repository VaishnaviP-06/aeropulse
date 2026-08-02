import { loadCSV } from "./csvLoader";
import staffCSV from "../../csv/staff_shifts.csv?url";

export async function getStaffShifts() {
  return loadCSV(staffCSV);
}