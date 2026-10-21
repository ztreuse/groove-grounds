"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useCopy } from "@/hooks/use-copy";
import type { DrinkDetail } from "@/lib/db/queries";
import { formatPeso } from "@/lib/format";
import { genreBlockFor, genreTerms } from "@/lib/genres";
import { routes } from "@/lib/routes";
import { DrinkVisual } from "./DrinkVisual";

// Drink page poster: the drink floats on its genre's colour block, with the
// dance style behind it, then name, description, the style note and price.
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
        className={`relative mt-3 aspect-square overflow-hidden rounded-[1.75rem] sm:aspect-[4/3] lg:aspect-square ${genreBlockFor(drink.genreSlug)} ${
          drink.isAvailable ? "" : "grayscale"
        }`}
      >
        <span
          aria-hidden
          className="absolute inset-0 halftone [mask-image:radial-gradient(circle_at_50%_60%,transparent_30%,black_80%)] text-espresso/15"
        />
        <span
          aria-hidden
          className="absolute inset-x-0 bottom-[-0.12em] text-center font-heading text-[30vw] leading-none whitespace-nowrap text-espresso/10 uppercase sm:text-[11rem] lg:text-[9rem]"
        >
          {drink.danceStyle}
        </span>
        <div className="absolute inset-x-[8%] top-[10%] bottom-[6%]">
          <DrinkVisual
            drink={drink}
            live
            priority
            sizes="(min-width: 1024px) 40vw, 90vw"
          />
        </div>
        <span className="absolute top-5 left-5 -rotate-3 rounded-full bg-espresso px-4 py-1.5 text-sm font-bold tracking-wide text-cream uppercase">
          {drink.danceStyle}
        </span>
        {term && (
          <span className="absolute top-5 right-5 rotate-2 rounded-full bg-cream px-3 py-1 text-xs font-bold tracking-wide text-espresso uppercase">
            <span aria-hidden>{t.terms[term]}</span>
            <span className="sr-only">{plain.terms[term]}</span>
          </span>
        )}
        {!drink.isAvailable && (
          <span className="absolute bottom-5 left-5 -rotate-2 rounded-full bg-cream px-4 py-1.5 text-sm font-bold tracking-wide text-espresso uppercase">
            <span aria-hidden>{t.terms.sittingOut}</span>
            <span className="sr-only">{plain.terms.sittingOut}</span>
          </span>
        )}
      </div>

      <div className="mt-6 flex items-start justify-between gap-4">
        <h1 className="text-5xl leading-[0.9] sm:text-6xl">{drink.name}</h1>
        <p className="shrink-0 font-heading text-4xl text-highlight sm:text-5xl">
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
