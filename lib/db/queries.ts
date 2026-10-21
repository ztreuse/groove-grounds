import "server-only";
import { asc, eq, inArray } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import type { RemixGroup } from "@/lib/pricing";
import { db } from "./index";
import {
  drinkOptionGroups,
  drinks,
  genres,
  optionGroups,
  options,
} from "./schema";

// Cache tag for everything on the menu. Backstage edits call updateTag(MENU_TAG).
export const MENU_TAG = "menu";

export async function getLineup() {
  "use cache";
  cacheTag(MENU_TAG);
  cacheLife("hours");

  const [genreRows, drinkRows] = await Promise.all([
    db
      .select({ slug: genres.slug, name: genres.name })
      .from(genres)
      .orderBy(asc(genres.sortOrder)),
    db
      .select({
        id: drinks.id,
        slug: drinks.slug,
        name: drinks.name,
        danceStyle: drinks.danceStyle,
        plainDescription: drinks.plainDescription,
        basePrice: drinks.basePrice,
        tempsAllowed: drinks.tempsAllowed,
        isAvailable: drinks.isAvailable,
        genreSlug: genres.slug,
      })
      .from(drinks)
      .innerJoin(genres, eq(drinks.genreId, genres.id))
      .orderBy(asc(genres.sortOrder), asc(drinks.sortOrder)),
  ]);

  return { genres: genreRows, drinks: drinkRows };
}

export async function getDrinkSlugs() {
  "use cache";
  cacheTag(MENU_TAG);
  cacheLife("hours");

  const rows = await db.select({ slug: drinks.slug }).from(drinks);
  return rows.map((row) => row.slug);
}

// One drink with its Remix groups and their options, in menu order.
export async function getDrinkBySlug(slug: string) {
  "use cache";
  cacheTag(MENU_TAG);
  cacheLife("hours");

  const [drink] = await db
    .select({
      id: drinks.id,
      slug: drinks.slug,
      name: drinks.name,
      danceStyle: drinks.danceStyle,
      blurb: drinks.blurb,
      plainDescription: drinks.plainDescription,
      basePrice: drinks.basePrice,
      imageUrl: drinks.imageUrl,
      tempsAllowed: drinks.tempsAllowed,
      isAvailable: drinks.isAvailable,
      genreSlug: genres.slug,
    })
    .from(drinks)
    .innerJoin(genres, eq(drinks.genreId, genres.id))
    .where(eq(drinks.slug, slug))
    .limit(1);
  if (!drink) return null;

  const groupRows = await db
    .select({
      id: optionGroups.id,
      slug: optionGroups.slug,
      danceLabel: optionGroups.danceLabel,
      plainLabel: optionGroups.plainLabel,
      type: optionGroups.type,
      required: optionGroups.required,
      maxSelect: optionGroups.maxSelect,
      defaultOptionId: drinkOptionGroups.defaultOptionId,
    })
    .from(drinkOptionGroups)
    .innerJoin(optionGroups, eq(drinkOptionGroups.groupId, optionGroups.id))
    .where(eq(drinkOptionGroups.drinkId, drink.id))
    .orderBy(asc(optionGroups.sortOrder));

  const optionRows = groupRows.length
    ? await db
        .select({
          id: options.id,
          groupId: options.groupId,
          slug: options.slug,
          danceLabel: options.danceLabel,
          plainLabel: options.plainLabel,
          priceDelta: options.priceDelta,
          isAvailable: options.isAvailable,
        })
        .from(options)
        .where(
          inArray(
            options.groupId,
            groupRows.map((group) => group.id),
          ),
        )
        .orderBy(asc(options.sortOrder))
    : [];

  const groups: RemixGroup[] = groupRows.map((group) => ({
    ...group,
    options: optionRows
      .filter((option) => option.groupId === group.id)
      .map((option) => ({
        id: option.id,
        slug: option.slug,
        danceLabel: option.danceLabel,
        plainLabel: option.plainLabel,
        priceDelta: option.priceDelta,
        isAvailable: option.isAvailable,
      })),
  }));

  return { ...drink, groups };
}

export type Lineup = Awaited<ReturnType<typeof getLineup>>;
export type DrinkDetail = NonNullable<
  Awaited<ReturnType<typeof getDrinkBySlug>>
>;
export type LineupGenre = Lineup["genres"][number];
export type LineupDrink = Lineup["drinks"][number];
