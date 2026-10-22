// Pickup schedule rules. Pure functions, shared by the slot picker and the
// server. The rules themselves live in the database (Backstage > Class
// schedule) and are read with getScheduleRules() in lib/db/schedule.ts.

export const schedule = {
  timeZone: "Asia/Manila",
  // Manila has no daylight saving, so a fixed offset is safe.
  utcOffsetMinutes: 8 * 60,
} as const;

export type ScheduleRules = {
  openMinute: number; // minutes after midnight, Manila time
  closeMinute: number; // last slot starts one slot before this
  slotMinutes: number;
  // Max drinks per slot (snacks don't count).
  slotCapacity: number;
  daysAhead: number;
  // Booked orders reach the queue 15 minutes before the slot, so leave room.
  leadMinutes: number;
  // "YYYY-MM-DD" days with no bookings.
  blackoutDates: string[];
};

// Used until the settings row loads, and if it's ever missing.
export const DEFAULT_RULES: ScheduleRules = {
  openMinute: 7 * 60,
  closeMinute: 21 * 60,
  slotMinutes: 15,
  slotCapacity: 6,
  daysAhead: 7,
  leadMinutes: 30,
  blackoutDates: [],
};

const MINUTE = 60_000;
const DAY = 24 * 60 * MINUTE;
const offset = schedule.utcOffsetMinutes * MINUTE;

// "YYYY-MM-DD" in Manila time.
export function dayKey(date: Date) {
  return new Date(date.getTime() + offset).toISOString().slice(0, 10);
}

// Today plus the following days, as Manila day keys, minus blackout dates.
export function bookableDays(now: Date, rules: ScheduleRules) {
  const today = Date.parse(`${dayKey(now)}T00:00:00Z`);
  return Array.from({ length: rules.daysAhead }, (_, index) =>
    new Date(today + index * DAY).toISOString().slice(0, 10),
  ).filter((day) => !rules.blackoutDates.includes(day));
}

// Slot start times (ISO strings) still bookable on a Manila day.
export function slotsForDay(day: string, now: Date, rules: ScheduleRules) {
  const midnight = Date.parse(`${day}T00:00:00Z`) - offset;
  const earliest = now.getTime() + rules.leadMinutes * MINUTE;
  const slots: string[] = [];
  for (
    let minute = rules.openMinute;
    minute < rules.closeMinute;
    minute += rules.slotMinutes
  ) {
    const start = midnight + minute * MINUTE;
    if (start >= earliest) slots.push(new Date(start).toISOString());
  }
  return slots;
}

export function isBookableDay(day: string, now: Date, rules: ScheduleRules) {
  return bookableDays(now, rules).includes(day);
}

export function isBookableSlot(
  slotStart: string,
  now: Date,
  rules: ScheduleRules,
) {
  const start = new Date(slotStart);
  if (Number.isNaN(start.getTime())) return false;
  const day = dayKey(start);
  return (
    isBookableDay(day, now, rules) &&
    slotsForDay(day, now, rules).includes(start.toISOString())
  );
}
