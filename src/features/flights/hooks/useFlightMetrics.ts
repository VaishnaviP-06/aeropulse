import { useEffect } from "react";
import { useFlightStore } from "../../../store/flight.store";
import {
  getTotalFlights,
  getDelayedFlights,
  getActiveFlights,
  getAverageLoadFactor,
  getRiskFlights,
} from "../utils/flightAnalytics";

export function useFlightMetrics() {
  const flights = useFlightStore(
    (state) => state.flights
  );

  const loadFlights = useFlightStore(
    (state) => state.loadFlights
  );

  useEffect(() => {
    loadFlights();
  }, [loadFlights]);

  return {
    totalFlights: getTotalFlights(flights),
    delayedFlights: getDelayedFlights(flights),
    activeFlights: getActiveFlights(flights),
    averageLoadFactor: getAverageLoadFactor(flights),
    riskFlights: getRiskFlights(flights),
  };
}