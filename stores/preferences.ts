import { create } from "zustand";
import { persist } from "zustand/middleware";

type PreferencesState = {
  plainMode: boolean;
  setPlainMode: (plainMode: boolean) => void;
  togglePlainMode: () => void;
  // The first-visit "Learn the moves" overlay has been shown.
  seenWelcome: boolean;
  markWelcomeSeen: () => void;
};

// Hydrated from localStorage by <Providers /> after the first render, so
// server and client HTML match.
export const usePreferences = create<PreferencesState>()(
  persist(
    (rawSet) => {
      // Load saved preferences before any change, so an early change can't
      // overwrite them (see stores/playlist.ts).
      const set = ((...args: Parameters<typeof rawSet>) => {
        if (!usePreferences.persist.hasHydrated()) {
          usePreferences.persist.rehydrate();
        }
        rawSet(...args);
      }) as typeof rawSet;

      return {
        plainMode: false,
        setPlainMode: (plainMode) => set({ plainMode }),
        togglePlainMode: () =>
          set((state) => ({ plainMode: !state.plainMode })),
        seenWelcome: false,
        markWelcomeSeen: () => set({ seenWelcome: true }),
      };
    },
    {
      name: "gg-preferences",
      skipHydration: true,
      partialize: (state) => ({
        plainMode: state.plainMode,
        seenWelcome: state.seenWelcome,
      }),
    },
  ),
);
