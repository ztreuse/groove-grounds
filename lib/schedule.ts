// Pickup schedule rules. Pure functions, shared by the slot picker and the
// server. Backstage's Class schedule page (Phase 2) will move these settings
// into the database.

export const schedule = {
  timeZone: "Asia/Manila",
  // Manila has no daylight saving, so a fixed offset is safe.
  utcOffsetMinutes: 8 * 60,
  openMinute: 7 * 60, // 7:00 AM
  closeMinute: 21 * 60, // 9:00 PM (last slot starts 8:45 PM)
  slotMinutes: 15,
  daysAhead: 7,
  slotCapacity: 6,
  // Booked orders reach the queue 15 minutes before the slot, so leave room.
  leadMinutes: 30,
} as const;

const MINUTE = 60_000;
const DAY = 24 * 60 * MINUTE;
const offset = schedule.utcOffsetMinutes * MINUTE;

// "YYYY-MM-DD" in Manila time.
export function dayKey(date: Date) {
  return new Date(date.getTime() + offset).toISOString().slice(0, 10);
}

// Today plus the following days, as Manila day keys.
export function bookableDays(now: Date) {
  const today = Date.parse(`${dayKey(now)}T00:00:00Z`);
  return Array.from({ length: schedule.daysAhead }, (_, index) =>
    new Date(today + index * DAY).toISOString().slice(0, 10),
  );
}

// Slot start times (ISO strings) still bookable on a Manila day.
export function slotsForDay(day: string, now: Date) {
  const midnight = Date.parse(`${day}T00:00:00Z`) - offset;
  const earliest = now.getTime() + schedule.leadMinutes * MINUTE;
  const slots: string[] = [];
  for (
    let minute = schedule.openMinute;
    minute < schedule.closeMinute;
    minute += schedule.slotMinutes
  ) {
    const start = midnight + minute * MINUTE;
    if (start >= earliest) slots.push(new Date(start).toISOString());
  }
  return slots;
}

export function isBookableDay(day: string, now: Date) {
  return bookableDays(now).includes(day);
}

export function isBookableSlot(slotStart: string, now: Date) {
  const start = new Date(slotStart);
  if (Number.isNaN(start.getTime())) return false;
  const day = dayKey(start);
  return (
    isBookableDay(day, now) &&
    slotsForDay(day, now).includes(start.toISOString())
  );
}
