"use client";

import { useEffect, useState } from "react";
import { fetchSlots } from "@/app/(shop)/showtime/actions";
import { CountIn } from "@/components/layout/CountIn";
import { Button } from "@/components/ui/button";
import { useCopy } from "@/hooks/use-copy";
import { useScrollEdges } from "@/hooks/use-scroll-edges";
import { fill } from "@/lib/copy";
import type { SlotAvailability } from "@/lib/db/queries";
import { formatDay, formatTime } from "@/lib/format";
import { bookableDays, slotsForDay } from "@/lib/schedule";

type SlotPickerProps = {
  value: string;
  onChange: (slotStart: string) => void;
  // Drinks in this order; slots with fewer spots left count as full.
  drinkCount: number;
  // Bump to refetch, e.g. after the chosen class filled up.
  refreshToken: number;
};

type SlotState = { key: string; slots?: SlotAvailability[]; error?: boolean };

// Mounted only after the customer picks Book a Class, so reading the clock
// here never runs during prerendering.
export function SlotPicker({
  value,
  onChange,
  drinkCount,
  refreshToken,
}: SlotPickerProps) {
  const { t, plain } = useCopy();
  const edges = useScrollEdges<HTMLDivElement>();
  // Skip days with no times left (e.g. today after closing).
  const [days] = useState(() => {
    const now = new Date();
    return bookableDays(now).filter((d) => slotsForDay(d, now).length > 0);
  });
  const [today] = useState(() => bookableDays(new Date())[0]);
  const [day, setDay] = useState(days[0]);
  const [retries, setRetries] = useState(0);
  const [state, setState] = useState<SlotState>({ key: "" });

  const key = `${day}:${retries}:${refreshToken}`;
  useEffect(() => {
    let cancelled = false;
    fetchSlots(day)
      .then((slots) => !cancelled && setState({ key, slots }))
      .catch(() => !cancelled && setState({ key, error: true }));
    return () => {
      cancelled = true;
    };
  }, [day, key]);

  const loading = state.key !== key;
  const dayLabel = (d: string) => {
    const offset = Math.round((Date.parse(d) - Date.parse(today)) / 86_400_000);
    if (offset === 0) return t.showtime.today;
    if (offset === 1) return t.showtime.tomorrow;
    return formatDay(d);
  };

  return (
    <div className="mt-4 space-y-4">
      <div>
        <p className="mb-2 text-sm font-semibold">{t.showtime.pickDay}</p>
        <div
          role="group"
          ref={edges}
          aria-label={plain.showtime.pickDay}
          className="-mx-4 flex [scrollbar-width:none] gap-2 overflow-x-auto scroll-edges px-4 [&::-webkit-scrollbar]:hidden"
        >
          {days.map((d) => {
            const active = d === day;
            return (
              <button
                key={d}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  setDay(d);
                  onChange("");
                }}
                className={`h-11 shrink-0 rounded-full px-4 text-sm font-semibold whitespace-nowrap outline-none focus-visible:ring-3 focus-visible:ring-ring ${
                  active
                    ? "bg-espresso text-cream dark:bg-cream dark:text-espresso"
                    : "bg-muted hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                {dayLabel(d)}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold">{t.showtime.pickTime}</p>
        {loading ? (
          <CountIn />
        ) : state.error ? (
          <div className="rounded-2xl bg-muted/60 p-4 text-sm">
            <p>{t.showtime.slotsError}</p>
            <Button
              type="button"
              variant="outline"
              className="mt-3"
              onClick={() => setRetries((n) => n + 1)}
            >
              {t.showtime.retry}
            </Button>
          </div>
        ) : !state.slots?.length ? (
          <p className="rounded-2xl bg-muted/60 p-4 text-sm">
            {t.showtime.noSlots}
          </p>
        ) : (
          <div
            role="radiogroup"
            aria-label={plain.showtime.pickTime}
            className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5"
          >
            {state.slots.map((slot) => {
              const full = slot.remaining < Math.max(1, drinkCount);
              const active = slot.startsAt === value;
              return (
                <button
                  key={slot.startsAt}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  disabled={full}
                  onClick={() => onChange(slot.startsAt)}
                  className={`flex min-h-12 flex-col items-center justify-center rounded-2xl px-1 py-1 text-sm font-semibold outline-none focus-visible:ring-3 focus-visible:ring-ring ${
                    active
                      ? "bg-espresso text-cream dark:bg-cream dark:text-espresso"
                      : full
                        ? "cursor-not-allowed bg-muted/50 text-muted-foreground line-through decoration-1"
                        : "bg-muted hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  <span>{formatTime(slot.startsAt)}</span>
                  {full ? (
                    <span className="text-[0.7rem] font-medium">
                      <span aria-hidden>{t.showtime.classFull}</span>
                      <span className="sr-only">
                        {plain.showtime.classFull}
                      </span>
                    </span>
                  ) : (
                    slot.remaining <= 3 && (
                      <span className="text-[0.7rem] font-medium">
                        {fill(t.showtime.spotsLeft, { count: slot.remaining })}
                      </span>
                    )
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
