"use client";

import { Check } from "lucide-react";
import { useCopy } from "@/hooks/use-copy";
import { fill } from "@/lib/copy";
import {
  ORDER_FLOW,
  statusCopyKey,
  statusCount,
  type OrderStatus,
} from "@/lib/orders";

const COUNTS = [1, 2, 3, 4, 5, 6, 7, 8];

// The tracker styled like a count bar 1–8, with the five steps underneath.
export function StatusSteps({ status }: { status: OrderStatus }) {
  const { t, plain, isPlain } = useCopy();
  const isCut = status === "cut";
  const count = isCut ? 0 : statusCount[status];
  const currentIndex = ORDER_FLOW.indexOf(
    status as (typeof ORDER_FLOW)[number],
  );

  return (
    <div>
      <div
        role="img"
        aria-label={fill(plain.tracker.countLabel, { count })}
        className="grid grid-cols-8 gap-1.5"
      >
        {COUNTS.map((n) => {
          const filled = n <= count;
          const current = n === count && status !== "bow";
          return (
            <div key={n} className="text-center">
              <div
                className={`h-12 rounded-lg border-2 transition-colors duration-500 sm:h-16 ${
                  filled ? "border-primary bg-primary" : "bg-card"
                } ${current ? "motion-safe:animate-pulse" : ""}`}
              />
              <span
                className={`mt-1 block font-heading text-lg ${
                  filled ? "text-highlight" : "text-muted-foreground"
                }`}
              >
                {n}
              </span>
            </div>
          );
        })}
      </div>

      <ol className="mt-6 space-y-2">
        {ORDER_FLOW.map((step, index) => {
          const done = !isCut && index < currentIndex;
          const current = !isCut && index === currentIndex;
          const key = statusCopyKey[step];
          return (
            <li
              key={step}
              aria-current={current ? "step" : undefined}
              className={`flex items-center gap-3 rounded-xl border-2 px-3 py-2 ${
                current ? "border-primary bg-card" : "border-transparent"
              } ${!done && !current ? "opacity-60" : ""}`}
            >
              <span
                className={`flex size-8 shrink-0 items-center justify-center rounded-full border-2 font-heading ${
                  done || current
                    ? "border-primary bg-primary text-primary-foreground"
                    : ""
                }`}
              >
                {done ? <Check aria-hidden className="size-4" /> : index + 1}
              </span>
              <span>
                <span className="block font-semibold">{t.status[key]}</span>
                {!isPlain && (
                  <span className="block text-sm text-muted-foreground">
                    {plain.status[key]}
                  </span>
                )}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
