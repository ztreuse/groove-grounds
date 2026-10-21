import "server-only";
import { asc, eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "./index";
import { drinks, genres } from "./schema";

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

export type Lineup = Awaited<ReturnType<typeof getLineup>>;
export type LineupGenre = Lineup["genres"][number];
export type LineupDrink = Lineup["drinks"][number];
