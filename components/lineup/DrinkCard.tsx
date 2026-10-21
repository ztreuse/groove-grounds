"use client";

import Link from "next/link";
import { CupSoda, Flame, Snowflake } from "lucide-react";
import { useCopy } from "@/hooks/use-copy";
import type { LineupDrink } from "@/lib/db/queries";
import { formatPeso } from "@/lib/format";
import { genreBlockFor } from "@/lib/genres";
import { DrinkVisual } from "./DrinkVisual";

const tempIcons = {
  hot: { key: "warmUp", icon: Flame },
  iced: { key: "coolDown", icon: Snowflake },
  blended: { key: "blended", icon: CupSoda },
} as const;

// Poster card: the drink floats on its genre's colour block, name and price
// sit below. No outline; depth comes from colour and a warm shadow.
export function DrinkCard({ drink }: { drink: LineupDrink }) {
  const { t, plain } = useCopy();

  return (
    <Link
      href={`/lineup/${drink.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-card shadow-[0_18px_40px_-24px_rgb(59_42_32_/_0.45)] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] outline-none hover:-translate-y-1 focus-visible:ring-3 focus-visible:ring-ring active:scale-[0.99]"
    >
      <div
        className={`relative aspect-[5/4] overflow-hidden ${genreBlockFor(drink.genreSlug)} ${
          drink.isAvailable ? "" : "grayscale"
        }`}
      >
        <span
          aria-hidden
          className="absolute inset-0 halftone [mask-image:linear-gradient(to_top,black,transparent_75%)] text-espresso/15"
        />
        <span
          aria-hidden
          className="absolute -bottom-4 left-3 font-heading text-[5.5rem] leading-none whitespace-nowrap text-espresso/[0.06] uppercase"
        >
          {drink.danceStyle}
        </span>
        <div className="absolute inset-x-0 top-[8%] bottom-[4%] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-hover:-rotate-2">
          <DrinkVisual
            drink={drink}
            sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 90vw"
          />
        </div>
        <span className="absolute top-4 left-4 -rotate-3 rounded-full bg-espresso px-3 py-1 text-xs font-bold tracking-wide text-cream uppercase">
          {drink.danceStyle}
        </span>
        {!drink.isAvailable && (
          <span className="absolute top-4 right-4 rotate-3 rounded-full bg-cream px-3 py-1 text-xs font-bold tracking-wide text-espresso uppercase">
            <span aria-hidden>{t.terms.sittingOut}</span>
            <span className="sr-only">{plain.terms.sittingOut}</span>
          </span>
        )}
      </div>

      <div className="flex flex-1 items-end justify-between gap-3 p-5">
        <div className="min-w-0">
          <h3 className="text-2xl leading-[0.95]">{drink.name}</h3>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {drink.plainDescription}
          </p>
          {drink.tempsAllowed.length > 0 && (
            <ul className="mt-2 flex gap-3 text-xs font-medium text-muted-foreground">
              {drink.tempsAllowed.map((temp) => {
                const { key, icon: Icon } = tempIcons[temp];
                return (
                  <li key={temp} className="flex items-center gap-1">
                    <Icon aria-hidden className="size-3.5" />
                    <span aria-hidden>{t.remix[key]}</span>
                    <span className="sr-only">{plain.remix[key]}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <span className="shrink-0 font-heading text-3xl leading-none text-highlight">
          {formatPeso(drink.basePrice)}
        </span>
      </div>
    </Link>
  );
}
