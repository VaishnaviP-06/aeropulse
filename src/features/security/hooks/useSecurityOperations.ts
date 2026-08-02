import { useEffect, useMemo, useState } from "react";
import { useFlightStore } from "../../../store/flight.store";
import { usePassengerStore } from "../../../store/passenger.store";
import { useSecurityStore } from "../../../store/security.store";
import {
  joinSecurityWithContext,
  getTotalScreenings,
  getActiveCheckpoints,
  getStaffOnDuty,
  getPassengerMatchRate,
  getSecondaryScreeningCount,
  getCheckpointLoad,
} from "../utils/securityAnalytics";

export type SecuritySortKey = "screening_time" | "checkpoint_number" | "screening_id";

export const securitySortOptions: { value: SecuritySortKey; label: string }[] = [
  { value: "screening_time", label: "Screening time" },
  { value: "checkpoint_number", label: "Checkpoint" },
  { value: "screening_id", label: "Screening ID" },
];

export function useSecurityOperations() {
  const flights = useFlightStore((state) => state.flights);
  const flightsLoading = useFlightStore((state) => state.loading);
  const loadFlights = useFlightStore((state) => state.loadFlights);

  const passengers = usePassengerStore((state) => state.passengers);
  const passengersLoading = usePassengerStore((state) => state.loading);
  const loadPassengers = usePassengerStore((state) => state.loadPassengers);

  const screenings = useSecurityStore((state) => state.screenings);
  const screeningsLoading = useSecurityStore((state) => state.loading);
  const loadSecurityScreening = useSecurityStore(
    (state) => state.loadSecurityScreening
  );

  useEffect(() => {
    loadFlights();
    loadPassengers();
    loadSecurityScreening();
  }, [loadFlights, loadPassengers, loadSecurityScreening]);

  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SecuritySortKey>("screening_time");
  const [checkpointFilter, setCheckpointFilter] = useState<number | "all">("all");

  const joined = useMemo(
    () => joinSecurityWithContext(screenings, passengers, flights),
    [screenings, passengers, flights]
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    const matching = joined.filter((screening) => {
      const matchesSearch =
        term.length === 0 ||
        screening.screening_id.toLowerCase().includes(term) ||
        screening.pnr_code.toLowerCase().includes(term) ||
        screening.passport_masked.toLowerCase().includes(term) ||
        screening.staff_id.toLowerCase().includes(term) ||
        (screening.passenger
          ? `${screening.passenger.first_name} ${screening.passenger.last_name}`
              .toLowerCase()
              .includes(term)
          : false);

      const matchesCheckpoint =
        checkpointFilter === "all" ||
        screening.checkpoint_number === checkpointFilter;

      return matchesSearch && matchesCheckpoint;
    });

    return [...matching].sort((a, b) => {
      if (sortKey === "screening_time") {
        return (
          new Date(b.screening_time).getTime() -
          new Date(a.screening_time).getTime()
        );
      }
      if (sortKey === "checkpoint_number") {
        return a.checkpoint_number - b.checkpoint_number;
      }
      return a.screening_id.localeCompare(b.screening_id);
    });
  }, [joined, search, sortKey, checkpointFilter]);

  return {
    screenings: filtered,
    total: screenings.length,
    totalScreenings: getTotalScreenings(screenings),
    activeCheckpoints: getActiveCheckpoints(screenings),
    staffOnDuty: getStaffOnDuty(screenings),
    passengerMatchRate: getPassengerMatchRate(joined),
    secondaryScreeningCount: getSecondaryScreeningCount(screenings),
    checkpointLoad: getCheckpointLoad(screenings),
    search,
    setSearch,
    sortKey,
    setSortKey,
    checkpointFilter,
    setCheckpointFilter,
    loading: flightsLoading || passengersLoading || screeningsLoading,
  };
}
