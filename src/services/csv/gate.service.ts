import { loadCSV } from "./csvLoader";
import gateEventsCSV from "../../csv/gate_events.csv?url";
import type { GateEvent } from "../../types/gate.types";

const gateEventHeaders = [
  "event_id",
  "flight_id",
  "gate",
  "terminal",
  "event_type",
  "event_time",
  "staff_id",
  "duration_minutes",
  "event_category",
  "has_conflict",
  "notes",
  "window_start",
  "window_end",
  "next_scheduled",
];

export async function getGateEvents(): Promise<GateEvent[]> {
  return loadCSV<GateEvent>(gateEventsCSV, gateEventHeaders);
}
