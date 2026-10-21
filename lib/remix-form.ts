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

// Remix choices by group and option slug: how order snapshots and Saved
// Choreo store them, so they survive menu edits that change ids.
export type RemixRecipe = {
  choices: { group: string; options: { slug: string }[] }[];
  notes: string;
};

export function recipeFromPriced(result: PricedRemix): RemixRecipe {
  return {
    choices: result.choices.map(({ group, options }) => ({
      group: group.slug,
      options: options.map((option) => ({ slug: option.slug })),
    })),
    notes: result.notes,
  };
}

// Back to option ids for the current menu; unknown slugs are dropped and
// priceRemix fills required defaults.
export function selectionFromRecipe(
  drink: PricedDrink,
  recipe: RemixRecipe,
): RemixSelection {
  const selection: RemixSelection = {};
  for (const choice of recipe.choices) {
    const group = drink.groups.find((g) => g.slug === choice.group);
    if (!group) continue;
    selection[group.id] = choice.options.flatMap(
      ({ slug }) =>
        group.options.find((option) => option.slug === slug)?.id ?? [],
    );
  }
  return selection;
}
