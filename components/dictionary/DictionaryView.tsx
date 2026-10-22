"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { useCopy } from "@/hooks/use-copy";
import { useScrollEdges } from "@/hooks/use-scroll-edges";
import {
  danceStyleNotes,
  dictionarySections,
  snackWordNotes,
} from "@/lib/dictionary";

type StyleDrink = { style: string; name: string; slug: string };

const matches = (query: string, ...texts: string[]) =>
  !query || texts.some((text) => text.toLowerCase().includes(query));

export function DictionaryView({ styleDrinks }: { styleDrinks: StyleDrink[] }) {
  const { t, plain, isPlain } = useCopy();
  const [search, setSearch] = useState("");
  const edges = useScrollEdges<HTMLElement>();
  const query = search.trim().toLowerCase();

  const sections = dictionarySections
    .map((section) => ({
      ...section,
      entries: section.entries.filter((entry) =>
        matches(query, entry.term, entry.plain, entry.why),
      ),
    }))
    .filter((section) => section.entries.length > 0);
  const styles = danceStyleNotes
    .map((note) => ({
      ...note,
      drink: styleDrinks.find((drink) => drink.style === note.style),
    }))
    .filter((note) =>
      matches(query, note.style, note.note, note.drink?.name ?? ""),
    );
  const snackWords = snackWordNotes.filter((word) =>
    matches(query, word.term, word.note),
  );
  const nothing = !sections.length && !styles.length && !snackWords.length;

  const jumpLinks = [
    ...dictionarySections.map((s) => ({
      id: s.id,
      label: isPlain ? s.title.plain : s.title.dance,
    })),
    { id: "styles", label: t.dictionary.stylesTitle },
  ];

  return (
    <main className="flex-1 pb-16">
      <PageHero
        title={t.pages.dictionary}
        plainTitle={plain.pages.dictionary}
        body={t.dictionary.intro}
        image="/scenes/studio-floor.webp"
        imagePosition="center 60%"
      />
      <div className="mx-auto w-full max-w-6xl px-4">
        <div className="fade-below sticky top-16 z-30 -mx-4 mt-6 space-y-3 bg-background/90 px-4 py-3 backdrop-blur-md supports-backdrop-filter:bg-background/80">
          <div className="relative">
            <Search
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t.dictionary.searchPlaceholder}
              aria-label={plain.dictionary.searchLabel}
              className="h-11 w-full field rounded-md pr-12 pl-11 text-base outline-none placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-ring/40 [&::-webkit-search-cancel-button]:hidden"
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
          {!query && (
            <nav
              ref={edges}
              aria-label={plain.dictionary.jumpTo}
              className="-mx-4 flex [scrollbar-width:none] gap-2 overflow-x-auto scroll-edges px-4 [&::-webkit-scrollbar]:hidden"
            >
              {jumpLinks.map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  className="inline-flex h-11 shrink-0 items-center rounded-md bg-muted px-4 text-sm font-semibold whitespace-nowrap outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-3 focus-visible:ring-ring"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          )}
        </div>

        {nothing && (
          <p className="mt-8 rounded-3xl bg-muted/60 p-8 text-center text-lg">
            {t.dictionary.empty}
          </p>
        )}

        {sections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            aria-labelledby={`${section.id}-title`}
            className="mt-10 scroll-mt-44"
          >
            <h2
              id={`${section.id}-title`}
              className="mb-4 border-b pb-2 text-3xl leading-none"
            >
              {isPlain ? section.title.plain : section.title.dance}
            </h2>
            <dl className="grid gap-3 sm:grid-cols-2">
              {section.entries.map((entry) => (
                <div key={entry.term} className="surface p-4">
                  <dt className="label-display text-2xl leading-tight">
                    {entry.term}
                  </dt>
                  <dd className="mt-1 font-semibold text-highlight">
                    {entry.plain}
                  </dd>
                  <dd className="mt-2 text-sm text-muted-foreground">
                    <span className="sr-only">
                      {plain.dictionary.whyItFits}:{" "}
                    </span>
                    {entry.why}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ))}

        {styles.length > 0 && (
          <section
            id="styles"
            aria-labelledby="styles-title"
            className="mt-12 scroll-mt-44"
          >
            <h2
              id="styles-title"
              className="border-b pb-2 text-3xl leading-none"
            >
              {t.dictionary.stylesTitle}
            </h2>
            <p className="mt-3 mb-4 max-w-prose text-muted-foreground">
              {t.dictionary.stylesIntro}
            </p>
            <ul className="grid gap-3 sm:grid-cols-2">
              {styles.map((note) => (
                <li key={note.style} className="surface p-4">
                  <span className="inline-block rounded-sm bg-lilac px-2.5 py-1 text-xs font-bold tracking-wider text-espresso uppercase">
                    {note.style}
                  </span>
                  <p className="mt-3">{note.note}</p>
                  {note.drink && (
                    <p className="mt-3 text-sm">
                      <span className="text-muted-foreground">
                        {t.dictionary.onTheLineup}
                      </span>{" "}
                      <Link
                        href={`/lineup/${note.drink.slug}`}
                        className="inline-flex min-h-11 items-center font-semibold text-highlight underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring"
                      >
                        {note.drink.name}
                      </Link>
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {snackWords.length > 0 && (
          <section aria-labelledby="snack-words" className="mt-12">
            <h2
              id="snack-words"
              className="mb-4 border-b pb-2 text-3xl leading-none"
            >
              {t.dictionary.snacksTitle}
            </h2>
            <dl className="grid gap-3 sm:grid-cols-2">
              {snackWords.map((word) => (
                <div key={word.term} className="surface p-4">
                  <dt className="label-display text-2xl leading-none">
                    {word.term}
                  </dt>
                  <dd className="mt-2 text-sm text-muted-foreground">
                    {word.note}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        )}
      </div>
    </main>
  );
}
