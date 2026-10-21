import { create } from "zustand";
import { persist } from "zustand/middleware";

// Minimal Playlist (cart) for the header count. Step 5 adds the drink,
// Remix choices and add / edit / remove actions.
export type PlaylistItem = {
  id: string;
  quantity: number;
};

type PlaylistState = {
  items: PlaylistItem[];
  clear: () => void;
};

export const usePlaylist = create<PlaylistState>()(
  persist(
    (set) => ({
      items: [],
      clear: () => set({ items: [] }),
    }),
    {
      name: "gg-playlist",
      skipHydration: true,
      partialize: (state) => ({ items: state.items }),
    },
  ),
);

export const selectItemCount = (state: PlaylistState) =>
  state.items.reduce((total, item) => total + item.quantity, 0);
