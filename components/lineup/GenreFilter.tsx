"use client";

import { useCopy } from "@/hooks/use-copy";
import type { LineupGenre } from "@/lib/db/queries";
import { genreTerms } from "@/lib/genres";

const chipClass =
  "inline-flex h-11 shrink-0 items-center rounded-full border-2 px-4 text-sm font-semibold whitespace-nowrap transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring";
const activeClass = "border-primary bg-primary text-primary-foreground";
const idleClass = "bg-card hover:bg-accent hover:text-accent-foreground";

type GenreFilterProps = {
  genres: LineupGenre[];
  value: string;
  onChange: (genre: string) => void;
};

// Single-select chips; scroll sideways on small screens.
export function GenreFilter({ genres, value, onChange }: GenreFilterProps) {
  const { t, plain } = useCopy();

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
      role="group"
      aria-label={plain.lineup.genreFilter}
      className="-mx-4 flex [scrollbar-width:none] gap-2 overflow-x-auto px-4 [&::-webkit-scrollbar]:hidden"
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
            className={`${chipClass} ${active ? activeClass : idleClass}`}
          >
            {chip.label}
          </button>
        );
      })}
    </div>
  );
}
