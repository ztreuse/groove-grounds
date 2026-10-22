"use client";

import { motion } from "motion/react";
import { CupIcon } from "@/components/icons/GrooveIcons";
import { IconTile } from "@/components/layout/IconTile";
import { useCopy } from "@/hooks/use-copy";
import { tempStyles } from "@/lib/temps";

export type TempFilter = "all" | "hot" | "cold";

type TempToggleProps = {
  value: TempFilter;
  onChange: (value: TempFilter) => void;
};

// Any / Warm-up (hot) / Cool-down (iced and blended): a framed segmented
// control; each option shows its logo-style tile, the selected one lifts
// onto the card colour with a sliding highlight.
export function TempToggle({ value, onChange }: TempToggleProps) {
  const { t, plain, isPlain } = useCopy();

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
      className="inline-flex h-14 shrink-0 gap-0.5 self-start rounded-md bg-muted p-1 ring-1 ring-border ring-inset"
    >
      {options.map(({ value: optionValue, label, ariaLabel, temp }) => {
        const sub = !isPlain && ariaLabel !== label ? ariaLabel : null;
        const active = optionValue === value;
        return (
          <button
            key={optionValue}
            type="button"
            aria-pressed={active}
            aria-label={ariaLabel}
            onClick={() => onChange(optionValue)}
            className={`relative flex items-center gap-2 rounded-sm py-1 pr-3 pl-1 text-sm font-semibold whitespace-nowrap transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring ${
              active
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {active && (
              <motion.span
                aria-hidden
                layoutId="temp-toggle"
                transition={{ type: "spring", stiffness: 500, damping: 40 }}
                className="absolute inset-0 rounded-sm bg-card shadow-[0_0_0_1px_var(--border),0_6px_14px_-8px_rgb(43_30_23_/_0.45)]"
              />
            )}
            <span className="relative flex items-center gap-2">
              {temp ? (
                <IconTile
                  icon={tempStyles[temp].icon}
                  tone="custom"
                  className={tempStyles[temp].accent}
                  size="sm"
                />
              ) : (
                <IconTile icon={CupIcon} tone="neutral" size="sm" />
              )}
              <span className="text-left leading-tight">
                <span className="block">{label}</span>
                {sub && (
                  <span className="block text-[11px] font-medium opacity-70">
                    {sub}
                  </span>
                )}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
