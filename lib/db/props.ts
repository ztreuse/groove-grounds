import "server-only";
import { and, avg, count, desc, eq, inArray, isNotNull } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "./index";
import { orderItems, orders, props } from "./schema";

// Cache tag for Props on drink pages; giving Props calls updateTag on it.
export const PROPS_TAG = "props";

// Average, count and the latest comments for a drink page.
export async function getDrinkProps(drinkId: string) {
  "use cache";
  cacheTag(PROPS_TAG);
  cacheLife("hours");

  const [[summary], recent] = await Promise.all([
    db
      .select({ average: avg(props.rating), total: count() })
      .from(props)
      .where(eq(props.drinkId, drinkId)),
    db
      .select({
        id: props.id,
        name: props.name,
        rating: props.rating,
        comment: props.comment,
        createdAt: props.createdAt,
      })
      .from(props)
      .where(and(eq(props.drinkId, drinkId), isNotNull(props.comment)))
      .orderBy(desc(props.createdAt))
      .limit(3),
  ]);
  return {
    average: summary.average ? Number(summary.average) : null,
    total: summary.total,
    recent: recent.map((row) => ({
      ...row,
      createdAt: row.createdAt.toISOString(),
    })),
  };
}

// Drinks on an order that already have Props.
export async function getRatedDrinkIds(orderId: string) {
  const rows = await db
    .select({ drinkId: props.drinkId })
    .from(props)
    .where(eq(props.orderId, orderId));
  return rows.map((row) => row.drinkId);
}

// Props for one drink on a picked-up order. False if the order isn't at
// Bow, the drink isn't on it, or it already has Props.
export async function giveProps(values: {
  orderId: string;
  drinkId: string;
  rating: number;
  comment: string | null;
}) {
  const [order] = await db
    .select({ userId: orders.userId, name: orders.guestName })
    .from(orders)
    .innerJoin(orderItems, eq(orderItems.orderId, orders.id))
    .where(
      and(
        eq(orders.id, values.orderId),
        eq(orders.status, "bow"),
        inArray(orderItems.drinkId, [values.drinkId]),
      ),
    )
    .limit(1);
  if (!order) return false;
  const [row] = await db
    .insert(props)
    .values({
      ...values,
      userId: order.userId,
      name: order.name?.split(" ")[0] ?? null,
    })
    .onConflictDoNothing()
    .returning({ id: props.id });
  return Boolean(row);
}

export type DrinkProps = Awaited<ReturnType<typeof getDrinkProps>>;
