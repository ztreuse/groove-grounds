import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MAX_QUANTITY } from "@/lib/checkout";
import type { RemixSelection } from "@/lib/pricing";

export { MAX_QUANTITY };

// Labels are copied in so the Playlist can show the Remix summary without
// refetching the menu.
export type PlaylistChoice = {
  groupId: string;
  danceLabel: string;
  plainLabel: string;
  options: { id: string; danceLabel: string; plainLabel: string }[];
};

export type PlaylistItem = {
  id: string;
  drinkId: string;
  slug: string;
  name: string;
  plainDescription: string;
  // Preview only: Showtime recalculates prices on the server.
  unitPrice: number;
  quantity: number;
  selection: RemixSelection;
  notes: string;
  choices: PlaylistChoice[];
  // Drinks count toward class capacity; Intermission snacks do not.
  isDrink?: boolean;
};

export type NewPlaylistItem = Omit<PlaylistItem, "id">;

type PlaylistState = {
  items: PlaylistItem[];
  addItem: (item: NewPlaylistItem) => void;
  updateItem: (id: string, item: NewPlaylistItem) => void;
  setQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clear: () => void;
};

const clampQuantity = (quantity: number) =>
  Math.min(MAX_QUANTITY, Math.max(1, Math.round(quantity)));

// Same drink, same Remix and same notes count as one Playlist line.
function signature(item: NewPlaylistItem) {
  const picks = Object.entries(item.selection)
    .filter(([, ids]) => ids.length > 0)
    .map(([groupId, ids]) => `${groupId}=${[...ids].sort().join(",")}`)
    .sort()
    .join("|");
  return `${item.drinkId}|${picks}|${item.notes.trim()}`;
}

export const usePlaylist = create<PlaylistState>()(
  persist(
    (rawSet) => {
      // Load the saved Playlist before any change. Otherwise a change made
      // before <Providers> hydrates the store would overwrite the saved copy.
      const set = ((...args: Parameters<typeof rawSet>) => {
        if (!usePlaylist.persist.hasHydrated()) {
          usePlaylist.persist.rehydrate();
        }
        rawSet(...args);
      }) as typeof rawSet;

      return {
        items: [],
        addItem: (item) =>
          set((state) => {
            const match = state.items.find(
              (existing) => signature(existing) === signature(item),
            );
            if (match) {
              return {
                items: state.items.map((existing) =>
                  existing === match
                    ? {
                        ...existing,
                        unitPrice: item.unitPrice,
                        quantity: clampQuantity(
                          existing.quantity + item.quantity,
                        ),
                      }
                    : existing,
                ),
              };
            }
            return {
              items: [
                ...state.items,
                {
                  ...item,
                  id: crypto.randomUUID(),
                  quantity: clampQuantity(item.quantity),
                },
              ],
            };
          }),
        updateItem: (id, item) =>
          set((state) => ({
            items: state.items.map((existing) =>
              existing.id === id
                ? { ...item, id, quantity: clampQuantity(item.quantity) }
                : existing,
            ),
          })),
        setQuantity: (id, quantity) =>
          set((state) => ({
            items: state.items.map((item) =>
              item.id === id
                ? { ...item, quantity: clampQuantity(quantity) }
                : item,
            ),
          })),
        removeItem: (id) =>
          set((state) => ({
            items: state.items.filter((item) => item.id !== id),
          })),
        clear: () => set({ items: [] }),
      };
    },
    {
      name: "gg-playlist",
      version: 1,
      // Version 0 only stored ids and quantities; start fresh.
      migrate: () => ({ items: [] }),
      skipHydration: true,
      partialize: (state) => ({ items: state.items }),
    },
  ),
);

// Items saved before isDrink existed: snacks are the only items with no Remix choices.
export const isDrinkItem = (item: PlaylistItem) =>
  item.isDrink ?? item.choices.length > 0;

export const selectItemCount = (state: PlaylistState) =>
  state.items.reduce((total, item) => total + item.quantity, 0);
