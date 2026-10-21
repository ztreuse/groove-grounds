"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useCopy } from "@/hooks/use-copy";
import type { LineupDrink } from "@/lib/db/queries";
import { formatPeso } from "@/lib/format";

export function Spotlight({ drink }: { drink: LineupDrink }) {
  const { t, plain, isPlain } = useCopy();

  return (
    <section
      aria-labelledby="spotlight"
      className="mx-auto w-full max-w-6xl px-4"
    >
      <div className="grid overflow-hidden rounded-3xl border-2 bg-card md:grid-cols-2">
        <div className="relative min-h-48 overflow-hidden bg-espresso text-cream dark:bg-espresso-deep">
          <span
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,var(--color-lilac)_0%,transparent_55%),radial-gradient(circle_at_10%_120%,var(--color-purple)_0%,transparent_60%)] opacity-80"
          />
          <span
            aria-hidden
            className="absolute -bottom-6 -left-2 font-heading text-[8rem] leading-none whitespace-nowrap text-cream/10 uppercase"
          >
            {drink.danceStyle}
          </span>
          <span className="absolute top-5 left-5 -rotate-2 rounded-md bg-primary px-3 py-1 text-sm font-bold tracking-wider text-primary-foreground uppercase">
            <span aria-hidden>{t.terms.spotlight}</span>
            <span className="sr-only">{plain.terms.spotlight}</span>
          </span>
          <span className="absolute top-5 right-5 rotate-2 rounded-md bg-lilac px-3 py-1 text-sm font-bold tracking-wider text-espresso uppercase">
            {drink.danceStyle}
          </span>
        </div>

        <div className="p-6 sm:p-8">
          <p className="text-sm font-semibold tracking-widest text-highlight uppercase">
            {t.terms.spotlight}
            {!isPlain && ` · ${plain.terms.spotlight}`}
          </p>
          <h2
            id="spotlight"
            className="mt-2 text-4xl leading-[0.95] sm:text-5xl"
          >
            {drink.name}
          </h2>
          <p className="mt-2 text-muted-foreground">{drink.plainDescription}</p>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <span className="font-heading text-4xl">
              {formatPeso(drink.basePrice)}
            </span>
            <Link
              href={`/lineup/${drink.slug}`}
              aria-label={plain.home.spotlightCta}
              className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-primary px-5 font-semibold text-primary-foreground outline-none hover:animate-beat focus-visible:ring-3 focus-visible:ring-ring motion-reduce:hover:animate-none"
            >
              {t.home.spotlightCta}
              <ArrowRight aria-hidden className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
