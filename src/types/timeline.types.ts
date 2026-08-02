export type TimelineCategory =
  | "Boarding"
  | "Departure"
  | "Delay"
  | "Gate"
  | "CheckIn"
  | "Security"
  | "Baggage"
  | "Maintenance"
  | "Retail";

export type TimelineSeverity = "info" | "warning" | "critical";

export type TimelineSource =
  | "flights"
  | "gate_events"
  | "passengers"
  | "baggage"
  | "security_screening"
  | "maintenance_logs"
  | "retail_transactions";

export interface TimelineEvent {
  id: string;

  /** ISO timestamp from the original dataset */
  timestamp: string;

  category: TimelineCategory;

  /** e.g. Boarding Started, Flight Delayed */
  eventType: string;

  title: string;
  description: string;

  severity: TimelineSeverity;

  source: TimelineSource;

  flightId?: string;
  gate?: string;
  terminal?: string;

  passengerRef?: string;
  baggageRef?: string;
}

export type ClockStatus =
  | "idle"
  | "running"
  | "paused"
  | "completed";

export type ClockSpeed = 1 | 2 | 5;

export interface TimelineClockState {
  status: ClockStatus;

  /** simulated current airport time */
  simTime: number;

  /** earliest timestamp in all datasets */
  startTime: number;

  /** latest timestamp in all datasets */
  endTime: number;

  speed: ClockSpeed;
}

export const TIMELINE_CATEGORIES: TimelineCategory[] = [
  "Boarding",
  "Departure",
  "Delay",
  "Gate",
  "CheckIn",
  "Security",
  "Baggage",
  "Maintenance",
  "Retail",
];

export const TIMELINE_SEVERITIES: TimelineSeverity[] = [
  "info",
  "warning",
  "critical",
];