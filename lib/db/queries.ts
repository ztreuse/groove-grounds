import "server-only";
import {
  and,
  asc,
  desc,
  eq,
  gte,
  inArray,
  lte,
  ne,
  sql,
  type SQL,
} from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import type { RemixGroup } from "@/lib/pricing";
import { schedule, slotsForDay } from "@/lib/schedule";
import { db } from "./index";
import {
  drinkOptionGroups,
  drinks,
  genres,
  optionGroups,
  options,
  orderItems,
  orders,
  timeSlots,
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
        isFeatured: drinks.isFeatured,
        genreSlug: genres.slug,
      })
      .from(drinks)
      .innerJoin(genres, eq(drinks.genreId, genres.id))
      .orderBy(asc(genres.sortOrder), asc(drinks.sortOrder)),
  ]);

  return { genres: genreRows, drinks: drinkRows };
}

// Most-ordered drinks over the last 30 days, for Trending Choreo.
export async function getTrendingDrinkIds() {
  "use cache";
  cacheTag("trending");
  cacheLife("hours");

  const ordered = sql<number>`sum(${orderItems.quantity})::int`;
  const rows = await db
    .select({ drinkId: orderItems.drinkId, ordered })
    .from(orderItems)
    .innerJoin(orders, eq(orderItems.orderId, orders.id))
    .where(
      and(
        ne(orders.status, "cut"),
        gte(orders.createdAt, sql`now() - interval '30 days'`),
      ),
    )
    .groupBy(orderItems.drinkId)
    .orderBy(desc(ordered))
    .limit(8);
  return rows.flatMap((row) => (row.drinkId ? [row.drinkId] : []));
}

export async function getDrinkSlugs() {
  "use cache";
  cacheTag(MENU_TAG);
  cacheLife("hours");

  const rows = await db.select({ slug: drinks.slug }).from(drinks);
  return rows.map((row) => row.slug);
}

// Drinks with their Remix groups and options, in menu order.
async function loadDrinks(where: SQL) {
  const drinkRows = await db
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
    .where(where);
  if (drinkRows.length === 0) return [];

  const groupRows = await db
    .select({
      drinkId: drinkOptionGroups.drinkId,
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
    .where(
      inArray(
        drinkOptionGroups.drinkId,
        drinkRows.map((drink) => drink.id),
      ),
    )
    .orderBy(asc(optionGroups.sortOrder));

  const groupIds = [...new Set(groupRows.map((group) => group.id))];
  const optionRows = groupIds.length
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
        .where(inArray(options.groupId, groupIds))
        .orderBy(asc(options.sortOrder))
    : [];

  return drinkRows.map((drink) => {
    const groups: RemixGroup[] = groupRows
      .filter((group) => group.drinkId === drink.id)
      .map((group) => ({
        id: group.id,
        slug: group.slug,
        danceLabel: group.danceLabel,
        plainLabel: group.plainLabel,
        type: group.type,
        required: group.required,
        maxSelect: group.maxSelect,
        defaultOptionId: group.defaultOptionId,
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
  });
}

export async function getDrinkBySlug(slug: string) {
  "use cache";
  cacheTag(MENU_TAG);
  cacheLife("hours");

  const [drink] = await loadDrinks(eq(drinks.slug, slug));
  return drink ?? null;
}

// Uncached: checkout always prices from the current menu.
export async function getDrinksForCheckout(ids: string[]) {
  if (ids.length === 0) return [];
  return loadDrinks(inArray(drinks.id, ids));
}

// Spots left in each bookable slot on a Manila day.
export async function getSlotAvailability(day: string, now: Date) {
  const starts = slotsForDay(day, now);
  if (starts.length === 0) return [];

  const rows = await db
    .select({
      startsAt: timeSlots.startsAt,
      capacity: timeSlots.capacity,
      bookedCount: timeSlots.bookedCount,
    })
    .from(timeSlots)
    .where(
      and(
        gte(timeSlots.startsAt, new Date(starts[0])),
        lte(timeSlots.startsAt, new Date(starts[starts.length - 1])),
      ),
    );
  const booked = new Map(
    rows.map((row) => [
      row.startsAt.toISOString(),
      row.capacity - row.bookedCount,
    ]),
  );

  return starts.map((startsAt) => ({
    startsAt,
    remaining: Math.max(0, booked.get(startsAt) ?? schedule.slotCapacity),
  }));
}

export type Lineup = Awaited<ReturnType<typeof getLineup>>;
export type DrinkDetail = NonNullable<
  Awaited<ReturnType<typeof getDrinkBySlug>>
>;
export type LineupGenre = Lineup["genres"][number];
export type LineupDrink = Lineup["drinks"][number];
export type SlotAvailability = Awaited<
  ReturnType<typeof getSlotAvailability>
>[number];
