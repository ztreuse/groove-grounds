"use client";

import { IconTile } from "@/components/layout/IconTile";
import { useCopy } from "@/hooks/use-copy";
import type { Temperature } from "@/lib/pricing";
import { tempStyles } from "@/lib/temps";

// Temperature at a glance: a colour-coded icon tile (warm, cool, blended)
// with the dance label; screen readers get the plain word.
export function TempBadge({ temp }: { temp: Temperature }) {
  const { t, plain } = useCopy();
  const { icon, key, accent } = tempStyles[temp];

  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold">
      <IconTile icon={icon} tone="custom" className={accent} size="sm" />
      <span aria-hidden>{t.remix[key]}</span>
      <span className="sr-only">{plain.remix[key]}</span>
    </span>
  );
}
