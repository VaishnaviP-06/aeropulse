import { useEffect, useMemo, useState } from "react";
import { useFlightStore } from "../../../store/flight.store";
import type { Flight } from "../../../types/flight.types";

export type FlightPhase = "Scheduled" | "Boarding" | "Delayed" | "Departed";

export function getFlightPhase(flight: Flight): FlightPhase {
  const boarded =
    flight.boarding_completed === true ||
    String(flight.boarding_completed) === "True";

  const crewReady =
    flight.crew_ready === true || String(flight.crew_ready) === "True";

  const delay = Number(flight.delay_minutes) || 0;

  if (boarded && crewReady) return "Departed";
  if (boarded && !crewReady) return "Boarding";
  if (delay > 0) return "Delayed";
  return "Scheduled";
}

export const statusFilters = [
  "All",
  "Scheduled",
  "Boarding",
  "Delayed",
  "Departed",
] as const;

export type StatusFilter = (typeof statusFilters)[number];

export type SortKey = "risk" | "delay" | "flight_id";

export const sortOptions: { value: SortKey; label: string }[] = [
  { value: "risk", label: "Risk priority" },
  { value: "delay", label: "Delay duration" },
  { value: "flight_id", label: "Flight ID" },
];

export function useFlightFilters() {
  const flights = useFlightStore((state) => state.flights);
  const loading = useFlightStore((state) => state.loading);
  const loadFlights = useFlightStore((state) => state.loadFlights);

  useEffect(() => {
    loadFlights();
  }, [loadFlights]);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("All");
  const [sortKey, setSortKey] = useState<SortKey>("risk");

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    const matching = flights.filter((flight) => {
      const phase = getFlightPhase(flight);
      const matchesStatus = status === "All" || phase === status;

      const matchesSearch =
        term.length === 0 ||
        flight.flight_id.toLowerCase().includes(term) ||
        flight.airline.toLowerCase().includes(term) ||
        flight.origin.toLowerCase().includes(term) ||
        flight.destination.toLowerCase().includes(term) ||
        (flight.gate ?? "").toLowerCase().includes(term) ||
        phase.toLowerCase().includes(term);

      return matchesStatus && matchesSearch;
    });

    return [...matching].sort((a, b) => {
      if (sortKey === "risk") {
        const rank = (flight: Flight) =>
          flight.risk_level === "Moderate" ? 1 : 0;
        return (
          rank(b) - rank(a) ||
          Number(b.delay_minutes) - Number(a.delay_minutes)
        );
      }

      if (sortKey === "delay") {
        return Number(b.delay_minutes) - Number(a.delay_minutes);
      }

      return a.flight_id.localeCompare(b.flight_id);
    });
  }, [flights, search, status, sortKey]);

  return {
    flights: filtered,
    total: flights.length,
    loading,
    search,
    setSearch,
    status,
    setStatus,
    sortKey,
    setSortKey,
  };
}
