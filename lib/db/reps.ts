import "server-only";
import { and, desc, eq, sql } from "drizzle-orm";
import { levelFor, repsForTotal } from "@/lib/reps";
import { db } from "./index";
import { orders, profiles, repsLedger } from "./schema";

// Pays out a member's Reps once their order takes its Bow (picked up).
// Guests earn nothing; the ledger's unique index stops double payouts.
export async function awardOrderReps(orderId: string) {
  await db.transaction(async (tx) => {
    const [order] = await tx
      .select({ userId: orders.userId, total: orders.total })
      .from(orders)
      .where(and(eq(orders.id, orderId), eq(orders.status, "bow")))
      .limit(1);
    if (!order?.userId) return;
    const points = repsForTotal(order.total);
    if (points <= 0) return;

    const [earned] = await tx
      .insert(repsLedger)
      .values({ userId: order.userId, orderId, points, reason: "order" })
      .onConflictDoNothing()
      .returning({ id: repsLedger.id });
    if (!earned) return;

    const [profile] = await tx
      .update(profiles)
      .set({ reps: sql`${profiles.reps} + ${points}` })
      .where(eq(profiles.id, order.userId))
      .returning({ reps: profiles.reps });
    if (profile) {
      await tx
        .update(profiles)
        .set({ level: levelFor(profile.reps) })
        .where(eq(profiles.id, order.userId));
    }
  });
}

// A member's latest Reps activity, newest first.
export async function getRepsHistory(userId: string, limit = 8) {
  const rows = await db
    .select({
      id: repsLedger.id,
      points: repsLedger.points,
      reason: repsLedger.reason,
      createdAt: repsLedger.createdAt,
      code: orders.code,
    })
    .from(repsLedger)
    .leftJoin(orders, eq(repsLedger.orderId, orders.id))
    .where(eq(repsLedger.userId, userId))
    .orderBy(desc(repsLedger.createdAt))
    .limit(limit);
  return rows.map((row) => ({
    ...row,
    createdAt: row.createdAt.toISOString(),
  }));
}

export type RepsEntry = Awaited<ReturnType<typeof getRepsHistory>>[number];
