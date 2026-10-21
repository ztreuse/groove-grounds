"use client";

import { useSyncExternalStore } from "react";
import { usePlaylist } from "@/stores/playlist";

// False until the Playlist has loaded from localStorage, so pages don't flash
// the empty state.
export function usePlaylistHydrated() {
  return useSyncExternalStore(
    (onChange) => usePlaylist.persist.onFinishHydration(onChange),
    () => usePlaylist.persist.hasHydrated(),
    () => false,
  );
}
