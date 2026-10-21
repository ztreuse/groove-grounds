// Remix price calculation. Pure functions with no browser or server imports,
// so the drink page previews prices with it and Showtime recalculates them
// on the server from fresh database rows.

export type Temperature = "hot" | "iced" | "blended";

export type RemixOption = {
  id: string;
  slug: string;
  danceLabel: string;
  plainLabel: string;
  priceDelta: number;
  isAvailable: boolean;
};

export type RemixGroup = {
  id: string;
  slug: string;
  danceLabel: string;
  plainLabel: string;
  type: "single" | "multi" | "text";
  required: boolean;
  // Max picks for multi groups; character limit for text groups.
  maxSelect: number | null;
  defaultOptionId: string | null;
  options: RemixOption[];
};

export type PricedDrink = {
  basePrice: number;
  tempsAllowed: Temperature[];
  groups: RemixGroup[];
};

// Option ids picked per group id. Text groups use `notes` instead.
export type RemixSelection = Record<string, string[]>;

export type RemixChoice = {
  group: RemixGroup;
  options: RemixOption[];
};

export type PricedRemix = {
  unitPrice: number;
  choices: RemixChoice[];
  notes: string;
};

const NOTES_FALLBACK_LIMIT = 140;

// Options a customer can see for this drink: temperature choices are limited
// to the drink's allowed temps.
export function optionsFor(group: RemixGroup, tempsAllowed: Temperature[]) {
  if (group.slug !== "temperature") return group.options;
  return group.options.filter((option) =>
    tempsAllowed.includes(option.slug as Temperature),
  );
}

// Ice level only makes sense for iced or blended drinks.
export function isGroupHidden(
  group: RemixGroup,
  drink: PricedDrink,
  selection: RemixSelection,
) {
  if (group.slug !== "freeze") return false;
  return chosenTemperature(drink, selection) === "hot";
}

function chosenTemperature(drink: PricedDrink, selection: RemixSelection) {
  const group = drink.groups.find((g) => g.slug === "temperature");
  if (!group) return drink.tempsAllowed[0];
  const id = selection[group.id]?.[0] ?? group.defaultOptionId;
  return group.options.find((option) => option.id === id)?.slug as
    Temperature | undefined;
}

// Cleans up a selection (drops unknown, sold-out or extra picks and fills
// required defaults) and prices it. The default option of a group is part of
// the base price, so it never adds to the total.
export function priceRemix(
  drink: PricedDrink,
  selection: RemixSelection,
  notes = "",
): PricedRemix {
  let unitPrice = drink.basePrice;
  const choices: RemixChoice[] = [];
  let cleanNotes = "";

  for (const group of drink.groups) {
    if (group.type === "text") {
      cleanNotes = notes
        .trim()
        .slice(0, group.maxSelect ?? NOTES_FALLBACK_LIMIT);
      continue;
    }
    if (isGroupHidden(group, drink, selection)) continue;

    const available = optionsFor(group, drink.tempsAllowed).filter(
      (option) => option.isAvailable,
    );
    const limit = group.type === "single" ? 1 : (group.maxSelect ?? Infinity);
    let picked = (selection[group.id] ?? [])
      .map((id) => available.find((option) => option.id === id))
      .filter((option): option is RemixOption => Boolean(option))
      .filter((option, index, list) => list.indexOf(option) === index)
      .slice(0, limit);

    if (picked.length === 0 && group.required) {
      const fallback =
        available.find((option) => option.id === group.defaultOptionId) ??
        available[0];
      if (fallback) picked = [fallback];
    }
    if (picked.length === 0) continue;

    for (const option of picked) {
      if (option.id !== group.defaultOptionId) unitPrice += option.priceDelta;
    }
    choices.push({ group, options: picked });
  }

  return { unitPrice, choices, notes: cleanNotes };
}

// The drink's default Remix choices, used to start the form.
export function defaultSelection(drink: PricedDrink): RemixSelection {
  const selection: RemixSelection = {};
  for (const group of drink.groups) {
    if (group.type === "text") continue;
    const visible = optionsFor(group, drink.tempsAllowed);
    const fallback = group.required ? visible[0]?.id : undefined;
    const id =
      visible.find((option) => option.id === group.defaultOptionId)?.id ??
      fallback;
    selection[group.id] = id ? [id] : [];
  }
  return selection;
}
