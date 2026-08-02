export interface GateEvent {
  event_id: string;
  flight_id: string;
  gate: string;
  terminal: string;
  event_type: string;
  event_time: string;
  staff_id: string;
  duration_minutes: number;
  event_category: string;
  has_conflict: boolean;
  notes: string;
  window_start: string;
  window_end: string;
  next_scheduled: string;
}
