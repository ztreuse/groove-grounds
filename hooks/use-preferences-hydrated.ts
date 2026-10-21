"use client";

import { useSyncExternalStore } from "react";
import { usePreferences } from "@/stores/preferences";

// False until saved preferences have loaded from localStorage.
export function usePreferencesHydrated() {
  return useSyncExternalStore(
    (onChange) => usePreferences.persist.onFinishHydration(onChange),
    () => usePreferences.persist.hasHydrated(),
    () => false,
  );
}
