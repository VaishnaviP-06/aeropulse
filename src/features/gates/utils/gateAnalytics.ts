import type { Flight } from "../../../types/flight.types";

/**
 * This airport dataset only models departures out of DEL — every flight's
 * `gate` field is a real, varying value (50 gates), but there is no arrival
 * leg to pair it with. So "gate occupancy" is derived here as the window a
 * flight physically holds its gate: from a boarding buffer before scheduled
 * departure through to its estimated departure. Overlapping windows on the
 * same gate are flagged as turnaround conflicts.
 */

export interface GateConflict {
  gate: string;
  flightA: string;
  flightB: string;
  overlapMinutes: number;
}

export interface GateSummary {
  gate: string;
  terminal: string;
  flights: Flight[];
  totalFlights: number;
  delayedFlights: number;
  highRiskFlights: number;
  nextDeparture: Flight | null;
  conflicts: GateConflict[];
}

const BOARDING_BUFFER_MINUTES = 45;

function toWindow(flight: Flight) {
  const scheduled = new Date(flight.scheduled_departure).getTime();
  const departure = new Date(
    flight.estimated_departure || flight.scheduled_departure
  ).getTime();

  return {
    start: scheduled - BOARDING_BUFFER_MINUTES * 60_000,
    end: departure,
  };
}

export function buildGateSummaries(flights: Flight[]): GateSummary[] {
  const byGate = new Map<string, Flight[]>();

  flights.forEach((flight) => {
    if (!flight.gate) return;
    const list = byGate.get(flight.gate) ?? [];
    list.push(flight);
    byGate.set(flight.gate, list);
  });

  const now = Date.now();

  return Array.from(byGate.entries())
    .map(([gate, gateFlights]) => {
      const sorted = [...gateFlights].sort(
        (a, b) =>
          new Date(a.scheduled_departure).getTime() -
          new Date(b.scheduled_departure).getTime()
      );

      const conflicts: GateConflict[] = [];

      for (let i = 0; i < sorted.length - 1; i++) {
        const current = toWindow(sorted[i]);
        const next = toWindow(sorted[i + 1]);

        if (next.start < current.end) {
          conflicts.push({
            gate,
            flightA: sorted[i].flight_id,
            flightB: sorted[i + 1].flight_id,
            overlapMinutes: Math.round((current.end - next.start) / 60_000),
          });
        }
      }

      const nextDeparture =
        sorted.find(
          (flight) => new Date(flight.scheduled_departure).getTime() >= now
        ) ??
        sorted[sorted.length - 1] ??
        null;

      return {
        gate,
        terminal: sorted[0]?.terminal ?? "T3",
        flights: sorted,
        totalFlights: sorted.length,
        delayedFlights: sorted.filter((f) => Number(f.delay_minutes) > 0)
          .length,
        highRiskFlights: sorted.filter((f) => f.risk_level === "Moderate")
          .length,
        nextDeparture,
        conflicts,
      };
    })
    .sort(
      (a, b) =>
        b.conflicts.length - a.conflicts.length ||
        b.totalFlights - a.totalFlights
    );
}
