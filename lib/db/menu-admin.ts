import "server-only";
import { asc, eq } from "drizzle-orm";
import { drinkImageSrc } from "@/lib/drink-images";
import { db } from "./index";
import {
  drinkOptionGroups,
  drinks,
  genres,
  optionGroups,
  options,
} from "./schema";

// Backstage menu manager: everything on the menu, uncached, including
// items Sitting out and the Freestyle bases.
export async function getMenuForAdmin() {
  const [genreRows, drinkRows, groupRows, optionRows] = await Promise.all([
    db
      .select({ id: genres.id, slug: genres.slug, name: genres.name })
      .from(genres)
      .orderBy(asc(genres.sortOrder)),
    db
      .select({
        id: drinks.id,
        genreId: drinks.genreId,
        slug: drinks.slug,
        name: drinks.name,
        danceStyle: drinks.danceStyle,
        blurb: drinks.blurb,
        plainDescription: drinks.plainDescription,
        basePrice: drinks.basePrice,
        imageUrl: drinks.imageUrl,
        tempsAllowed: drinks.tempsAllowed,
        isAvailable: drinks.isAvailable,
        isFeatured: drinks.isFeatured,
      })
      .from(drinks)
      .orderBy(asc(drinks.sortOrder), asc(drinks.name)),
    db
      .select({
        id: optionGroups.id,
        slug: optionGroups.slug,
        danceLabel: optionGroups.danceLabel,
        plainLabel: optionGroups.plainLabel,
        type: optionGroups.type,
      })
      .from(optionGroups)
      .orderBy(asc(optionGroups.sortOrder)),
    db
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
      .orderBy(asc(options.sortOrder)),
  ]);

  return {
    genres: genreRows,
    drinks: drinkRows.map(({ imageUrl, ...drink }) => ({
      ...drink,
      imageSrc: drinkImageSrc(drink.slug, imageUrl),
    })),
    groups: groupRows
      .filter((group) => group.type !== "text")
      .map((group) => ({
        ...group,
        options: optionRows.filter((option) => option.groupId === group.id),
      })),
  };
}

export type AdminMenu = Awaited<ReturnType<typeof getMenuForAdmin>>;
export type AdminDrink = AdminMenu["drinks"][number];

// The Remix groups (and defaults) a new item inherits: from the first
// item in its genre with the same kind of temps.
export async function templateGroupsFor(genreId: string, isSnack: boolean) {
  const siblings = await db
    .select({ id: drinks.id, temps: drinks.tempsAllowed })
    .from(drinks)
    .where(eq(drinks.genreId, genreId))
    .orderBy(asc(drinks.sortOrder));
  const template = siblings.find(
    (drink) => (drink.temps.length === 0) === isSnack,
  );
  if (!template) return [];
  return db
    .select({
      groupId: drinkOptionGroups.groupId,
      defaultOptionId: drinkOptionGroups.defaultOptionId,
    })
    .from(drinkOptionGroups)
    .where(eq(drinkOptionGroups.drinkId, template.id));
}
