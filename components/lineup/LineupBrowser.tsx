"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Search, X } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";
import { useCopy } from "@/hooks/use-copy";
import { fill } from "@/lib/copy";
import type { LineupDrink, LineupGenre } from "@/lib/db/queries";
import { genreBlockFor, genreTerms } from "@/lib/genres";
import { DrinkCard } from "./DrinkCard";
import { GenreFilter } from "./GenreFilter";
import { TempToggle, type TempFilter } from "./TempToggle";

type LineupBrowserProps = {
  genres: LineupGenre[];
  drinks: LineupDrink[];
  initialGenre?: string | null;
};

function matchesTemp(drink: LineupDrink, temp: TempFilter) {
  if (temp === "all") return true;
  if (temp === "hot") return drink.tempsAllowed.includes("hot");
  return drink.tempsAllowed.some((allowed) => allowed !== "hot");
}

function matchesSearch(drink: LineupDrink, query: string) {
  if (!query) return true;
  return [drink.name, drink.danceStyle, drink.plainDescription].some((text) =>
    text.toLowerCase().includes(query),
  );
}

export function LineupBrowser({
  genres,
  drinks,
  initialGenre = null,
}: LineupBrowserProps) {
  const { t, plain, isPlain } = useCopy();
  const [genre, setGenre] = useState(
    initialGenre && genres.some((g) => g.slug === initialGenre)
      ? initialGenre
      : "all",
  );
  const [temp, setTemp] = useState<TempFilter>("all");
  const [search, setSearch] = useState("");

  const query = search.trim().toLowerCase();
  const sections = useMemo(() => {
    const visible = drinks.filter(
      (drink) =>
        (genre === "all" || drink.genreSlug === genre) &&
        matchesTemp(drink, temp) &&
        matchesSearch(drink, query),
    );
    return genres
      .map((g) => ({
        genre: g,
        drinks: visible.filter((drink) => drink.genreSlug === g.slug),
      }))
      .filter((section) => section.drinks.length > 0);
  }, [drinks, genres, genre, temp, query]);

  const count = sections.reduce((n, section) => n + section.drinks.length, 0);
  // Chip counts: the whole Lineup per genre, regardless of other filters.
  const genreCounts = useMemo(() => {
    const counts: Record<string, number> = { all: drinks.length };
    for (const drink of drinks) {
      counts[drink.genreSlug] = (counts[drink.genreSlug] ?? 0) + 1;
    }
    return counts;
  }, [drinks]);
  const resultLabel =
    count === 1 ? t.lineup.resultOne : fill(t.lineup.results, { count });

  function reset() {
    setGenre("all");
    setTemp("all");
    setSearch("");
  }

  return (
    <main className="flex-1 pb-16">
      <PageHero
        title={t.pages.lineup}
        plainTitle={plain.pages.lineup}
        body={t.lineup.intro}
        image="/scenes/barista-pour.webp"
        imagePosition="center 40%"
      />

      <div className="mx-auto w-full max-w-6xl px-4">
        <div className="fade-below sticky top-16 z-30 -mx-4 space-y-3 bg-background/90 px-4 py-3 backdrop-blur-md supports-backdrop-filter:bg-background/80">
          {/* Row 1: search (framed, icon on a tile, live count) and the
              temperature switch. Row 2: genre chips, wrapping on md+. */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="group relative flex h-14 min-w-0 flex-1 items-center gap-3 rounded-md bg-card pr-2 pl-2 ring-1 ring-border transition-shadow ring-inset focus-within:ring-2 focus-within:ring-ring">
              <span
                aria-hidden
                className="flex size-10 shrink-0 items-center justify-center rounded-sm bg-muted text-muted-foreground transition-colors group-focus-within:bg-primary group-focus-within:text-primary-foreground"
              >
                <Search className="size-5" />
              </span>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={t.lineup.searchPlaceholder}
                aria-label={plain.lineup.searchLabel}
                className="h-full min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:hidden"
              />
              <span
                aria-live="polite"
                className="hidden shrink-0 rounded-sm bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground sm:inline"
              >
                {resultLabel}
              </span>
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label={plain.lineup.clearSearch}
                  className="flex size-10 shrink-0 items-center justify-center rounded-sm text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring"
                >
                  <X aria-hidden className="size-5" />
                </button>
              )}
            </div>
            <TempToggle value={temp} onChange={setTemp} />
          </div>
          <GenreFilter
            genres={genres}
            counts={genreCounts}
            value={genre}
            onChange={setGenre}
          />
        </div>

        {/* Count lives in the search field from sm up. */}
        <p className="mt-5 text-sm font-medium text-muted-foreground sm:hidden">
          {resultLabel}
        </p>

        {sections.length === 0 ? (
          <div className="mt-8 bg-muted p-10 text-center">
            <p className="text-lg">{t.lineup.empty}</p>
            <Button onClick={reset} variant="outline" className="mt-4">
              {t.lineup.reset}
            </Button>
          </div>
        ) : (
          sections.map(({ genre: g, drinks: sectionDrinks }) => {
            const term = genreTerms[g.slug];
            return (
              <section
                key={g.slug}
                aria-labelledby={`genre-${g.slug}`}
                className="mt-16 first-of-type:mt-8"
              >
                <div className="mb-6 flex items-end gap-4 border-b border-border pb-4">
                  <div className="min-w-0">
                    {/* Plain meaning with its genre swatch; the whole line
                        (swatch too) goes away in Plain mode. */}
                    {!isPlain && term && (
                      <p className="mb-2 flex items-center gap-2 eyebrow text-muted-foreground">
                        <span
                          aria-hidden
                          className={`size-3 shrink-0 rounded-full ${genreBlockFor(g.slug)}`}
                        />
                        {plain.terms[term]}
                      </p>
                    )}
                    <h2
                      id={`genre-${g.slug}`}
                      className="text-5xl leading-[0.85] font-black tracking-normal uppercase [font-stretch:64%] sm:text-7xl"
                    >
                      {term ? t.terms[term] : g.name}
                    </h2>
                  </div>
                  <span className="ml-auto pb-1 eyebrow text-highlight">
                    ({String(sectionDrinks.length).padStart(2, "0")})
                  </span>
                </div>
                <ul className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                  <AnimatePresence mode="popLayout" initial={false}>
                    {sectionDrinks.map((drink, index) => (
                      <motion.li
                        key={drink.id}
                        layout
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{
                          duration: 0.5,
                          delay: (index % 3) * 0.06,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                      >
                        <DrinkCard drink={drink} />
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              </section>
            );
          })
        )}
      </div>
    </main>
  );
}
