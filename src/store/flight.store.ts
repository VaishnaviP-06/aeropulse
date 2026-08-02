import { create } from "zustand";
import type { Flight } from "../types/flight.types";
import { getFlights } from "../services/csv/flight.service";

interface FlightStore {
  flights: Flight[];
  loading: boolean;
  error: string | null;

  loadFlights: () => Promise<void>;

  totalFlights: () => number;
  delayedFlights: () => number;
  activeFlights: () => number;
  averageLoadFactor: () => number;
}

export const useFlightStore = create<FlightStore>((set, get) => ({
  flights: [],
  loading: false,
  error: null,

  async loadFlights() {
    try {
      set({
        loading: true,
        error: null,
      });

      const flights = await getFlights();

      set({
        flights,
        loading: false,
      });

    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to load flights",
        loading: false,
      });
    }
  },


  totalFlights() {
    return get().flights.length;
  },


  delayedFlights() {
    return get()
      .flights
      .filter(
        (flight) =>
          Number(flight.delay_minutes) > 0
      )
      .length;
  },


  activeFlights() {
    return get()
      .flights
      .filter(
        (flight) =>
          flight.status === "Departed" ||
          flight.status === "Boarding"
      )
      .length;
  },


  averageLoadFactor() {
    const flights = get().flights;

    if (!flights.length) return 0;

    const total = flights.reduce(
      (sum, flight) =>
        sum + Number(flight.load_factor || 0),
      0
    );

    return Number(
      (total / flights.length).toFixed(2)
    );
  },
}));