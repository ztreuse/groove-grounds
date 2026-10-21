"use client";

import { Sparkle } from "lucide-react";
import { useCopy } from "@/hooks/use-copy";
import type { TermKey } from "@/lib/copy";

const terms: TermKey[] = [
  "dropIn",
  "bookAClass",
  "freestyle",
  "remix",
  "crewOrder",
  "showtime",
];

// The page's one marquee: the moves you can make, scrolling like a club
// night ticker. Decorative (every term is reachable elsewhere); it stops
// under reduced motion.
export function Marquee() {
  const { t } = useCopy();
  const row = (
    <ul className="flex shrink-0 items-center gap-8 pr-8">
      {terms.map((term) => (
        <li key={term} className="flex items-center gap-8">
          <span className="font-heading text-3xl tracking-wide whitespace-nowrap uppercase sm:text-4xl">
            {t.terms[term]}
          </span>
          <Sparkle aria-hidden className="size-6 shrink-0 fill-current" />
        </li>
      ))}
    </ul>
  );

  return (
    <div
      aria-hidden
      className="overflow-hidden bg-primary py-4 text-primary-foreground"
    >
      <div className="flex w-max motion-safe:animate-marquee">
        {row}
        {row}
      </div>
    </div>
  );
}
