import type { SecurityScreening } from "../../../types/security.types";
import type { Passenger } from "../../../types/passenger.types";
import type { Flight } from "../../../types/flight.types";

/**
 * security_screening.csv carries no flight_id, and its pnr_code /
 * passport_masked values don't reliably correlate with passengers.csv —
 * screening records appear to have been generated independently of the
 * passenger roster (a data-quality reality of this dataset, not a bug in
 * the join logic). We still attempt the lookup via pnr_code, the same
 * pattern every other module uses, so any real matches surface naturally.
 * Unmatched records are left unlinked rather than fabricated.
 *
 * The dataset also records zero screening incidents: result, secondary
 * screening, confiscation, watchlist and pat-down fields are constant
 * across all rows. Operational KPIs below lean on the fields that do
 * genuinely vary — checkpoint number, staff assignment, and timestamps —
 * instead of inventing variance that isn't in the source data.
 */

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
