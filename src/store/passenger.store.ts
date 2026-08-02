import { create } from "zustand";
import type { Passenger } from "../types/passenger.types";
import { getPassengers } from "../services/csv/passenger.service";

interface PassengerStore {
  passengers: Passenger[];
  loading: boolean;
  error: string | null;

  loadPassengers: () => Promise<void>;
}

export const usePassengerStore = create<PassengerStore>((set) => ({
  passengers: [],
  loading: false,
  error: null,

  async loadPassengers() {
    try {
      set({
        loading: true,
        error: null,
      });

      const passengers = await getPassengers();

      set({
        passengers,
        loading: false,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to load passengers",
        loading: false,
      });
    }
  },
}));
