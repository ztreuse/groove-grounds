"use client";

import { motion } from "motion/react";
import { CupIcon } from "@/components/icons/GrooveIcons";
import { useCopy } from "@/hooks/use-copy";
import { useScrollEdges } from "@/hooks/use-scroll-edges";
import type { LineupGenre } from "@/lib/db/queries";
import { genreBlockFor, genreTerms } from "@/lib/genres";

type GenreFilterProps = {
  genres: LineupGenre[];
  // Drinks per genre slug ("all" for the whole Lineup).
  counts: Record<string, number>;
  value: string;
  onChange: (genre: string) => void;
};

// Single-select genre chips in the logo-chip style: hairline frame, a
// swatch tile in the genre's colour, the label and its count. The dark
// selected fill glides between chips. Scrolls sideways on phones, wraps from md up.
export function GenreFilter({
  genres,
  counts,
  value,
  onChange,
}: GenreFilterProps) {
  const { t, plain } = useCopy();
  const edges = useScrollEdges<HTMLDivElement>();

  const chips = [
    { slug: "all", label: t.lineup.all, ariaLabel: plain.lineup.all },
    ...genres.map((genre) => {
      const term = genreTerms[genre.slug];
      return {
        slug: genre.slug,
        label: term ? t.terms[term] : genre.name,
        ariaLabel: term ? plain.terms[term] : genre.name,
      };
    }),
  ];

  return (
    <div
      ref={edges}
      role="group"
      aria-label={plain.lineup.genreFilter}
      className="-mx-4 flex [scrollbar-width:none] gap-2 overflow-x-auto scroll-edges px-4 py-0.5 md:mx-0 md:flex-wrap md:overflow-visible md:[mask-image:none] md:px-0.5 [&::-webkit-scrollbar]:hidden"
    >
      {chips.map((chip) => {
        const active = chip.slug === value;
        return (
          <button
            key={chip.slug}
            type="button"
            aria-pressed={active}
            aria-label={chip.ariaLabel}
            onClick={() => onChange(chip.slug)}
            className={`group relative inline-flex h-11 shrink-0 items-center gap-2 rounded-md py-1 pr-2 pl-1 text-sm font-semibold whitespace-nowrap transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring ${
              active
                ? "text-background"
                : "bg-card ring-1 ring-border ring-inset hover:ring-foreground/40"
            }`}
          >
            {active && (
              <motion.span
                aria-hidden
                layoutId="genre-chip"
                transition={{ type: "spring", stiffness: 500, damping: 40 }}
                className="absolute inset-0 rounded-md bg-foreground"
              />
            )}
            <span
              aria-hidden
              className={`relative flex size-8 items-center justify-center rounded-sm ${
                chip.slug === "all"
                  ? active
                    ? "bg-background/15"
                    : "bg-muted"
                  : genreBlockFor(chip.slug)
              }`}
            >
              {chip.slug === "all" ? (
                <CupIcon className="size-4" />
              ) : (
                <span className="size-2.5 rounded-full bg-espresso/70" />
              )}
            </span>
            <span className="relative">{chip.label}</span>
            <span
              className={`relative min-w-6 rounded-sm px-1.5 py-0.5 text-center text-xs tabular-nums ${
                active ? "bg-background/15" : "bg-muted text-muted-foreground"
              }`}
            >
              {counts[chip.slug] ?? 0}
            </span>
          </button>
        );
      })}
    </div>
  );
}
