import "server-only";
import { and, asc, desc, eq, inArray, notInArray, sql } from "drizzle-orm";
import { z } from "zod";
import {
  nextStatus,
  type OptionsSnapshot,
  type OrderStatus,
} from "@/lib/orders";
import { db } from "./index";
import { drinks, orderItems, orders, timeSlots } from "./schema";

const isUuid = (id: string) => z.uuid().safeParse(id).success;

const orderColumns = {
  id: orders.id,
  code: orders.code,
  type: orders.type,
  status: orders.status,
  slotStart: orders.slotStart,
  guestName: orders.guestName,
  total: orders.total,
  paymentMethod: orders.paymentMethod,
  paymentStatus: orders.paymentStatus,
  createdAt: orders.createdAt,
};

const selectOrders = () => db.select(orderColumns).from(orders);
type OrderRow = Awaited<ReturnType<typeof selectOrders>>[number];

// Serializable order for the tracker and the queue. No phone numbers.
async function withItems(rows: OrderRow[]) {
  if (rows.length === 0) return [];
  const itemRows = await db
    .select({
      orderId: orderItems.orderId,
      name: orderItems.nameSnapshot,
      quantity: orderItems.quantity,
      lineTotal: orderItems.lineTotal,
      options: orderItems.optionsSnapshot,
    })
    .from(orderItems)
    .where(
      inArray(
        orderItems.orderId,
        rows.map((row) => row.id),
      ),
    )
    .orderBy(asc(orderItems.id));

  return rows.map((row) => ({
    ...row,
    status: row.status as OrderStatus,
    // First name only, for the greeting and the queue card.
    guestName: row.guestName?.split(" ")[0] ?? null,
    slotStart: row.slotStart?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
    items: itemRows
      .filter((item) => item.orderId === row.id)
      .map(({ name, quantity, lineTotal, options }) => ({
        name,
        quantity,
        lineTotal,
        options: options as OptionsSnapshot,
      })),
  }));
}

export async function getOrder(id: string) {
  if (!isUuid(id)) return null;
  const rows = await selectOrders().where(eq(orders.id, id)).limit(1);
  const [order] = await withItems(rows);
  return order ?? null;
}

// Open and finished orders (not cancelled), oldest first.
export async function getOrdersByIds(ids: string[]) {
  const valid = ids.filter(isUuid);
  if (valid.length === 0) return [];
  const rows = await selectOrders()
    .where(and(inArray(orders.id, valid), notInArray(orders.status, ["cut"])))
    .orderBy(desc(orders.createdAt))
    .limit(50);
  return withItems(rows.reverse());
}

// A member's orders, newest first (Past Performances).
export async function getOrdersForUser(userId: string, limit = 20) {
  if (!isUuid(userId)) return [];
  const rows = await selectOrders()
    .where(eq(orders.userId, userId))
    .orderBy(desc(orders.createdAt))
    .limit(limit);
  return withItems(rows);
}

// Moves an order one step forward if it is still at `from`.
export async function advanceOrder(id: string, from: OrderStatus) {
  const to = nextStatus(from);
  if (!to || !isUuid(id)) return null;
  const [row] = await db
    .update(orders)
    .set({ status: to })
    .where(and(eq(orders.id, id), eq(orders.status, from)))
    .returning({ status: orders.status });
  return row?.status ?? null;
}

// Cancels an open order and frees its class spots.
export async function cutOrder(id: string) {
  if (!isUuid(id)) return false;
  return db.transaction(async (tx) => {
    const [order] = await tx
      .update(orders)
      .set({ status: "cut" })
      .where(and(eq(orders.id, id), notInArray(orders.status, ["bow", "cut"])))
      .returning({ type: orders.type, slotStart: orders.slotStart });
    if (!order) return false;

    if (order.type === "class" && order.slotStart) {
      // Same rule as booking: drinks (and Freestyle) count, snacks don't.
      const [{ drinkCount }] = await tx
        .select({
          drinkCount: sql<number>`coalesce(sum(${orderItems.quantity}), 0)::int`,
        })
        .from(orderItems)
        .leftJoin(drinks, eq(orderItems.drinkId, drinks.id))
        .where(
          and(
            eq(orderItems.orderId, id),
            sql`(${orderItems.drinkId} is null or cardinality(${drinks.tempsAllowed}) > 0)`,
          ),
        );
      if (drinkCount > 0) {
        await tx
          .update(timeSlots)
          .set({
            bookedCount: sql`greatest(0, ${timeSlots.bookedCount} - ${drinkCount})`,
          })
          .where(eq(timeSlots.startsAt, order.slotStart));
      }
    }
    return true;
  });
}

export type TrackedOrder = NonNullable<Awaited<ReturnType<typeof getOrder>>>;
