"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { KineticTitle } from "@/components/motion/KineticTitle";
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
        className="-ml-2 inline-flex min-h-11 items-center gap-2 rounded-md px-3 text-sm font-semibold outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring"
      >
        <ArrowLeft aria-hidden className="size-4" />
        {t.drink.back}
      </Link>

      <motion.div
        initial={{ clipPath: "inset(6% 6% 6% 6% round 0rem)", opacity: 0 }}
        animate={{ clipPath: "inset(0% 0% 0% 0% round 0rem)", opacity: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className={`relative mt-3 aspect-square overflow-hidden sm:aspect-[4/3] lg:aspect-square ${genreBlockFor(drink.genreSlug)} ${
          drink.isAvailable ? "" : "grayscale"
        }`}
      >
        <motion.div
          initial={{ scale: 1.15 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0"
        >
          <DrinkVisual
            drink={drink}
            live
            priority
            sizes="(min-width: 1024px) 40vw, 90vw"
          />
        </motion.div>
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          <span className="rounded-md bg-background/90 px-3 py-1.5 eyebrow backdrop-blur">
            {drink.danceStyle}
          </span>
          {term && (
            <span className="rounded-md bg-background/90 px-3 py-1 text-sm font-medium backdrop-blur">
              <span aria-hidden>{t.terms[term]}</span>
              <span className="sr-only">{plain.terms[term]}</span>
            </span>
          )}
        </div>
        {!drink.isAvailable && (
          <span className="absolute bottom-4 left-4 rounded-md bg-espresso px-4 py-1.5 text-sm font-semibold text-cream">
            <span aria-hidden>{t.terms.sittingOut}</span>
            <span className="sr-only">{plain.terms.sittingOut}</span>
          </span>
        )}
      </motion.div>

      <div className="mt-7 flex items-start justify-between gap-4">
        <KineticTitle
          text={drink.name}
          delay={0.2}
          className="text-[clamp(3rem,9vw,5.25rem)]"
        />
        <p className="shrink-0 pt-1 font-heading text-4xl leading-none font-black text-highlight [font-stretch:70%] sm:text-5xl">
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
