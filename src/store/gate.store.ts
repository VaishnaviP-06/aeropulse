import { create } from "zustand";
import type { GateEvent } from "../types/gate.types";
import { getGateEvents } from "../services/csv/gate.service";

interface GateStore {
  events: GateEvent[];
  loading: boolean;
  error: string | null;

  loadGateEvents: () => Promise<void>;
}

export const useGateStore = create<GateStore>((set) => ({
  events: [],
  loading: false,
  error: null,

  async loadGateEvents() {
    try {
      set({
        loading: true,
        error: null,
      });

      const events = await getGateEvents();

      set({
        events,
        loading: false,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to load gate events",
        loading: false,
      });
    }
  },
}));
