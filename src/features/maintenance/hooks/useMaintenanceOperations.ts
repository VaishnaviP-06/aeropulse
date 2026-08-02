import { useEffect, useMemo, useState } from "react";
import { useFlightStore } from "../../../store/flight.store";
import { useMaintenanceStore } from "../../../store/maintenance.store";
import {
  joinMaintenanceWithFlight,
  getTotalWorkOrders,
  getAircraftTracked,
  getLinkedFlights,
  getGroundedCount,
  getRecurringCount,
  getRecentWorkOrders,
} from "../utils/maintenanceAnalytics";

export type MaintenanceSortKey = "reported_time" | "resolved_time" | "work_order_id";

export const maintenanceSortOptions: {
  value: MaintenanceSortKey;
  label: string;
}[] = [
  { value: "reported_time", label: "Reported time" },
  { value: "resolved_time", label: "Resolved time" },
  { value: "work_order_id", label: "Work order" },
];

export function useMaintenanceOperations() {
  const flights = useFlightStore((state) => state.flights);
  const flightsLoading = useFlightStore((state) => state.loading);
  const loadFlights = useFlightStore((state) => state.loadFlights);

  const logs = useMaintenanceStore((state) => state.logs);
  const logsLoading = useMaintenanceStore((state) => state.loading);
  const loadMaintenanceLogs = useMaintenanceStore(
    (state) => state.loadMaintenanceLogs
  );

  useEffect(() => {
    loadFlights();
    loadMaintenanceLogs();
  }, [loadFlights, loadMaintenanceLogs]);

  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<MaintenanceSortKey>("reported_time");

  const joined = useMemo(
    () => joinMaintenanceWithFlight(logs, flights),
    [logs, flights]
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    const matching = joined.filter((log) => {
      return (
        term.length === 0 ||
        log.work_order_id.toLowerCase().includes(term) ||
        log.flight_id.toLowerCase().includes(term) ||
        log.aircraft_registration.toLowerCase().includes(term) ||
        log.reported_by_staff_id.toLowerCase().includes(term) ||
        log.closed_by_staff_id.toLowerCase().includes(term)
      );
    });

    return [...matching].sort((a, b) => {
      if (sortKey === "reported_time") {
        return (
          new Date(b.reported_time).getTime() -
          new Date(a.reported_time).getTime()
        );
      }
      if (sortKey === "resolved_time") {
        return (
          new Date(b.resolved_time).getTime() -
          new Date(a.resolved_time).getTime()
        );
      }
      return a.work_order_id.localeCompare(b.work_order_id);
    });
  }, [joined, search, sortKey]);

  return {
    logs: filtered,
    total: logs.length,
    totalWorkOrders: getTotalWorkOrders(logs),
    aircraftTracked: getAircraftTracked(logs),
    linkedFlights: getLinkedFlights(logs),
    groundedCount: getGroundedCount(logs),
    recurringCount: getRecurringCount(logs),
    recentWorkOrders: getRecentWorkOrders(joined),
    search,
    setSearch,
    sortKey,
    setSortKey,
    loading: flightsLoading || logsLoading,
  };
}
