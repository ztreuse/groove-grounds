import "server-only";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { dance } from "@/lib/copy";
import { db } from "./index";
import { isDuplicateCode, orderCode } from "./order-code";
import { crewRequests, orderItems, orders } from "./schema";

const isUuid = (id: string) => z.uuid().safeParse(id).success;

const columns = {
  id: crewRequests.id,
  name: crewRequests.name,
  phone: crewRequests.phone,
  contact: crewRequests.contact,
  eventDate: crewRequests.eventDate,
  headcount: crewRequests.headcount,
  drinkMix: crewRequests.drinkMix,
  budget: crewRequests.budget,
  details: crewRequests.details,
  status: crewRequests.status,
  quoteAmount: crewRequests.quoteAmount,
  quoteNote: crewRequests.quoteNote,
  orderId: crewRequests.orderId,
  createdAt: crewRequests.createdAt,
};

type Row = Awaited<ReturnType<typeof selectRows>>[number];
const selectRows = () => db.select(columns).from(crewRequests);
const serialize = (row: Row) => ({
  ...row,
  eventDate: row.eventDate.toISOString(),
  createdAt: row.createdAt.toISOString(),
});

export async function createCrewRequest(
  values: Omit<typeof crewRequests.$inferInsert, "id" | "status">,
) {
  const [row] = await db
    .insert(crewRequests)
    .values(values)
    .returning({ id: crewRequests.id });
  return row.id;
}

// The customer's view: no phone or email.
export async function getCrewRequest(id: string) {
  if (!isUuid(id)) return null;
  const [row] = await selectRows().where(eq(crewRequests.id, id)).limit(1);
  if (!row) return null;
  const { phone, contact, ...rest } = serialize(row);
  void phone;
  void contact;
  return { ...rest, name: rest.name.split(" ")[0] };
}

// Backstage inbox, newest first.
export async function listCrewRequests() {
  const rows = await selectRows()
    .orderBy(desc(crewRequests.createdAt))
    .limit(200);
  return rows.map(serialize);
}

export async function quoteCrewRequest(
  id: string,
  amount: number,
  note: string,
) {
  const [row] = await db
    .update(crewRequests)
    .set({
      status: "quoted",
      quoteAmount: amount,
      quoteNote: note || null,
      quotedAt: new Date(),
    })
    .where(and(eq(crewRequests.id, id), eq(crewRequests.status, "new")))
    .returning({ id: crewRequests.id });
  return Boolean(row);
}

export async function declineCrewRequest(id: string) {
  const [row] = await db
    .update(crewRequests)
    .set({ status: "declined", respondedAt: new Date() })
    .where(eq(crewRequests.id, id))
    .returning({ id: crewRequests.id });
  return Boolean(row);
}

// The customer accepts or declines a quote. Accepting turns the request
// into a scheduled Crew Order (pay at pickup) that enters the Backstage
// queue like a booked class. Returns the new order's id, or true for a
// decline; false if the request wasn't waiting on a quote.
export async function respondToCrewQuote(id: string, accept: boolean) {
  if (!isUuid(id)) return false;
  if (!accept) {
    const [row] = await db
      .update(crewRequests)
      .set({ status: "declined", respondedAt: new Date() })
      .where(and(eq(crewRequests.id, id), eq(crewRequests.status, "quoted")))
      .returning({ id: crewRequests.id });
    return Boolean(row);
  }

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      return await db.transaction(async (tx) => {
        const [request] = await tx
          .update(crewRequests)
          .set({ status: "accepted", respondedAt: new Date() })
          .where(
            and(eq(crewRequests.id, id), eq(crewRequests.status, "quoted")),
          )
          .returning();
        // Nothing was updated if it wasn't waiting on a quote.
        if (!request) return false;
        // A quoted request always has an amount (quoteCrewRequest sets it).
        const total = request.quoteAmount ?? 0;
        const notes = [request.drinkMix, request.details]
          .filter(Boolean)
          .join("\n\n");
        const [order] = await tx
          .insert(orders)
          .values({
            code: orderCode(),
            userId: request.userId,
            guestName: request.name,
            guestPhone: request.phone,
            type: "crew",
            slotStart: request.eventDate,
            subtotal: total,
            total,
            paymentMethod: "pay_at_pickup",
            notes,
          })
          .returning({ id: orders.id });
        // One line for the whole set: a drink per head at the quoted total.
        await tx.insert(orderItems).values({
          orderId: order.id,
          drinkId: null,
          nameSnapshot: dance.crew.orderItem,
          baseSnapshot: Math.round(total / request.headcount),
          optionsSnapshot: { choices: [], notes: request.drinkMix },
          quantity: request.headcount,
          lineTotal: total,
        });
        await tx
          .update(crewRequests)
          .set({ orderId: order.id })
          .where(eq(crewRequests.id, id));
        return order.id;
      });
    } catch (error) {
      if (!isDuplicateCode(error)) throw error;
    }
  }
  return false;
}

export type CrewRequest = NonNullable<
  Awaited<ReturnType<typeof getCrewRequest>>
>;
export type CrewInboxItem = Awaited<
  ReturnType<typeof listCrewRequests>
>[number];
