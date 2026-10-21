import { schedule } from "@/lib/schedule";

const peso = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 0,
});

const time = new Intl.DateTimeFormat("en-PH", {
  timeZone: schedule.timeZone,
  hour: "numeric",
  minute: "2-digit",
});

const day = new Intl.DateTimeFormat("en-PH", {
  timeZone: schedule.timeZone,
  weekday: "short",
  month: "short",
  day: "numeric",
});

// Whole pesos, e.g. ₱170.
export function formatPeso(amount: number) {
  return peso.format(amount);
}

// Manila time, e.g. 9:15 AM.
export function formatTime(iso: string) {
  return time.format(new Date(iso));
}

// Minutes after midnight as a clock time, e.g. 420 → "7:00 AM".
export function formatClock(minutes: number) {
  const hour = Math.floor(minutes / 60);
  const minute = String(minutes % 60).padStart(2, "0");
  return `${hour % 12 || 12}:${minute} ${hour < 12 ? "AM" : "PM"}`;
}

// A Manila day key ("2026-10-22") as e.g. "Thu, Oct 22".
export function formatDay(key: string) {
  return day.format(new Date(`${key}T12:00:00+08:00`));
}
