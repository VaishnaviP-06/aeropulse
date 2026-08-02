import type { Flight } from "../../../types/flight.types";
import type { GateEvent } from "../../../types/gate.types";
import type { Passenger } from "../../../types/passenger.types";
import type { Bag } from "../../../types/baggage.types";
import type { SecurityScreening } from "../../../types/security.types";
import type { MaintenanceLog } from "../../../types/maintenance.types";
import type { TimelineEvent, TimelineSeverity } from "../../../types/timeline.types";
import { buildGateSummaries } from "../../gates/utils/gateAnalytics";

import type { RetailTransaction } from "../../../types/retail.types";
function str(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value);
}

function toEpoch(value: unknown): number {
  const time = new Date(str(value)).getTime();
  return Number.isNaN(time) ? NaN : time;
}

/** Matches the codebase convention of comparing stringified booleans (see useFlightFilters.ts). */
function isTrue(value: unknown): boolean {
  return str(value) === "True";
}

function detectSurgeBuckets(
  timestamps: number[],
  bucketMs: number
): Map<number, number> {
  const counts = new Map<number, number>();

  timestamps.forEach((time) => {
    if (Number.isNaN(time)) return;
    const bucket = Math.floor(time / bucketMs) * bucketMs;
    counts.set(bucket, (counts.get(bucket) ?? 0) + 1);
  });

  if (counts.size === 0) return new Map();

  const values = Array.from(counts.values());
  const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
  const variance =
    values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.length;
  const stdDev = Math.sqrt(variance);

  const threshold = mean + stdDev;

  const surges = new Map<number, number>();
  counts.forEach((count, bucket) => {
    if (count >= threshold && count >= 3) {
      surges.set(bucket, count);
    }
  });

  return surges;
}

let idCounter = 0;
function makeId(source: string, key: string): string {
  idCounter += 1;
  return `${source}-${key || "row"}-${idCounter}`;
}

function delaySeverity(delayMinutes: number): TimelineSeverity {
  if (delayMinutes >= 60) return "critical";
  if (delayMinutes >= 15) return "warning";
  return "info";
}

/** Flight-derived events: delays and confirmed departures. */
function fromFlights(flights: Flight[]): TimelineEvent[] {
  const events: TimelineEvent[] = [];

  flights.forEach((flight) => {
    const delay = Number(flight.delay_minutes) || 0;

    if (delay > 0) {
      const timestamp = flight.scheduled_departure;
      const time = toEpoch(timestamp);
      if (!Number.isNaN(time)) {
        events.push({
          id: makeId("flights", `${flight.flight_id}-delay`),
          timestamp,
          category: "Delay",
          eventType: "Flight Delayed",
          title: "Flight Delayed",
          description: `${flight.flight_id} to ${flight.destination} delayed ${delay} min (${flight.delay_reason || "unspecified"})`,
          severity: delaySeverity(delay),
          source: "flights",
          flightId: flight.flight_id,
          gate: flight.gate,
          terminal: flight.terminal,
        });
      }
    }

    const departed =
      flight.status === "Departed" &&
      flight.actual_departure &&
      String(flight.actual_departure).length > 0;

    if (departed) {
      const time = toEpoch(flight.actual_departure);
      if (!Number.isNaN(time)) {
        events.push({
          id: makeId("flights", `${flight.flight_id}-departed`),
          timestamp: flight.actual_departure,
          category: "Departure",
          eventType: "Flight Departed",
          title: "Flight Departed",
          description: `${flight.flight_id} departed ${flight.origin} → ${flight.destination} from gate ${flight.gate || "—"}`,
          severity: "info",
          source: "flights",
          flightId: flight.flight_id,
          gate: flight.gate,
          terminal: flight.terminal,
        });
      }
    }
  });

  return events;
}

/**
 * Gate-derived events. `gate_events.csv` only records boarding-start
 * markers, so real turnaround conflicts are computed the same way the
 * completed Gates module already does — by looking at overlapping
 * departure windows per gate (see features/gates/utils/gateAnalytics).
 */
function fromGateEvents(
  gateEvents: GateEvent[],
  flights: Flight[]
): TimelineEvent[] {
  const events: TimelineEvent[] = [];

  gateEvents.forEach((event) => {
    const time = toEpoch(event.event_time);
    if (Number.isNaN(time)) return;

    events.push({
      id: makeId("gate_events", event.event_id),
      timestamp: event.event_time,
      category: "Boarding",
      eventType: "Boarding Started",
      title: "Boarding Started",
      description: `Boarding started for ${event.flight_id} at gate ${event.gate}`,
      severity: "info",
      source: "gate_events",
      flightId: event.flight_id,
      gate: event.gate,
      terminal: event.terminal,
    });
  });

  const summaries = buildGateSummaries(flights);

  summaries.forEach((summary) => {
    summary.conflicts.forEach((conflict) => {
      const flightB = summary.flights.find(
        (flight) => flight.flight_id === conflict.flightB
      );
      const timestamp = flightB?.scheduled_departure;
      const time = toEpoch(timestamp);
      if (!timestamp || Number.isNaN(time)) return;

      events.push({
        id: makeId("gate_events", `${conflict.gate}-${conflict.flightA}-${conflict.flightB}`),
        timestamp,
        category: "Gate",
        eventType: "Gate Conflict",
        title: "Gate Conflict",
        description: `${conflict.flightA} and ${conflict.flightB} overlap on gate ${conflict.gate} by ${conflict.overlapMinutes} min`,
        severity: conflict.overlapMinutes >= 30 ? "critical" : "warning",
        source: "gate_events",
        flightId: conflict.flightB,
        gate: conflict.gate,
        terminal: flightB?.terminal,
      });
    });
  });

  return events;
}

/** Passenger-derived events: check-in and boarding completion. */
function fromPassengers(passengers: Passenger[]): TimelineEvent[] {
  const events: TimelineEvent[] = [];

  passengers.forEach((passenger) => {
    const checkinTime = toEpoch(passenger.checkin_time);
    if (!Number.isNaN(checkinTime)) {
      const duration = Number(passenger.checkin_duration_minutes) || 0;

      events.push({
        id: makeId("passengers", `${passenger.pnr_code}-checkin`),
        timestamp: passenger.checkin_time,
        category: "CheckIn",
        eventType: "Passenger Check-in",
        title:
          duration >= 30 ? "Passenger Check-in Delayed" : "Passenger Check-in",
        description: `${passenger.pnr_code} checked in for ${passenger.flight_id} (${duration} min${
          isTrue(passenger.special_assistance_required) ? ", assistance requested" : ""
        })`,
        severity: duration >= 30 ? "warning" : "info",
        source: "passengers",
        flightId: passenger.flight_id,
        gate: passenger.gate,
        passengerRef: passenger.pnr_code,
      });
    }

    const boardingTime = toEpoch(passenger.boarding_time);
    if (!Number.isNaN(boardingTime)) {
      events.push({
        id: makeId("passengers", `${passenger.pnr_code}-boarding`),
        timestamp: passenger.boarding_time,
        category: "Boarding",
        eventType: "Boarding Completed",
        title: "Boarding Completed",
        description: `${passenger.pnr_code} boarded ${passenger.flight_id} at gate ${passenger.gate || "—"}, seat ${passenger.seat_number}`,
        severity: "info",
        source: "passengers",
        flightId: passenger.flight_id,
        gate: passenger.gate,
        passengerRef: passenger.pnr_code,
      });
    }
  });

  return events;
}

/** Baggage-derived events, using weight as the real varying risk signal. */
function fromBaggage(bags: Bag[]): TimelineEvent[] {
  const events: TimelineEvent[] = [];

  bags.forEach((bag) => {
    const timestamp = bag.load_time || bag.checkin_time;
    const time = toEpoch(timestamp);
    if (Number.isNaN(time)) return;

    const overweight = Number(bag.weight_kg) >= 25;

    events.push({
      id: makeId("baggage", bag.bag_tag),
      timestamp,
      category: "Baggage",
      eventType: overweight ? "Overweight Baggage Loaded" : "Baggage Loaded",
      title: overweight ? "Overweight Baggage Loaded" : "Baggage Loaded",
      description: `Bag ${bag.bag_tag} (${Number(bag.weight_kg).toFixed(1)} kg) loaded for ${bag.flight_id}`,
      severity: overweight ? "warning" : "info",
      source: "baggage",
      flightId: bag.flight_id,
      baggageRef: bag.bag_tag,
      passengerRef: bag.pnr_code,
    });
  });

  return events;
}

function fromSecurity(screenings: SecurityScreening[]): TimelineEvent[] {
  const events: TimelineEvent[] = [];

  screenings.forEach((screening) => {
    const timestamp = screening.screening_time;
    const time = toEpoch(timestamp);
    if (Number.isNaN(time)) return;

    events.push({
      id: makeId("security_screening", screening.screening_id),
      timestamp,
      category: "Security",
      eventType: "Security Screening",
      title: "Security Screening",
      description: `${screening.pnr_code} cleared checkpoint ${screening.checkpoint_number}`,
      severity: "info",
      source: "security_screening",
      passengerRef: screening.pnr_code,
    });
  });

  const byCheckpoint = new Map<string, number[]>();
  screenings.forEach((screening) => {
    const time = toEpoch(screening.screening_time);
    if (Number.isNaN(time)) return;
    const key = String(screening.checkpoint_number);
    const list = byCheckpoint.get(key) ?? [];
    list.push(time);
    byCheckpoint.set(key, list);
  });

  const SURGE_BUCKET_MS = 60 * 60 * 1000; // 1 hour

  byCheckpoint.forEach((times, checkpoint) => {
    const surges = detectSurgeBuckets(times, SURGE_BUCKET_MS);
    surges.forEach((count, bucketStart) => {
      events.push({
        id: makeId("security_screening", `queue-${checkpoint}-${bucketStart}`),
        timestamp: new Date(bucketStart).toISOString(),
        category: "Security",
        eventType: "Security Queue Increasing",
        title: "Security Queue Increasing",
        description: `Checkpoint ${checkpoint} processed ${count} passengers this hour, above normal volume`,
        severity: count >= 6 ? "critical" : "warning",
        source: "security_screening",
      });
    });
  });

  return events;
}

/** Maintenance-derived events: work opened and closed, keyed to real timestamps. */
function fromMaintenance(logs: MaintenanceLog[]): TimelineEvent[] {
  const events: TimelineEvent[] = [];

  logs.forEach((log) => {
    const reportedTime = toEpoch(log.reported_time);
    if (!Number.isNaN(reportedTime)) {
      events.push({
        id: makeId("maintenance_logs", `${log.work_order_id}-started`),
        timestamp: log.reported_time,
        category: "Maintenance",
        eventType: "Maintenance Started",
        title: "Maintenance Started",
        description: `${log.maintenance_type} opened on ${log.aircraft_registration} — ${log.issue_description || log.component}`,
        severity: "warning",
        source: "maintenance_logs",
        flightId: log.flight_id,
      });
    }

    const resolvedTime = toEpoch(log.resolved_time);
    if (log.resolved_time && !Number.isNaN(resolvedTime)) {
      const durationHours =
        !Number.isNaN(reportedTime) && !Number.isNaN(resolvedTime)
          ? Math.abs(resolvedTime - reportedTime) / 3_600_000
          : 0;

      events.push({
        id: makeId("maintenance_logs", `${log.work_order_id}-completed`),
        timestamp: log.resolved_time,
        category: "Maintenance",
        eventType: "Maintenance Completed",
        title: "Maintenance Completed",
        description: `${log.maintenance_type} closed on ${log.aircraft_registration} (${log.component}), ${durationHours.toFixed(
          1
        )}h logged`,
        severity: durationHours >= 48 ? "critical" : durationHours >= 12 ? "warning" : "info",
        source: "maintenance_logs",
        flightId: log.flight_id,
      });
    }
  });

  return events;
}


function fromRetail(rows: RetailTransaction[]): TimelineEvent[] {
  const events: TimelineEvent[] = [];

  const timestamps = rows
    .map((row) => toEpoch(row.transaction_time))
    .filter((time) => !Number.isNaN(time));

  const SURGE_BUCKET_MS = 60 * 60 * 1000;

  const surges = detectSurgeBuckets(timestamps, SURGE_BUCKET_MS);

  const totalsByBucket = new Map<number, number>();

  rows.forEach((row) => {
    const time = toEpoch(row.transaction_time);
    if (Number.isNaN(time)) return;

    const bucket = Math.floor(time / SURGE_BUCKET_MS) * SURGE_BUCKET_MS;

    if (!surges.has(bucket)) return;

    totalsByBucket.set(
      bucket,
      (totalsByBucket.get(bucket) ?? 0) + Number(row.total_amount_inr)
    );
  });

  surges.forEach((count, bucketStart) => {
    const revenue = totalsByBucket.get(bucketStart) ?? 0;

    events.push({
      id: makeId("retail_transactions", `surge-${bucketStart}`),
      timestamp: new Date(bucketStart).toISOString(),

      category: "Retail",
      eventType: "Retail Peak Activity",
      title: "Retail Peak Activity",

      description: `${count} transactions this hour across airport retail outlets (₹${Math.round(
        revenue
      ).toLocaleString("en-IN")})`,

      severity: count >= 6 ? "warning" : "info",

      source: "retail_transactions",
    });
  });

  return events;
}

export interface TimelineDataSources {
  flights: Flight[];
  gateEvents: GateEvent[];
  passengers: Passenger[];
  bags: Bag[];
  screenings: SecurityScreening[];
  maintenanceLogs: MaintenanceLog[];
  retailRows: RetailTransaction[];
}


export function generateTimelineEvents(
  sources: TimelineDataSources
): TimelineEvent[] {
  idCounter = 0;

  const events: TimelineEvent[] = [
    ...fromFlights(sources.flights),
    ...fromGateEvents(sources.gateEvents, sources.flights),
    ...fromPassengers(sources.passengers),
    ...fromBaggage(sources.bags),
    ...fromSecurity(sources.screenings),
    ...fromMaintenance(sources.maintenanceLogs),
    ...fromRetail(sources.retailRows),
  ];

  return events
    .filter((event) => !Number.isNaN(new Date(event.timestamp).getTime()))
    .sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
}