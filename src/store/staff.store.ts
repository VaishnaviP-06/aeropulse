import { create } from "zustand";
import type { StaffShift } from "../types/staff.types";
import { getStaffShifts } from "../services/csv/staff.service";

interface StaffStore {
  shifts: StaffShift[];
  loading: boolean;
  error: string | null;

  loadStaffShifts: () => Promise<void>;
}

export const useStaffStore = create<StaffStore>((set) => ({
  shifts: [],
  loading: false,
  error: null,

  async loadStaffShifts() {
    try {
      set({
        loading: true,
        error: null,
      });

      const shifts = await getStaffShifts();

      set({
        shifts,
        loading: false,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to load staff shifts",
        loading: false,
      });
    }
  },
}));
