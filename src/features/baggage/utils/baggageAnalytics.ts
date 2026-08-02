import type { Bag } from "../../../types/baggage.types";
import type { Flight } from "../../../types/flight.types";
import type { Passenger } from "../../../types/passenger.types";

export interface BagWithContext extends Bag {
  flight: Flight | null;
  passenger: Passenger | null;
}

export function joinBaggageWithContext(
  bags: Bag[],
  flights: Flight[],
  passengers: Passenger[]
): BagWithContext[] {
  const flightMap = new Map(flights.map((flight) => [flight.flight_id, flight]));
  const passengerMap = new Map(passengers.map((p) => [p.pnr_code, p]));

  return bags.map((bag) => ({
    ...bag,
    flight: flightMap.get(bag.flight_id) ?? null,
    passenger: passengerMap.get(bag.pnr_code) ?? null,
  }));
}

export function getTotalBags(bags: Bag[]) {
  return bags.length;
}

export function getTotalWeightKg(bags: Bag[]) {
  return bags.reduce((sum, bag) => sum + Number(bag.weight_kg || 0), 0);
}

export function getAverageWeightKg(bags: Bag[]) {
  if (!bags.length) return 0;
  return Number((getTotalWeightKg(bags) / bags.length).toFixed(1));
}

export function getFlaggedCount(bags: Bag[]) {
  return bags.filter(
    (bag) =>
      bag.flagged_for_inspection === true ||
      String(bag.flagged_for_inspection) === "True"
  ).length;
}

export interface FlightBagLoad {
  flight_id: string;
  bagCount: number;
  totalWeightKg: number;
}

/**
 * Flights with the heaviest baggage load — useful for ramp crew and
 * ground-handling resource planning ahead of departure.
 */
export function getTopBaggageFlights(
  bags: Bag[],
  limit = 5
): FlightBagLoad[] {
  const byFlight = new Map<string, { bagCount: number; totalWeightKg: number }>();

  bags.forEach((bag) => {
    const entry = byFlight.get(bag.flight_id) ?? {
      bagCount: 0,
      totalWeightKg: 0,
    };

    entry.bagCount += 1;
    entry.totalWeightKg += Number(bag.weight_kg || 0);

    byFlight.set(bag.flight_id, entry);
  });

  return Array.from(byFlight.entries())
    .map(([flight_id, stats]) => ({
      flight_id,
      bagCount: stats.bagCount,
      totalWeightKg: Number(stats.totalWeightKg.toFixed(1)),
    }))
    .sort((a, b) => b.bagCount - a.bagCount)
    .slice(0, limit);
}
