import { create } from "zustand";
import type { RetailTransaction } from "../types/retail.types";
import { getRetailTransactions } from "../services/csv/retail.service";

interface RetailStore {
  transactions: RetailTransaction[];
  loading: boolean;
  error: string | null;

  loadRetailTransactions: () => Promise<void>;
}

export const useRetailStore = create<RetailStore>((set) => ({
  transactions: [],
  loading: false,
  error: null,

  async loadRetailTransactions() {
    try {
      set({
        loading: true,
        error: null,
      });

      const transactions = await getRetailTransactions();

      set({
        transactions,
        loading: false,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to load retail transactions",
        loading: false,
      });
    }
  },
}));
