import { z } from "zod";
import { MAX_QUANTITY, NOTES_LIMIT } from "@/lib/checkout";
import {
  defaultSelection,
  type PricedDrink,
  type PricedRemix,
  type RemixGroup,
  type RemixSelection,
} from "@/lib/pricing";
import type { NewPlaylistItem } from "@/stores/playlist";

// Form helpers shared by the drink page's Remix panel and Freestyle.

export const remixSchema = z.object({
  // Keyed by group slug: a radio gives a string, checkboxes give an array.
  options: z.record(
    z.string(),
    z.union([z.string(), z.array(z.string()), z.boolean()]),
  ),
  notes: z.string().max(NOTES_LIMIT),
  quantity: z.number().int().min(1).max(MAX_QUANTITY),
});

export type RemixFormValues = z.infer<typeof remixSchema>;

export function toSelection(
  groups: RemixGroup[],
  values: RemixFormValues["options"] = {},
): RemixSelection {
  const selection: RemixSelection = {};
  for (const group of groups) {
    const value = values[group.slug];
    selection[group.id] = Array.isArray(value)
      ? value
      : typeof value === "string" && value
        ? [value]
        : [];
  }
  return selection;
}

export function toFormOptions(
  drink: PricedDrink,
  selection: RemixSelection = defaultSelection(drink),
) {
  const values: RemixFormValues["options"] = {};
  for (const group of drink.groups) {
    if (group.type === "text") continue;
    const ids = selection[group.id] ?? [];
    values[group.slug] = group.type === "multi" ? ids : (ids[0] ?? "");
  }
  return values;
}

type ItemDrink = {
  id: string;
  slug: string;
  name: string;
  plainDescription: string;
  tempsAllowed: unknown[];
};

// A Playlist item from a priced Remix.
export function toPlaylistItem(
  drink: ItemDrink,
  result: PricedRemix,
  quantity: number,
  extra: Partial<NewPlaylistItem> = {},
): NewPlaylistItem {
  return {
    drinkId: drink.id,
    slug: drink.slug,
    name: drink.name,
    plainDescription: drink.plainDescription,
    isDrink: drink.tempsAllowed.length > 0,
    unitPrice: result.unitPrice,
    quantity,
    selection: Object.fromEntries(
      result.choices.map(({ group, options }) => [
        group.id,
        options.map((option) => option.id),
      ]),
    ),
    notes: result.notes,
    choices: result.choices.map(({ group, options }) => ({
      groupId: group.id,
      danceLabel: group.danceLabel,
      plainLabel: group.plainLabel,
      options: options.map(({ id, danceLabel, plainLabel }) => ({
        id,
        danceLabel,
        plainLabel,
      })),
    })),
    ...extra,
  };
}
