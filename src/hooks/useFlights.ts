import { useEffect } from "react";
import { useFlightStore } from "../store/flight.store";

export function useFlights() {
  const flights = useFlightStore(
    (state) => state.flights
  );

  const loading = useFlightStore(
    (state) => state.loading
  );

  const error = useFlightStore(
    (state) => state.error
  );

  const loadFlights = useFlightStore(
    (state) => state.loadFlights
  );

  useEffect(() => {
    if (!flights.length) {
      loadFlights();
    }
  }, [
    flights.length,
    loadFlights,
  ]);

  return {
    flights,
    loading,
    error,
  };
}