import "server-only";
import { and, count, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { dance, fill } from "@/lib/copy";
import { priceRemix } from "@/lib/pricing";
import {
  selectionFromRecipe,
  toPlaylistItem,
  type RemixRecipe,
} from "@/lib/remix-form";
import type { NewPlaylistItem } from "@/stores/playlist";
import { db } from "./index";
import { getOrderItemsForUser } from "./orders";
import {
  FREESTYLE_GENRE,
  getDrinksBySlugs,
  getDrinksForCheckout,
} from "./queries";
import { savedChoreo } from "./schema";

export const MAX_SAVED_CHOREO = 30;
const isUuid = (id: string) => z.uuid().safeParse(id).success;

type CheckoutDrink = Awaited<ReturnType<typeof getDrinksForCheckout>>[number];

// A Playlist item for a drink and recipe, priced from the current menu.
// Null when the drink is Sitting out.
function itemFor(
  drink: CheckoutDrink,
  recipe: RemixRecipe,
  quantity: number,
  choreoName?: string,
): NewPlaylistItem | null {
  if (!drink.isAvailable) return null;
  const result = priceRemix(
    drink,
    selectionFromRecipe(drink, recipe),
    recipe.notes,
  );
  if (drink.genreSlug !== FREESTYLE_GENRE) {
    return toPlaylistItem(drink, result, quantity);
  }
  return toPlaylistItem(drink, result, quantity, {
    kind: "freestyle",
    choreoName,
    name: choreoName ?? fill(dance.freestyle.defaultName, { base: drink.name }),
  });
}

export async function listChoreo(userId: string) {
  const rows = await db
    .select({
      id: savedChoreo.id,
      name: savedChoreo.name,
      base: savedChoreo.base,
      options: savedChoreo.options,
    })
    .from(savedChoreo)
    .where(eq(savedChoreo.userId, userId))
    .orderBy(desc(savedChoreo.createdAt));

  const drinks = await getDrinksBySlugs([...new Set(rows.map((r) => r.base))]);
  return rows.map((row) => {
    const drink = drinks.find((d) => d.slug === row.base);
    const item = drink
      ? itemFor(drink, row.options as RemixRecipe, 1, row.name)
      : null;
    return {
      id: row.id,
      name: row.name,
      baseName: drink?.name ?? row.base,
      available: !!item,
      unitPrice: item?.unitPrice ?? null,
      choices: item?.choices ?? [],
      notes: (row.options as RemixRecipe).notes,
    };
  });
}

export type SavedChoreoEntry = Awaited<ReturnType<typeof listChoreo>>[number];

export async function insertChoreo(
  userId: string,
  values: { name: string; base: string; recipe: RemixRecipe },
) {
  const [{ total }] = await db
    .select({ total: count() })
    .from(savedChoreo)
    .where(eq(savedChoreo.userId, userId));
  if (total >= MAX_SAVED_CHOREO) return false;
  await db.insert(savedChoreo).values({
    userId,
    name: values.name,
    base: values.base,
    options: values.recipe,
  });
  return true;
}

export async function deleteChoreo(userId: string, id: string) {
  if (!isUuid(id)) return;
  await db
    .delete(savedChoreo)
    .where(and(eq(savedChoreo.id, id), eq(savedChoreo.userId, userId)));
}

// Run it back: Playlist items for a saved choreo or a past order.
export async function choreoPlaylistItems(userId: string, id: string) {
  if (!isUuid(id)) return null;
  const [row] = await db
    .select({
      name: savedChoreo.name,
      base: savedChoreo.base,
      options: savedChoreo.options,
    })
    .from(savedChoreo)
    .where(and(eq(savedChoreo.id, id), eq(savedChoreo.userId, userId)))
    .limit(1);
  if (!row) return null;
  const [drink] = await getDrinksBySlugs([row.base]);
  const item = drink && itemFor(drink, row.options as RemixRecipe, 1, row.name);
  return { items: item ? [item] : [], skipped: item ? [] : [row.name] };
}

export async function orderPlaylistItems(userId: string, orderId: string) {
  const lines = await getOrderItemsForUser(userId, orderId);
  if (!lines) return null;
  const drinks = await getDrinksForCheckout([
    ...new Set(lines.flatMap((line) => line.drinkId ?? [])),
  ]);

  const items: NewPlaylistItem[] = [];
  const skipped: string[] = [];
  for (const line of lines) {
    const drink = drinks.find((d) => d.id === line.drinkId);
    // Freestyle names were saved as "Choreo name (Freestyle Base)".
    const suffix = drink ? ` (${dance.terms.freestyle} ${drink.name})` : "";
    const choreoName =
      suffix && line.name.endsWith(suffix)
        ? line.name.slice(0, -suffix.length)
        : undefined;
    const item =
      drink && itemFor(drink, line.recipe, line.quantity, choreoName);
    if (item) items.push(item);
    else skipped.push(line.name);
  }
  return { items, skipped };
}
