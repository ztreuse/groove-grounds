"use client";

import { Coffee, Footprints } from "lucide-react";
import { motion } from "motion/react";
import { useCopy } from "@/hooks/use-copy";
import { usePreferences } from "@/stores/preferences";

// Header switch between Dance terms (sneaker) and Plain words (coffee cup).
// Labels collapse to icons below the sm breakpoint.
export function PlainModeToggle() {
  const { t, plain, isPlain } = useCopy();
  const togglePlainMode = usePreferences((state) => state.togglePlainMode);

  const options = [
    { isPlainOption: false, icon: Footprints, label: t.header.modeDance },
    { isPlainOption: true, icon: Coffee, label: t.header.modePlain },
  ];

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isPlain}
      aria-label={plain.header.modePlain}
      title={isPlain ? t.header.modeDance : t.header.modePlain}
      onClick={togglePlainMode}
      className="inline-flex h-11 shrink-0 items-center rounded-md bg-muted p-1 outline-none focus-visible:ring-3 focus-visible:ring-ring"
    >
      {options.map(({ isPlainOption, icon: Icon, label }) => {
        const active = isPlainOption === isPlain;
        return (
          <span
            key={label}
            className={`relative flex h-full items-center gap-1.5 rounded-md px-2.5 text-xs font-semibold transition-colors ${
              active ? "text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            {active && (
              <motion.span
                layoutId="plain-mode-thumb"
                aria-hidden
                className="absolute inset-0 rounded-md bg-primary"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
            <Icon aria-hidden className="relative size-4" />
            <span className="relative hidden sm:inline">{label}</span>
          </span>
        );
      })}
    </button>
  );
}
