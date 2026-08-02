import { useEffect, useMemo, useState } from "react";
import { useFlightStore } from "../../../store/flight.store";
import { useRetailStore } from "../../../store/retail.store";
import {
  joinRetailWithFlight,
  getTotalRevenue,
  getTotalTransactions,
  getAverageTransactionValue,
  getUniqueFlightsServed,
  getRevenueByAirline,
  getTopFlightsByRevenue,
  getRevenueByDayOfWeek,
  getDatasetProfile,
} from "../utils/retailAnalytics";

export type RetailSortKey = "transaction_time" | "amount" | "transaction_id";

export const retailSortOptions: { value: RetailSortKey; label: string }[] = [
  { value: "transaction_time", label: "Most recent" },
  { value: "amount", label: "Amount" },
  { value: "transaction_id", label: "Transaction ID" },
];

export function useRetailOperations() {
  const flights = useFlightStore((state) => state.flights);
  const flightsLoading = useFlightStore((state) => state.loading);
  const loadFlights = useFlightStore((state) => state.loadFlights);

  const transactions = useRetailStore((state) => state.transactions);
  const transactionsLoading = useRetailStore((state) => state.loading);
  const loadRetailTransactions = useRetailStore(
    (state) => state.loadRetailTransactions
  );

  useEffect(() => {
    loadFlights();
    loadRetailTransactions();
  }, [loadFlights, loadRetailTransactions]);

  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<RetailSortKey>("transaction_time");
  const [airlineFilter, setAirlineFilter] = useState<string>("all");

  const joined = useMemo(
    () => joinRetailWithFlight(transactions, flights),
    [transactions, flights]
  );

  const airlineOptions = useMemo(() => {
    const airlines = new Set<string>();
    joined.forEach((transaction) => {
      if (transaction.flight) airlines.add(transaction.flight.airline);
    });
    return Array.from(airlines).sort();
  }, [joined]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    const matching = joined.filter((transaction) => {
      const matchesSearch =
        term.length === 0 ||
        transaction.transaction_id.toLowerCase().includes(term) ||
        transaction.flight_id.toLowerCase().includes(term) ||
        transaction.operator_id.toLowerCase().includes(term) ||
        transaction.passport_masked.toLowerCase().includes(term) ||
        (transaction.flight
          ? transaction.flight.airline.toLowerCase().includes(term)
          : false);

      const matchesAirline =
        airlineFilter === "all" ||
        transaction.flight?.airline === airlineFilter;

      return matchesSearch && matchesAirline;
    });

    return [...matching].sort((a, b) => {
      if (sortKey === "transaction_time") {
        return (
          new Date(b.transaction_time).getTime() -
          new Date(a.transaction_time).getTime()
        );
      }
      if (sortKey === "amount") {
        return Number(b.total_amount_inr) - Number(a.total_amount_inr);
      }
      return a.transaction_id.localeCompare(b.transaction_id);
    });
  }, [joined, search, sortKey, airlineFilter]);

  return {
    transactions: filtered,
    total: transactions.length,
    totalRevenue: getTotalRevenue(transactions),
    totalTransactions: getTotalTransactions(transactions),
    averageTransactionValue: getAverageTransactionValue(transactions),
    uniqueFlightsServed: getUniqueFlightsServed(transactions),
    revenueByAirline: getRevenueByAirline(joined),
    topFlightsByRevenue: getTopFlightsByRevenue(transactions),
    revenueByDayOfWeek: getRevenueByDayOfWeek(transactions),
    datasetProfile: getDatasetProfile(transactions),
    search,
    setSearch,
    sortKey,
    setSortKey,
    airlineFilter,
    setAirlineFilter,
    airlineOptions,
    loading: flightsLoading || transactionsLoading,
  };
}
