"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { DrinkVisual } from "@/components/lineup/DrinkVisual";
import { useCopy } from "@/hooks/use-copy";
import { fill } from "@/lib/copy";
import type { LineupDrink, LineupGenre } from "@/lib/db/queries";
import { genreBlockFor, genreTerms } from "@/lib/genres";
import { routes } from "@/lib/routes";

// Bento of the five genres: one tile per genre, sized for rhythm.
const tileLayout: Record<string, string> = {
  "new-school": "lg:col-span-3 lg:row-span-2",
  "old-school": "lg:col-span-3",
  mashup: "lg:col-span-3",
  "off-beat": "lg:col-span-4",
  intermission: "lg:col-span-2",
};

type GenreTilesProps = { genres: LineupGenre[]; drinks: LineupDrink[] };

export function GenreTiles({ genres, drinks }: GenreTilesProps) {
  const { t, plain, isPlain } = useCopy();

  return (
    <section aria-labelledby="genres" className="mx-auto w-full max-w-6xl px-4">
      <h2 id="genres" className="mb-6 text-5xl leading-none sm:text-6xl">
        {t.home.genresTitle}
      </h2>
      <ul className="grid gap-4 sm:grid-cols-2 lg:auto-rows-[15rem] lg:grid-cols-6">
        {genres.map((genre) => {
          const term = genreTerms[genre.slug];
          const inGenre = drinks.filter((d) => d.genreSlug === genre.slug);
          const tall = genre.slug === "new-school";
          const shown = inGenre.slice(0, tall ? 3 : 2);
          return (
            <li
              key={genre.slug}
              className={tileLayout[genre.slug] ?? "lg:col-span-2"}
            >
              <Link
                href={`${routes.lineup.href}?genre=${genre.slug}`}
                aria-label={term ? plain.terms[term] : genre.name}
                className={`group relative flex h-full min-h-56 flex-col overflow-hidden rounded-[1.75rem] p-6 text-espresso transition-transform duration-300 outline-none hover:-translate-y-1 focus-visible:ring-3 focus-visible:ring-ring ${genreBlockFor(genre.slug)}`}
              >
                <span
                  aria-hidden
                  className="absolute inset-0 halftone [mask-image:linear-gradient(to_bottom_left,black,transparent_60%)] text-espresso/10"
                />
                <span className="relative font-heading text-4xl leading-none tracking-wide uppercase sm:text-5xl">
                  {term ? t.terms[term] : genre.name}
                </span>
                {!isPlain && term && (
                  <span className="relative mt-1 text-sm font-medium">
                    {plain.terms[term]}
                  </span>
                )}
                <span className="relative z-10 mt-auto flex items-center gap-1 self-start rounded-full bg-cream/90 px-3 py-1 text-sm font-semibold">
                  {inGenre.length === 1
                    ? t.home.drinkOne
                    : fill(t.home.drinks, { count: inGenre.length })}
                  <ArrowUpRight
                    aria-hidden
                    className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </span>
                <div
                  aria-hidden
                  className={`absolute right-2 bottom-2 flex items-end ${tall ? "h-[62%]" : "h-[72%]"}`}
                >
                  {shown.map((drink, index) => (
                    <div
                      key={drink.id}
                      className={`-ml-10 h-full transition-transform duration-500 first:ml-0 ${
                        index % 2
                          ? "rotate-6 group-hover:rotate-3"
                          : "-rotate-3 group-hover:rotate-0"
                      }`}
                      style={{ zIndex: shown.length - index }}
                    >
                      <DrinkVisual drink={drink} sizes="200px" />
                    </div>
                  ))}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
