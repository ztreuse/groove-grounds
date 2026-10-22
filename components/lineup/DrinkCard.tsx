"use client";

import Link from "next/link";
import { ArrowUpRight, CupSoda, Flame, Snowflake } from "lucide-react";
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

// Product card: photo on top, name, description and price below.
export function DrinkCard({ drink }: { drink: LineupDrink }) {
  const { t, plain } = useCopy();

  return (
    <Link
      href={`/lineup/${drink.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-card p-2 shadow-[0_0_0_1px_color-mix(in_oklch,var(--border)_70%,transparent),0_18px_40px_-28px_rgb(59_42_32_/_0.5)] transition-[translate,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] outline-none hover:-translate-y-1 hover:shadow-[0_0_0_1px_color-mix(in_oklch,var(--border)_70%,transparent),0_30px_60px_-28px_rgb(59_42_32_/_0.6)] focus-visible:ring-3 focus-visible:ring-ring"
    >
      <div
        className={`relative aspect-[4/3] overflow-hidden rounded-[1.25rem] ${genreBlockFor(drink.genreSlug)} ${
          drink.isAvailable ? "" : "grayscale"
        }`}
      >
        <div className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110">
          <DrinkVisual
            drink={drink}
            sizes="(min-width: 1024px) 360px, (min-width: 640px) 45vw, 90vw"
          />
        </div>
        <span className="absolute top-3 left-3 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold backdrop-blur">
          {drink.danceStyle}
        </span>
        <span
          aria-hidden
          className="absolute right-3 bottom-3 flex size-10 translate-y-2 items-center justify-center rounded-full bg-lilac text-espresso opacity-0 transition-[opacity,translate,rotate] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-hover:rotate-45 group-hover:opacity-100"
        >
          <ArrowUpRight className="size-5" />
        </span>
        {!drink.isAvailable && (
          <span className="absolute top-3 right-3 rounded-full bg-espresso px-3 py-1 text-xs font-semibold text-cream">
            <span aria-hidden>{t.terms.sittingOut}</span>
            <span className="sr-only">{plain.terms.sittingOut}</span>
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col px-3 pt-4 pb-3">
        <h3 className="text-xl leading-tight">{drink.name}</h3>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {drink.plainDescription}
        </p>
        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          {drink.tempsAllowed.length > 0 ? (
            <ul className="flex gap-3 text-xs font-medium text-muted-foreground">
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
          ) : (
            <span />
          )}
          <span className="shrink-0 font-heading text-2xl leading-none font-black text-highlight [font-stretch:70%]">
            {formatPeso(drink.basePrice)}
          </span>
        </div>
      </div>
    </Link>
  );
}
