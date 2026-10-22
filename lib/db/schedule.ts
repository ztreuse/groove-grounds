import "server-only";
import { eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { DEFAULT_RULES, type ScheduleRules } from "@/lib/schedule";
import { db } from "./index";
import { scheduleSettings } from "./schema";

// Cache tag for the class schedule; Backstage saves call updateTag on it.
export const SCHEDULE_TAG = "schedule";

export async function getScheduleRules(): Promise<ScheduleRules> {
  "use cache";
  cacheTag(SCHEDULE_TAG);
  cacheLife("hours");

  const [row] = await db
    .select()
    .from(scheduleSettings)
    .where(eq(scheduleSettings.id, 1))
    .limit(1);
  if (!row) return DEFAULT_RULES;
  return {
    openMinute: row.openMinute,
    closeMinute: row.closeMinute,
    slotMinutes: row.slotMinutes,
    slotCapacity: row.slotCapacity,
    daysAhead: row.daysAhead,
    leadMinutes: row.leadMinutes,
    blackoutDates: [...row.blackoutDates].sort(),
  };
}

export async function saveScheduleRules(rules: ScheduleRules) {
  await db
    .insert(scheduleSettings)
    .values({ id: 1, ...rules, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: scheduleSettings.id,
      set: { ...rules, updatedAt: new Date() },
    });
}
