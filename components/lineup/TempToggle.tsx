"use client";

import { IconTile } from "@/components/layout/IconTile";
import { tempStyles } from "@/lib/temps";
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
      temp: null,
    },
    {
      value: "hot",
      label: t.remix.warmUp,
      ariaLabel: plain.remix.warmUp,
      temp: "hot",
    },
    {
      value: "cold",
      label: t.remix.coolDown,
      ariaLabel: plain.remix.coolDown,
      temp: "iced",
    },
  ] as const;

  return (
    <div
      role="group"
      aria-label={plain.lineup.tempFilter}
      className="inline-flex h-11 shrink-0 rounded-md bg-muted p-1"
    >
      {options.map(({ value: optionValue, label, ariaLabel, temp }) => {
        const active = optionValue === value;
        return (
          <button
            key={optionValue}
            type="button"
            aria-pressed={active}
            aria-label={ariaLabel}
            onClick={() => onChange(optionValue)}
            className={`flex items-center gap-1.5 rounded-md px-2.5 text-sm font-semibold whitespace-nowrap transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring ${
              active
                ? "bg-background text-foreground shadow-[0_1px_0_0_var(--border),0_4px_12px_-6px_rgb(43_30_23_/_0.35)]"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {temp && (
              <IconTile
                icon={tempStyles[temp].icon}
                tone="custom"
                className={tempStyles[temp].accent}
                size="sm"
              />
            )}
            {label}
          </button>
        );
      })}
    </div>
  );
}
