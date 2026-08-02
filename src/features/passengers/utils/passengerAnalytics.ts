import type { Flight } from "../../../types/flight.types";
import type { Passenger } from "../../../types/passenger.types";

export interface PassengerWithFlight extends Passenger {
  flight: Flight | null;
}

export function joinPassengersWithFlights(
  passengers: Passenger[],
  flights: Flight[]
): PassengerWithFlight[] {
  const flightMap = new Map(flights.map((flight) => [flight.flight_id, flight]));

  return passengers.map((passenger) => ({
    ...passenger,
    flight: flightMap.get(passenger.flight_id) ?? null,
  }));
}

export function getTotalPassengers(passengers: Passenger[]) {
  return passengers.length;
}

export function getBusinessClassCount(passengers: Passenger[]) {
  return passengers.filter((p) => p.cabin_class === "Business").length;
}

export function getSpecialAssistanceCount(passengers: Passenger[]) {
  return passengers.filter(
    (p) =>
      p.special_assistance_required === true ||
      String(p.special_assistance_required) === "True"
  ).length;
}

/**
 * A passenger whose buffer_time_hours (gap between check-in and their
 * flight's departure cutoff) is under 30 minutes is flagged as a tight
 * connection — useful for surfacing who ops should keep an eye on.
 */
export function getTightConnectionCount(passengers: Passenger[]) {
  return passengers.filter((p) => Number(p.buffer_time_hours) < 0.5).length;
}

export function getNationalityBreakdown(passengers: Passenger[]) {
  const counts = new Map<string, number>();

  passengers.forEach((p) => {
    counts.set(p.nationality, (counts.get(p.nationality) ?? 0) + 1);
  });

  return Array.from(counts.entries())
    .map(([nationality, count]) => ({ nationality, count }))
    .sort((a, b) => b.count - a.count);
}

export function getAgeGroupBreakdown(passengers: Passenger[]) {
  const counts = new Map<string, number>();

  passengers.forEach((p) => {
    counts.set(p.age_group, (counts.get(p.age_group) ?? 0) + 1);
  });

  return Array.from(counts.entries()).map(([ageGroup, count]) => ({
    ageGroup,
    count,
  }));
}
