import { loadCSV } from "./csvLoader";
import securityCSV from "../../csv/security_screening.csv?url";
import type { SecurityScreening } from "../../types/security.types";

const securityHeaders = [
  "screening_id",
  "passport_masked",
  "pnr_code",
  "checkpoint_number",
  "screening_time",
  "queue_entry_time",
  "clearance_time",
  "screening_result",
  "unused_1",
  "secondary_screening_required",
  "staff_id",
  "checkpoint_lane",
  "wait_time_minutes",
  "item_confiscated",
  "pat_down_performed",
  "shift_id",
  "queue_length",
  "avg_processing_seconds",
  "unused_2",
  "watchlist_flag",
];

export async function getSecurityScreening(): Promise<SecurityScreening[]> {
  return loadCSV<SecurityScreening>(securityCSV, securityHeaders);
}
