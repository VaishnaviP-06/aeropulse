import { create } from "zustand";
import type { Bag } from "../types/baggage.types";
import { getBaggage } from "../services/csv/baggage.service";

interface BaggageStore {
  bags: Bag[];
  loading: boolean;
  error: string | null;

  loadBaggage: () => Promise<void>;
}

export const useBaggageStore = create<BaggageStore>((set) => ({
  bags: [],
  loading: false,
  error: null,

  async loadBaggage() {
    try {
      set({
        loading: true,
        error: null,
      });

      const bags = await getBaggage();

      set({
        bags,
        loading: false,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to load baggage",
        loading: false,
      });
    }
  },
}));
