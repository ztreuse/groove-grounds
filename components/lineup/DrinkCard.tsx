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

type DrinkCardProps = {
  drink: LineupDrink;
  // Shown as "01", "02"… in numbered rows (Trending).
  index?: number;
};

// Editorial product card: a tall photo on its genre colour, a hairline,
// then number, temps and price, and the name in poster caps.
export function DrinkCard({ drink, index }: DrinkCardProps) {
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
        <span className="absolute top-3 left-3 rounded-sm bg-background/90 px-2 py-1 eyebrow text-[0.65rem] backdrop-blur">
          {drink.danceStyle}
        </span>
        {!drink.isAvailable && (
          <span className="absolute top-3 right-3 rounded-sm bg-espresso px-2.5 py-1 text-xs font-semibold text-cream">
            <span aria-hidden>{t.terms.sittingOut}</span>
            <span className="sr-only">{plain.terms.sittingOut}</span>
          </span>
        )}
        <span
          aria-hidden
          className="absolute right-3 bottom-3 flex size-11 translate-y-3 items-center justify-center rounded-full bg-foreground text-background opacity-0 transition-[opacity,translate,rotate] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-hover:rotate-45 group-hover:opacity-100"
        >
          <ArrowUpRight className="size-5" />
        </span>
      </div>

      <div className="mt-4 flex items-center gap-3 border-t border-foreground pt-3">
        {index !== undefined && (
          <span className="eyebrow text-muted-foreground">
            {String(index + 1).padStart(2, "0")}
          </span>
        )}
        {drink.tempsAllowed.length > 0 && (
          <ul className="flex gap-2.5 text-xs font-medium text-muted-foreground">
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
        <span className="ml-auto shrink-0 font-heading text-xl leading-none font-black text-highlight [font-stretch:70%]">
          {formatPeso(drink.basePrice)}
        </span>
      </div>
      <h3 className="mt-2 font-heading text-2xl leading-[0.95] font-black uppercase [font-stretch:64%] sm:text-3xl">
        {drink.name}
      </h3>
      <p className="mt-1.5 text-sm text-muted-foreground">
        {drink.plainDescription}
      </p>
    </Link>
  );
}
