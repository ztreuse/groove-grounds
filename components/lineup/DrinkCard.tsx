"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useCopy } from "@/hooks/use-copy";
import type { LineupDrink } from "@/lib/db/queries";
import { formatPeso } from "@/lib/format";
import { genreBlockFor } from "@/lib/genres";
import { DrinkVisual } from "./DrinkVisual";
import { StyleTag } from "./StyleTag";
import { TempBadge } from "./TempBadge";

type DrinkCardProps = {
  drink: LineupDrink;
  // Two-up phone grid: tighter type, temperature icons without labels.
  compact?: boolean;
};

// Editorial product card: a tall photo on its genre colour, a hairline,
// then temps and price, and the name in poster caps.
export function DrinkCard({ drink, compact = false }: DrinkCardProps) {
  const { t, plain } = useCopy();

  return (
    <Link
      href={`/lineup/${drink.slug}`}
      className="group relative flex h-full flex-col outline-none focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
    >
      <div
        className={`relative aspect-[4/5] overflow-hidden ${genreBlockFor(drink.genreSlug)} ${
          drink.isAvailable ? "" : "grayscale"
        }`}
      >
        <div className="absolute inset-0 transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110">
          <DrinkVisual
            drink={drink}
            sizes="(min-width: 1024px) 360px, (min-width: 640px) 45vw, 80vw"
          />
        </div>
        <span
          className={
            compact
              ? "absolute top-2 left-2 sm:top-3 sm:left-3"
              : "absolute top-3 left-3"
          }
        >
          <StyleTag label={drink.danceStyle} genre={drink.genreSlug} />
        </span>
        {!drink.isAvailable && (
          <span className="absolute top-3 right-3 rounded-sm bg-espresso px-2.5 py-1 text-xs font-semibold text-cream">
            <span aria-hidden>{t.terms.sittingOut}</span>
            <span className="sr-only">{plain.terms.sittingOut}</span>
          </span>
        )}
        <span
          aria-hidden
          className="absolute right-3 bottom-3 flex size-11 translate-y-3 items-center justify-center rounded-full bg-foreground text-background opacity-0 transition-[opacity,translate,rotate] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:translate-y-0 group-hover:opacity-100"
        >
          <ArrowUpRight className="size-5" />
        </span>
      </div>

      <div
        className={`flex items-center gap-3 border-t border-foreground ${compact ? "mt-3 pt-2.5 sm:mt-4 sm:pt-3" : "mt-4 pt-3"}`}
      >
        {drink.tempsAllowed.length > 0 && (
          <ul
            className={`flex flex-wrap gap-y-1 ${compact ? "gap-x-1.5 sm:gap-x-3" : "gap-x-3"}`}
          >
            {drink.tempsAllowed.map((temp) => (
              <li key={temp}>
                <TempBadge temp={temp} iconOnlyOnPhones={compact} />
              </li>
            ))}
          </ul>
        )}
        <span
          className={`ml-auto shrink-0 font-heading leading-none font-black text-highlight [font-stretch:70%] ${compact ? "text-lg sm:text-xl" : "text-xl"}`}
        >
          {formatPeso(drink.basePrice)}
        </span>
      </div>
      <h3
        className={`mt-2 font-heading leading-[0.95] font-black uppercase [font-stretch:64%] ${compact ? "text-xl sm:text-3xl" : "text-2xl sm:text-3xl"}`}
      >
        {drink.name}
      </h3>
      <p
        className={`mt-1.5 text-muted-foreground ${compact ? "text-xs sm:text-sm" : "text-sm"}`}
      >
        {drink.plainDescription}
      </p>
    </Link>
  );
}
