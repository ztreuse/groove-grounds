"use server";

import { randomInt } from "node:crypto";
import { sql } from "drizzle-orm";
import {
  orderPayloadSchema,
  type CreateOrderResult,
  type OrderPayload,
} from "@/lib/checkout";
import { db } from "@/lib/db";
import { dance } from "@/lib/copy";
import {
  FREESTYLE_GENRE,
  getDrinksForCheckout,
  getSlotAvailability,
} from "@/lib/db/queries";
import { orderItems, orders, timeSlots } from "@/lib/db/schema";
import { rememberDemoOrder } from "@/lib/demo-orders";
import { priceRemix, type PricedRemix } from "@/lib/pricing";
import { isBookableDay, isBookableSlot, schedule } from "@/lib/schedule";

type CheckoutFailure = Extract<CreateOrderResult, { ok: false }>;
type CheckoutDrink = Awaited<ReturnType<typeof getDrinksForCheckout>>[number];
type OrderLine = {
  drink: CheckoutDrink;
  priced: PricedRemix;
  quantity: number;
  name: string;
};

class CheckoutError extends Error {
  constructor(public result: CheckoutFailure) {
    super(result.error);
  }
}

// No 0/O or 1/I/L, so codes are easy to read out at the counter.
const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
function orderCode() {
  let code = "GG-";
  for (let i = 0; i < 5; i++)
    code += CODE_ALPHABET[randomInt(CODE_ALPHABET.length)];
  return code;
}

function isDuplicateCode(error: unknown) {
  const cause = (error as { cause?: unknown })?.cause ?? error;
  const { code, constraint_name } = cause as {
    code?: string;
    constraint_name?: string;
  };
  return code === "23505" && constraint_name === "orders_code_unique";
}

export async function fetchSlots(day: string) {
  const now = new Date();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || !isBookableDay(day, now)) return [];
  return getSlotAvailability(day, now);
}

// Creates a demo order. Prices are recalculated here from the database; the
// totals shown in the browser are only a preview.
export async function createOrder(
  payload: OrderPayload,
): Promise<CreateOrderResult> {
  const parsed = orderPayloadSchema.safeParse(payload);
  if (!parsed.success) {
    const slotIssue = parsed.error.issues.some((issue) =>
      issue.path.includes("slotStart"),
    );
    return { ok: false, error: slotIssue ? "errorSlot" : "errorGeneric" };
  }
  const { form, items } = parsed.data;
  const now = new Date();
  const isClass = form.orderType === "class";

  if (isClass && !isBookableSlot(form.slotStart, now)) {
    return { ok: false, error: "errorSlot" };
  }

  const drinkRows = await getDrinksForCheckout([
    ...new Set(items.map((item) => item.drinkId)),
  ]);
  const drinksById = new Map(drinkRows.map((drink) => [drink.id, drink]));

  const lines: OrderLine[] = [];
  for (const item of items) {
    const drink = drinksById.get(item.drinkId);
    if (!drink) return { ok: false, error: "errorGeneric" };
    if (!drink.isAvailable) {
      return { ok: false, error: "errorSittingOut", itemName: drink.name };
    }
    const priced = priceRemix(drink, item.selection, item.notes);
    // Freestyle: keep the base in the name so the choreographer knows it.
    const base = `${dance.terms.freestyle} ${drink.name}`;
    const name =
      drink.genreSlug === FREESTYLE_GENRE
        ? item.name
          ? `${item.name} (${base})`
          : base
        : drink.name;
    lines.push({ drink, priced, quantity: item.quantity, name });
  }

  const subtotal = lines.reduce(
    (sum, line) => sum + line.priced.unitPrice * line.quantity,
    0,
  );
  // Slot capacity counts drinks only, not Intermission snacks.
  const drinkCount = lines
    .filter((line) => line.drink.tempsAllowed.length > 0)
    .reduce((sum, line) => sum + line.quantity, 0);
  if (isClass && drinkCount > schedule.slotCapacity) {
    return { ok: false, error: "errorSlotFull" };
  }

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const order = await db.transaction(async (tx) => {
        if (isClass && drinkCount > 0) {
          // Reserve the spots atomically; no row back means the class is full.
          const [slot] = await tx
            .insert(timeSlots)
            .values({
              startsAt: new Date(form.slotStart),
              capacity: schedule.slotCapacity,
              bookedCount: drinkCount,
            })
            .onConflictDoUpdate({
              target: timeSlots.startsAt,
              set: {
                bookedCount: sql`${timeSlots.bookedCount} + excluded.booked_count`,
              },
              setWhere: sql`${timeSlots.bookedCount} + excluded.booked_count <= ${timeSlots.capacity}`,
            })
            .returning({ id: timeSlots.id });
          if (!slot)
            throw new CheckoutError({ ok: false, error: "errorSlotFull" });
        }

        const [row] = await tx
          .insert(orders)
          .values({
            code: orderCode(),
            guestName: form.name,
            guestPhone: form.phone,
            type: form.orderType,
            slotStart: isClass ? new Date(form.slotStart) : null,
            subtotal,
            total: subtotal,
            paymentMethod: form.paymentMethod,
            paymentStatus:
              form.paymentMethod === "pay_at_pickup" ? "pending" : "paid",
            isDemo: true,
            notes: form.notes || null,
          })
          .returning({ id: orders.id, code: orders.code });

        await tx.insert(orderItems).values(
          lines.map(({ drink, priced, quantity, name }) => ({
            orderId: row.id,
            drinkId: drink.id,
            nameSnapshot: name,
            baseSnapshot: drink.basePrice,
            optionsSnapshot: {
              choices: priced.choices.map(({ group, options }) => ({
                group: group.slug,
                danceLabel: group.danceLabel,
                plainLabel: group.plainLabel,
                options: options.map((option) => ({
                  slug: option.slug,
                  danceLabel: option.danceLabel,
                  plainLabel: option.plainLabel,
                  priceDelta:
                    option.id === group.defaultOptionId ? 0 : option.priceDelta,
                })),
              })),
              notes: priced.notes,
            },
            quantity,
            lineTotal: priced.unitPrice * quantity,
          })),
        );
        return row;
      });
      await rememberDemoOrder(order.id);
      return { ok: true, orderId: order.id, code: order.code };
    } catch (error) {
      if (error instanceof CheckoutError) return error.result;
      if (isDuplicateCode(error)) continue;
      console.error("createOrder failed", error);
      return { ok: false, error: "errorGeneric" };
    }
  }
  return { ok: false, error: "errorGeneric" };
}
