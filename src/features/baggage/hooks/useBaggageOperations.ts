import { useEffect, useMemo, useState } from "react";
import { useFlightStore } from "../../../store/flight.store";
import { usePassengerStore } from "../../../store/passenger.store";
import { useBaggageStore } from "../../../store/baggage.store";
import {
  joinBaggageWithContext,
  getTotalBags,
  getTotalWeightKg,
  getAverageWeightKg,
  getFlaggedCount,
  getTopBaggageFlights,
} from "../utils/baggageAnalytics";

export type BagSortKey = "weight" | "sequence" | "flight_id";

export const bagSortOptions: { value: BagSortKey; label: string }[] = [
  { value: "weight", label: "Weight" },
  { value: "sequence", label: "Bag sequence" },
  { value: "flight_id", label: "Flight ID" },
];

export function useBaggageOperations() {
  const flights = useFlightStore((state) => state.flights);
  const flightsLoading = useFlightStore((state) => state.loading);
  const loadFlights = useFlightStore((state) => state.loadFlights);

  const passengers = usePassengerStore((state) => state.passengers);
  const passengersLoading = usePassengerStore((state) => state.loading);
  const loadPassengers = usePassengerStore((state) => state.loadPassengers);

  const bags = useBaggageStore((state) => state.bags);
  const bagsLoading = useBaggageStore((state) => state.loading);
  const loadBaggage = useBaggageStore((state) => state.loadBaggage);

  useEffect(() => {
    loadFlights();
    loadPassengers();
    loadBaggage();
  }, [loadFlights, loadPassengers, loadBaggage]);

  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<BagSortKey>("weight");

  const joined = useMemo(
    () => joinBaggageWithContext(bags, flights, passengers),
    [bags, flights, passengers]
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    const matching = joined.filter((bag) => {
      return (
        term.length === 0 ||
        bag.bag_tag.toLowerCase().includes(term) ||
        bag.pnr_code.toLowerCase().includes(term) ||
        bag.flight_id.toLowerCase().includes(term) ||
        (bag.passenger
          ? `${bag.passenger.first_name} ${bag.passenger.last_name}`
              .toLowerCase()
              .includes(term)
          : false)
      );
    });

    return [...matching].sort((a, b) => {
      if (sortKey === "weight") {
        return Number(b.weight_kg) - Number(a.weight_kg);
      }
      if (sortKey === "sequence") {
        return Number(a.bag_sequence) - Number(b.bag_sequence);
      }
      return a.flight_id.localeCompare(b.flight_id);
    });
  }, [joined, search, sortKey]);

  return {
    bags: filtered,
    total: bags.length,
    totalBags: getTotalBags(bags),
    totalWeightKg: getTotalWeightKg(bags),
    averageWeightKg: getAverageWeightKg(bags),
    flaggedCount: getFlaggedCount(bags),
    topBaggageFlights: getTopBaggageFlights(bags),
    search,
    setSearch,
    sortKey,
    setSortKey,
    loading: flightsLoading || passengersLoading || bagsLoading,
  };
}
