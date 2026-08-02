import { useEffect, useMemo, useState } from "react";
import { useFlightStore } from "../../../store/flight.store";
import { useGateStore } from "../../../store/gate.store";
import { buildGateSummaries } from "../utils/gateAnalytics";

export function useGateOperations() {
  const flights = useFlightStore((state) => state.flights);
  const flightsLoading = useFlightStore((state) => state.loading);
  const loadFlights = useFlightStore((state) => state.loadFlights);

  const events = useGateStore((state) => state.events);
  const eventsLoading = useGateStore((state) => state.loading);
  const loadGateEvents = useGateStore((state) => state.loadGateEvents);

  useEffect(() => {
    loadFlights();
    loadGateEvents();
  }, [loadFlights, loadGateEvents]);

  const [search, setSearch] = useState("");

  const summaries = useMemo(() => buildGateSummaries(flights), [flights]);

  const filteredGates = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return summaries;
    return summaries.filter((summary) =>
      summary.gate.toLowerCase().includes(term)
    );
  }, [summaries, search]);

  const totalConflicts = summaries.reduce(
    (sum, summary) => sum + summary.conflicts.length,
    0
  );

  const activity = useMemo(() => {
    const flightMap = new Map(flights.map((flight) => [flight.flight_id, flight]));

    return [...events]
      .sort(
        (a, b) =>
          new Date(b.event_time).getTime() - new Date(a.event_time).getTime()
      )
      .slice(0, 8)
      .map((event) => ({
        ...event,
        flight: flightMap.get(event.flight_id) ?? null,
      }));
  }, [events, flights]);

  return {
    gates: filteredGates,
    totalGates: summaries.length,
    totalConflicts,
    search,
    setSearch,
    activity,
    loading: flightsLoading || eventsLoading,
  };
}
