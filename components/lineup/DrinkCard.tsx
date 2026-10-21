"use client";

import Link from "next/link";
import { CupSoda, Flame, Snowflake } from "lucide-react";
import { useCopy } from "@/hooks/use-copy";
import type { LineupDrink } from "@/lib/db/queries";
import { formatPeso } from "@/lib/format";

const tempLabels = {
  hot: { key: "warmUp", icon: Flame },
  iced: { key: "coolDown", icon: Snowflake },
  blended: { key: "blended", icon: CupSoda },
} as const;

// Styled like a class flyer: a dark "stage" band with the dance style sticker,
// then the drink name, plain description and a big price.
export function DrinkCard({ drink }: { drink: LineupDrink }) {
  const { t, plain } = useCopy();

  return (
    <Link
      href={`/lineup/${drink.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border-2 bg-card transition-colors outline-none hover:animate-beat hover:border-primary focus-visible:ring-3 focus-visible:ring-ring motion-reduce:hover:animate-none"
    >
      <div
        className={`relative h-20 overflow-hidden bg-espresso text-cream dark:bg-espresso-deep ${
          drink.isAvailable ? "" : "grayscale"
        }`}
      >
        <span
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(circle_at_15%_130%,var(--color-purple)_0%,transparent_65%)] opacity-80 transition-opacity group-hover:opacity-100"
        />
        <span
          aria-hidden
          className="absolute -right-1 -bottom-3 font-heading text-6xl leading-none whitespace-nowrap text-cream/10 uppercase"
        >
          {drink.danceStyle}
        </span>
        <span className="absolute top-4 left-4 -rotate-2 rounded-md bg-lilac px-2.5 py-1 text-xs font-bold tracking-wider text-espresso uppercase shadow-sm">
          {drink.danceStyle}
        </span>
        {!drink.isAvailable && (
          <span className="absolute top-4 right-4 rotate-3 rounded-md bg-cream px-2.5 py-1 text-xs font-bold tracking-wider text-espresso uppercase">
            <span aria-hidden>{t.terms.sittingOut}</span>
            <span className="sr-only">{plain.terms.sittingOut}</span>
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-2xl leading-tight">{drink.name}</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {drink.plainDescription}
        </p>
        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <span className="font-heading text-3xl leading-none">
            {formatPeso(drink.basePrice)}
          </span>
          {drink.tempsAllowed.length > 0 && (
            <ul className="flex flex-wrap justify-end gap-1.5">
              {drink.tempsAllowed.map((temp) => {
                const { key, icon: Icon } = tempLabels[temp];
                return (
                  <li
                    key={temp}
                    className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium"
                  >
                    <Icon aria-hidden className="size-3.5" />
                    <span aria-hidden>{t.remix[key]}</span>
                    <span className="sr-only">{plain.remix[key]}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </Link>
  );
}
