import { create } from "zustand";
import type { MaintenanceLog } from "../types/maintenance.types";
import { getMaintenanceLogs } from "../services/csv/maintenance.service";

interface MaintenanceStore {
  logs: MaintenanceLog[];
  loading: boolean;
  error: string | null;

  loadMaintenanceLogs: () => Promise<void>;
}

export const useMaintenanceStore = create<MaintenanceStore>((set) => ({
  logs: [],
  loading: false,
  error: null,

  async loadMaintenanceLogs() {
    try {
      set({
        loading: true,
        error: null,
      });

      const logs = await getMaintenanceLogs();

      set({
        logs,
        loading: false,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to load maintenance logs",
        loading: false,
      });
    }
  },
}));
