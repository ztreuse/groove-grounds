"use client";

import { Flame, Snowflake } from "lucide-react";
import { useCopy } from "@/hooks/use-copy";

export type TempFilter = "all" | "hot" | "cold";

type TempToggleProps = {
  value: TempFilter;
  onChange: (value: TempFilter) => void;
};

// Any / Warm-up (hot) / Cool-down (iced and blended).
export function TempToggle({ value, onChange }: TempToggleProps) {
  const { t, plain } = useCopy();

  const options = [
    {
      value: "all",
      label: t.lineup.tempAny,
      ariaLabel: plain.lineup.tempAny,
      icon: null,
    },
    {
      value: "hot",
      label: t.remix.warmUp,
      ariaLabel: plain.remix.warmUp,
      icon: Flame,
    },
    {
      value: "cold",
      label: t.remix.coolDown,
      ariaLabel: plain.remix.coolDown,
      icon: Snowflake,
    },
  ] as const;

  return (
    <div
      role="group"
      aria-label={plain.lineup.tempFilter}
      className="inline-flex h-11 shrink-0 rounded-md bg-muted p-1"
    >
      {options.map(({ value: optionValue, label, ariaLabel, icon: Icon }) => {
        const active = optionValue === value;
        return (
          <button
            key={optionValue}
            type="button"
            aria-pressed={active}
            aria-label={ariaLabel}
            onClick={() => onChange(optionValue)}
            className={`flex items-center gap-1.5 rounded-md px-3 text-sm font-semibold whitespace-nowrap transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring ${
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {Icon && <Icon aria-hidden className="size-4" />}
            {label}
          </button>
        );
      })}
    </div>
  );
}
