import { useEffect, useMemo, useState } from "react";
import { useFlightStore } from "../../../store/flight.store";
import { usePassengerStore } from "../../../store/passenger.store";
import {
  joinPassengersWithFlights,
  getTotalPassengers,
  getBusinessClassCount,
  getSpecialAssistanceCount,
  getTightConnectionCount,
} from "../utils/passengerAnalytics";

export const cabinFilters = ["All", "Business", "Economy"] as const;
export type CabinFilter = (typeof cabinFilters)[number];

export function usePassengerOperations() {
  const flights = useFlightStore((state) => state.flights);
  const flightsLoading = useFlightStore((state) => state.loading);
  const loadFlights = useFlightStore((state) => state.loadFlights);

  const passengers = usePassengerStore((state) => state.passengers);
  const passengersLoading = usePassengerStore((state) => state.loading);
  const loadPassengers = usePassengerStore((state) => state.loadPassengers);

  useEffect(() => {
    loadFlights();
    loadPassengers();
  }, [loadFlights, loadPassengers]);

  const [search, setSearch] = useState("");
  const [cabin, setCabin] = useState<CabinFilter>("All");
  const [tightConnectionsOnly, setTightConnectionsOnly] = useState(false);

  const joined = useMemo(
    () => joinPassengersWithFlights(passengers, flights),
    [passengers, flights]
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    return joined.filter((passenger) => {
      const matchesCabin = cabin === "All" || passenger.cabin_class === cabin;

      const matchesTight =
        !tightConnectionsOnly || Number(passenger.buffer_time_hours) < 0.5;

      const matchesSearch =
        term.length === 0 ||
        passenger.pnr_code.toLowerCase().includes(term) ||
        `${passenger.first_name} ${passenger.last_name}`
          .toLowerCase()
          .includes(term) ||
        passenger.flight_id.toLowerCase().includes(term) ||
        passenger.nationality.toLowerCase().includes(term) ||
        (passenger.gate ?? "").toLowerCase().includes(term);

      return matchesCabin && matchesTight && matchesSearch;
    });
  }, [joined, search, cabin, tightConnectionsOnly]);

  return {
    passengers: filtered,
    total: passengers.length,
    totalPassengers: getTotalPassengers(passengers),
    businessClassCount: getBusinessClassCount(passengers),
    specialAssistanceCount: getSpecialAssistanceCount(passengers),
    tightConnectionCount: getTightConnectionCount(passengers),
    search,
    setSearch,
    cabin,
    setCabin,
    tightConnectionsOnly,
    setTightConnectionsOnly,
    loading: flightsLoading || passengersLoading,
  };
}
