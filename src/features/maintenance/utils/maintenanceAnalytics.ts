import type { MaintenanceLog } from "../../../types/maintenance.types";
import type { Flight } from "../../../types/flight.types";

/**
 * maintenance_logs.csv covers a single tail number (VT-ABC) across 400
 * work-order line items. flight_id matches flights.csv 1:1, so every log
 * can be reliably linked to a route for operational context — unlike the
 * staff ids, which don't correlate with staff_shifts.csv and are kept as
 * plain reference text rather than a fabricated join.
 *
 * Every descriptive field in this dataset (issue, component, priority,
 * grounded, recurring) is constant, so it records one recurring
 * inspection scenario rather than distinct incidents. KPIs below lean on
 * what genuinely varies: work order volume, linked flights, and staff
 * activity over time.
 */

export interface MaintenanceLogWithContext extends MaintenanceLog {
  flight: Flight | null;
}

export function joinMaintenanceWithFlight(
  logs: MaintenanceLog[],
  flights: Flight[]
): MaintenanceLogWithContext[] {
  const flightMap = new Map(flights.map((f) => [f.flight_id, f]));

  return logs.map((log) => ({
    ...log,
    flight: flightMap.get(log.flight_id) ?? null,
  }));
}

export function getTotalWorkOrders(logs: MaintenanceLog[]) {
  return logs.length;
}

export function getAircraftTracked(logs: MaintenanceLog[]) {
  return new Set(logs.map((l) => l.aircraft_registration)).size;
}

export function getLinkedFlights(logs: MaintenanceLog[]) {
  return new Set(logs.map((l) => l.flight_id)).size;
}

export function getGroundedCount(logs: MaintenanceLog[]) {
  return logs.filter(
    (l) => l.aircraft_grounded === true || String(l.aircraft_grounded) === "True"
  ).length;
}

export function getRecurringCount(logs: MaintenanceLog[]) {
  return logs.filter(
    (l) => l.recurring_issue === true || String(l.recurring_issue) === "True"
  ).length;
}

/**
 * Most recent work orders by reported_time — a rolling activity feed for
 * the maintenance desk.
 */
export function getRecentWorkOrders(
  logs: MaintenanceLogWithContext[],
  limit = 6
): MaintenanceLogWithContext[] {
  return [...logs]
    .sort(
      (a, b) =>
        new Date(b.reported_time).getTime() -
        new Date(a.reported_time).getTime()
    )
    .slice(0, limit);
}
