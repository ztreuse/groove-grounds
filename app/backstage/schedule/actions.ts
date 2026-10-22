"use server";

import { gt, sql } from "drizzle-orm";
import { updateTag } from "next/cache";
import { db } from "@/lib/db";
import { SCHEDULE_TAG, saveScheduleRules } from "@/lib/db/schedule";
import { timeSlots } from "@/lib/db/schema";
import { scheduleFormSchema, toMinutes } from "@/lib/schedule-schema";
import { getOwner } from "@/lib/staff";

// Owner-only. Saves the class schedule; future slots that already have
// bookings take the new capacity too (never below what's booked).
export async function saveSchedule(input: unknown) {
  if (!(await getOwner())) return { ok: false as const };
  const parsed = scheduleFormSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const };
  const { opens, closes, blackoutDates, ...rest } = parsed.data;

  await saveScheduleRules({
    ...rest,
    openMinute: toMinutes(opens),
    closeMinute: toMinutes(closes),
    blackoutDates: [...new Set(blackoutDates)].sort(),
  });
  await db
    .update(timeSlots)
    .set({
      capacity: sql`greatest(${rest.slotCapacity}, ${timeSlots.bookedCount})`,
    })
    .where(gt(timeSlots.startsAt, new Date()));
  updateTag(SCHEDULE_TAG);
  return { ok: true as const };
}
