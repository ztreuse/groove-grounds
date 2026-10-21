"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useCopy } from "@/hooks/use-copy";
import type { DrinkDetail } from "@/lib/db/queries";
import { formatPeso } from "@/lib/format";
import { genreBlockFor, genreTerms } from "@/lib/genres";
import { routes } from "@/lib/routes";
import { DrinkVisual } from "./DrinkVisual";

// Drink page header: the product photo, then name, price, description and
// the dance style note.
export function DrinkHero({ drink }: { drink: DrinkDetail }) {
  const { t, plain } = useCopy();
  const term = genreTerms[drink.genreSlug];

  return (
    <div>
      <Link
        href={routes.lineup.href}
        aria-label={plain.drink.back}
        className="-ml-2 inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm font-semibold outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring"
      >
        <ArrowLeft aria-hidden className="size-4" />
        {t.drink.back}
      </Link>

      <div
        className={`relative mt-3 aspect-square overflow-hidden rounded-3xl sm:aspect-[4/3] lg:aspect-square ${genreBlockFor(drink.genreSlug)} ${
          drink.isAvailable ? "" : "grayscale"
        }`}
      >
        <DrinkVisual
          drink={drink}
          live
          priority
          sizes="(min-width: 1024px) 40vw, 90vw"
        />
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-background/90 px-3 py-1 text-sm font-semibold backdrop-blur">
            {drink.danceStyle}
          </span>
          {term && (
            <span className="rounded-full bg-background/90 px-3 py-1 text-sm font-medium backdrop-blur">
              <span aria-hidden>{t.terms[term]}</span>
              <span className="sr-only">{plain.terms[term]}</span>
            </span>
          )}
        </div>
        {!drink.isAvailable && (
          <span className="absolute bottom-4 left-4 rounded-full bg-espresso px-4 py-1.5 text-sm font-semibold text-cream">
            <span aria-hidden>{t.terms.sittingOut}</span>
            <span className="sr-only">{plain.terms.sittingOut}</span>
          </span>
        )}
      </div>

      <div className="mt-6 flex items-start justify-between gap-4">
        <h1 className="text-4xl leading-tight sm:text-5xl">{drink.name}</h1>
        <p className="shrink-0 text-3xl font-semibold text-highlight sm:text-4xl">
          {formatPeso(drink.basePrice)}
        </p>
      </div>
      <p className="mt-3 text-lg text-muted-foreground">
        {drink.plainDescription}
      </p>
      <p className="mt-4 text-lg font-medium">{drink.blurb}</p>
    </div>
  );
}
