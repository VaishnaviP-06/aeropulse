import type { SecurityScreening } from "../../../types/security.types";
import type { Passenger } from "../../../types/passenger.types";
import type { Flight } from "../../../types/flight.types";

export interface ScreeningWithContext extends SecurityScreening {
  passenger: Passenger | null;
  flight: Flight | null;
}

export function joinSecurityWithContext(
  screenings: SecurityScreening[],
  passengers: Passenger[],
  flights: Flight[]
): ScreeningWithContext[] {
  const passengerMap = new Map(passengers.map((p) => [p.pnr_code, p]));
  const flightMap = new Map(flights.map((f) => [f.flight_id, f]));

  return screenings.map((screening) => {
    const passenger = passengerMap.get(screening.pnr_code) ?? null;
    const flight = passenger ? flightMap.get(passenger.flight_id) ?? null : null;

    return {
      ...screening,
      passenger,
      flight,
    };
  });
}

export function getTotalScreenings(screenings: SecurityScreening[]) {
  return screenings.length;
}

export function getActiveCheckpoints(screenings: SecurityScreening[]) {
  return new Set(screenings.map((s) => s.checkpoint_number)).size;
}

export function getStaffOnDuty(screenings: SecurityScreening[]) {
  return new Set(screenings.map((s) => s.staff_id)).size;
}

export function getPassengerMatchRate(screenings: ScreeningWithContext[]) {
  if (!screenings.length) return 0;
  const matched = screenings.filter((s) => s.passenger !== null).length;
  return Number(((matched / screenings.length) * 100).toFixed(1));
}

export function getSecondaryScreeningCount(screenings: SecurityScreening[]) {
  return screenings.filter(
    (s) =>
      s.secondary_screening_required === true ||
      String(s.secondary_screening_required) === "True"
  ).length;
}

export interface CheckpointLoad {
  checkpoint_number: number;
  count: number;
}

/**
 * Screening volume per checkpoint lane — the one dimension in this
 * dataset with genuine spread (1–8), useful for balancing lane staffing.
 */
export function getCheckpointLoad(
  screenings: SecurityScreening[]
): CheckpointLoad[] {
  const byCheckpoint = new Map<number, number>();

  screenings.forEach((screening) => {
    const count = byCheckpoint.get(screening.checkpoint_number) ?? 0;
    byCheckpoint.set(screening.checkpoint_number, count + 1);
  });

  return Array.from(byCheckpoint.entries())
    .map(([checkpoint_number, count]) => ({ checkpoint_number, count }))
    .sort((a, b) => b.count - a.count);
}
