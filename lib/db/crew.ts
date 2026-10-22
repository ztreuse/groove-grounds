import "server-only";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "./index";
import { crewRequests } from "./schema";

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

// The customer accepts or declines a quote.
export async function respondToCrewQuote(id: string, accept: boolean) {
  if (!isUuid(id)) return false;
  const [row] = await db
    .update(crewRequests)
    .set({
      status: accept ? "accepted" : "declined",
      respondedAt: new Date(),
    })
    .where(and(eq(crewRequests.id, id), eq(crewRequests.status, "quoted")))
    .returning({ id: crewRequests.id });
  return Boolean(row);
}

export type CrewRequest = NonNullable<
  Awaited<ReturnType<typeof getCrewRequest>>
>;
export type CrewInboxItem = Awaited<
  ReturnType<typeof listCrewRequests>
>[number];
