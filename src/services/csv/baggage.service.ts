import { loadCSV } from "./csvLoader";
import baggageCSV from "../../csv/baggage.csv?url";
import type { Bag } from "../../types/baggage.types";

const baggageHeaders = [
  "bag_tag",
  "pnr_code",
  "flight_id",
  "passport_masked",
  "weight_kg",
  "dimensions",
  "origin_point",
  "checkin_counter",
  "checkin_time",
  "load_time",
  "bag_sequence",
  "status",
  "mishandled",
  "mishandling_count",
  "current_location",
  "last_scan_time",
  "flagged_for_inspection",
  "unused_1",
];

export async function getBaggage(): Promise<Bag[]> {
  return loadCSV<Bag>(baggageCSV, baggageHeaders);
}
