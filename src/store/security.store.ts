import { create } from "zustand";
import type { SecurityScreening } from "../types/security.types";
import { getSecurityScreening } from "../services/csv/security.service";

interface SecurityStore {
  screenings: SecurityScreening[];
  loading: boolean;
  error: string | null;

  loadSecurityScreening: () => Promise<void>;
}

export const useSecurityStore = create<SecurityStore>((set) => ({
  screenings: [],
  loading: false,
  error: null,

  async loadSecurityScreening() {
    try {
      set({
        loading: true,
        error: null,
      });

      const screenings = await getSecurityScreening();

      set({
        screenings,
        loading: false,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to load security screening",
        loading: false,
      });
    }
  },
}));
