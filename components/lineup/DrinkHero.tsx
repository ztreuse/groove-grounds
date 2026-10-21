"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useCopy } from "@/hooks/use-copy";
import type { DrinkDetail } from "@/lib/db/queries";
import { formatPeso } from "@/lib/format";
import { genreTerms } from "@/lib/genres";
import { routes } from "@/lib/routes";

// Big flyer for the drink page. The stage band stands in for the drink photo
// until real photos exist (see Open items in the spec).
export function DrinkHero({ drink }: { drink: DrinkDetail }) {
  const { t, plain } = useCopy();
  const term = genreTerms[drink.genreSlug];

  return (
    <div>
      <Link
        href={routes.lineup.href}
        aria-label={plain.drink.back}
        className="-ml-2 inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-sm font-semibold outline-none hover:text-highlight focus-visible:ring-3 focus-visible:ring-ring"
      >
        <ArrowLeft aria-hidden className="size-4" />
        {t.drink.back}
      </Link>

      <div
        className={`relative mt-3 h-48 overflow-hidden rounded-3xl bg-espresso text-cream sm:h-64 dark:bg-espresso-deep ${
          drink.isAvailable ? "" : "grayscale"
        }`}
      >
        <span
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(circle_at_20%_120%,var(--color-purple)_0%,transparent_60%),radial-gradient(circle_at_90%_-20%,var(--color-lilac)_0%,transparent_45%)] opacity-80"
        />
        <span
          aria-hidden
          className="absolute -bottom-6 -left-2 font-heading text-[8rem] leading-none whitespace-nowrap text-cream/10 uppercase sm:text-[11rem]"
        >
          {drink.danceStyle}
        </span>
        <span className="absolute top-5 left-5 -rotate-2 rounded-md bg-lilac px-3 py-1 text-sm font-bold tracking-wider text-espresso uppercase shadow-sm">
          {drink.danceStyle}
        </span>
        {term && (
          <span className="absolute top-5 right-5 rotate-2 rounded-md bg-cream/90 px-3 py-1 text-xs font-bold tracking-wider text-espresso uppercase">
            <span aria-hidden>{t.terms[term]}</span>
            <span className="sr-only">{plain.terms[term]}</span>
          </span>
        )}
        {!drink.isAvailable && (
          <span className="absolute bottom-5 left-5 -rotate-2 rounded-md bg-cream px-3 py-1 text-sm font-bold tracking-wider text-espresso uppercase">
            <span aria-hidden>{t.terms.sittingOut}</span>
            <span className="sr-only">{plain.terms.sittingOut}</span>
          </span>
        )}
      </div>

      <h1 className="mt-6 text-5xl leading-[0.95] sm:text-6xl">{drink.name}</h1>
      <p className="mt-2 text-lg text-muted-foreground">
        {drink.plainDescription}
      </p>
      <p className="mt-4 border-l-4 border-primary pl-3 italic">
        {drink.blurb}
      </p>
      <p className="mt-4 font-heading text-4xl">
        {formatPeso(drink.basePrice)}
      </p>
    </div>
  );
}
