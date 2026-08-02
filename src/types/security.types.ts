
export interface SecurityScreening {
  screening_id: string;
  passport_masked: string;
  pnr_code: string;

  checkpoint_number: number;

  screening_time: string;
  queue_entry_time: string;
  clearance_time: string;

  screening_result: string;
  unused_1: string;
  secondary_screening_required: boolean;

  staff_id: string;
  checkpoint_lane: string;
  wait_time_minutes: number;
  item_confiscated: boolean;
  pat_down_performed: boolean;
  shift_id: string;

  queue_length: number;
  avg_processing_seconds: number;
  unused_2: number;

  watchlist_flag: boolean;
}
