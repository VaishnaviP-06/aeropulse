/**
 * Reverse-engineered from baggage.csv (no data dictionary supplied).
 * Several columns are constant across all 2,800 rows in this dataset
 * (dimensions, origin_point, checkin_counter, status, current_location,
 * mishandled) — kept typed for completeness but they won't add visual
 * variety since every bag in this dataset was successfully loaded.
 */
export interface Bag {
  bag_tag: string;
  pnr_code: string;
  flight_id: string;
  passport_masked: string;

  weight_kg: number;
  dimensions: string;

  origin_point: string;
  checkin_counter: string;
  checkin_time: string;
  load_time: string;

  bag_sequence: number;
  status: string;
  mishandled: boolean;
  mishandling_count: number;
  current_location: string;
  last_scan_time: string;
  flagged_for_inspection: boolean;
}
