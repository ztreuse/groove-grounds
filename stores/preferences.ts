import { create } from "zustand";
import { persist } from "zustand/middleware";

type PreferencesState = {
  plainMode: boolean;
  setPlainMode: (plainMode: boolean) => void;
  togglePlainMode: () => void;
};

// Hydrated from localStorage by <StoreHydrator /> after the first render, so
// server and client HTML match.
export const usePreferences = create<PreferencesState>()(
  persist(
    (set) => ({
      plainMode: false,
      setPlainMode: (plainMode) => set({ plainMode }),
      togglePlainMode: () => set((state) => ({ plainMode: !state.plainMode })),
    }),
    {
      name: "gg-preferences",
      skipHydration: true,
      partialize: (state) => ({ plainMode: state.plainMode }),
    },
  ),
);
