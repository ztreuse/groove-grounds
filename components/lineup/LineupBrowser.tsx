"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCopy } from "@/hooks/use-copy";
import { fill } from "@/lib/copy";
import type { LineupDrink, LineupGenre } from "@/lib/db/queries";
import { genreTerms } from "@/lib/genres";
import { DrinkCard } from "./DrinkCard";
import { GenreFilter } from "./GenreFilter";
import { TempToggle, type TempFilter } from "./TempToggle";

type LineupBrowserProps = {
  genres: LineupGenre[];
  drinks: LineupDrink[];
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

export function LineupBrowser({ genres, drinks }: LineupBrowserProps) {
  const { t, plain, isPlain } = useCopy();
  const [genre, setGenre] = useState("all");
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

  function reset() {
    setGenre("all");
    setTemp("all");
    setSearch("");
  }

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-16">
      <header className="pt-8 pb-5 sm:pt-12">
        <h1 className="text-5xl leading-none sm:text-7xl">{t.pages.lineup}</h1>
        {!isPlain && (
          <p className="mt-1 text-lg text-muted-foreground">
            {plain.pages.lineup}
          </p>
        )}
        <p className="mt-3 max-w-prose">{t.lineup.intro}</p>
      </header>

      <div className="sticky top-16 z-30 -mx-4 space-y-3 border-b bg-background/95 px-4 py-3 backdrop-blur supports-backdrop-filter:bg-background/80">
        <div className="relative">
          <Search
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t.lineup.searchPlaceholder}
            aria-label={plain.lineup.searchLabel}
            className="h-11 w-full rounded-full border-2 border-input bg-card pr-12 pl-11 text-base outline-none placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-ring/40 [&::-webkit-search-cancel-button]:hidden"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label={plain.lineup.clearSearch}
              className="absolute top-0 right-0 flex size-11 items-center justify-center rounded-full text-muted-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring"
            >
              <X aria-hidden className="size-5" />
            </button>
          )}
        </div>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0 md:flex-1">
            <GenreFilter genres={genres} value={genre} onChange={setGenre} />
          </div>
          <TempToggle value={temp} onChange={setTemp} />
        </div>
      </div>

      <p
        aria-live="polite"
        className="mt-5 text-sm font-medium text-muted-foreground"
      >
        {count === 1 ? t.lineup.resultOne : fill(t.lineup.results, { count })}
      </p>

      {sections.length === 0 ? (
        <div className="mt-8 rounded-2xl border-2 border-dashed p-8 text-center">
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
              className="mt-8"
            >
              <div className="mb-4 flex items-baseline gap-3 border-b-2 border-dashed pb-2">
                <h2 id={`genre-${g.slug}`} className="text-3xl leading-none">
                  {term ? t.terms[term] : g.name}
                </h2>
                {!isPlain && term && (
                  <span className="text-sm text-muted-foreground">
                    {plain.terms[term]}
                  </span>
                )}
              </div>
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {sectionDrinks.map((drink) => (
                  <li key={drink.id}>
                    <DrinkCard drink={drink} />
                  </li>
                ))}
              </ul>
            </section>
          );
        })
      )}
    </main>
  );
}
