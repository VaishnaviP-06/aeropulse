import { create } from "zustand";

type Theme =
  | "light"
  | "dark";

interface ThemeStore {
  theme: Theme;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  theme:
    (localStorage.getItem("theme") as Theme) || "dark",

  toggleTheme: () =>
    set((state) => {
      const next =
        state.theme === "light"
          ? "dark"
          : "light";

      localStorage.setItem(
        "theme",
        next
      );

      document.documentElement.classList.toggle(
        "dark",
        next === "dark"
      );

      return {
        theme: next,
      };
    }),
}));