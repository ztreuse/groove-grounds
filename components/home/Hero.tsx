"use client";

import Link from "next/link";
import { CalendarClock, Zap } from "lucide-react";
import { DrinkVisual } from "@/components/lineup/DrinkVisual";
import { useCopy } from "@/hooks/use-copy";
import type { LineupDrink } from "@/lib/db/queries";
import { formatPeso } from "@/lib/format";
import { setOrderIntent, type OrderIntent } from "@/lib/order-intent";
import { routes } from "@/lib/routes";

const ctas = [
  {
    intent: "drop_in",
    term: "dropIn",
    icon: Zap,
    className: "bg-primary text-primary-foreground hover:bg-primary/90",
  },
  {
    intent: "class",
    term: "bookAClass",
    icon: CalendarClock,
    className: "bg-cream text-espresso hover:bg-cream/90",
  },
] as const satisfies {
  intent: OrderIntent;
  term: "dropIn" | "bookAClass";
  icon: typeof Zap;
  className: string;
}[];

// Split poster hero: headline and the two order buttons on the left, the
// Spotlight drink spinning on a record on the right.
export function Hero({ spotlight }: { spotlight: LineupDrink | undefined }) {
  const { t, plain, isPlain } = useCopy();
  const words = t.home.heroTitle.split(" ");
  const lastWord = words.pop();

  return (
    <section className="relative overflow-hidden bg-espresso text-cream dark:bg-espresso-deep">
      <span
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_78%_45%,var(--color-purple)_0%,transparent_45%)] opacity-60"
      />
      <span
        aria-hidden
        className="absolute bottom-0 left-0 h-1/2 w-1/2 halftone [mask-image:radial-gradient(circle_at_0%_100%,black,transparent_70%)] text-lilac/20"
      />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-6 px-4 pt-10 pb-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10 lg:pt-16 lg:pb-20">
        <div>
          <h1 className="text-6xl leading-[0.85] sm:text-7xl lg:text-8xl">
            {words.join(" ")} <span className="text-lilac">{lastWord}</span>
          </h1>
          <p className="mt-6 max-w-md text-lg text-cream/85">
            {t.home.heroBody}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {ctas.map(({ intent, term, icon: Icon, className }) => (
              <Link
                key={intent}
                href={routes.lineup.href}
                onClick={() => setOrderIntent(intent)}
                aria-label={plain.terms[term]}
                className={`flex min-h-14 items-center gap-3 rounded-full py-2 pr-6 pl-5 transition-transform outline-none hover:animate-beat focus-visible:ring-3 focus-visible:ring-lilac active:scale-[0.98] motion-reduce:hover:animate-none ${className}`}
              >
                <Icon aria-hidden className="size-5 shrink-0" />
                <span className="text-left">
                  <span className="block font-heading text-xl leading-none tracking-wide uppercase">
                    {t.terms[term]}
                  </span>
                  {!isPlain && (
                    <span className="block text-xs font-medium opacity-80">
                      {plain.terms[term]}
                    </span>
                  )}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {spotlight && (
          <div className="relative mx-auto aspect-square w-full max-w-[340px] sm:max-w-[420px] lg:max-w-[480px]">
            {/* The record the drink "plays" on. */}
            <span
              aria-hidden
              className="absolute inset-[8%] rounded-full bg-[repeating-radial-gradient(circle,var(--color-espresso-deep)_0_3px,var(--color-espresso-soft)_3px_5px)] shadow-[0_30px_60px_-20px_rgb(0_0_0_/_0.6)] motion-safe:animate-spin-slow"
            >
              <span className="absolute inset-[38%] rounded-full bg-lilac" />
            </span>
            <div className="absolute inset-[2%] bottom-[10%]">
              <DrinkVisual
                drink={spotlight}
                live
                priority
                sizes="(min-width: 1024px) 480px, 80vw"
              />
            </div>
            <Link
              href={`/lineup/${spotlight.slug}`}
              aria-label={`${plain.home.spotlightCta}: ${spotlight.name}, ${formatPeso(spotlight.basePrice)}`}
              className="absolute bottom-0 left-0 flex -rotate-6 items-center gap-3 rounded-full bg-lilac py-2 pr-5 pl-2 text-espresso shadow-lg transition-transform outline-none hover:rotate-0 focus-visible:ring-3 focus-visible:ring-cream"
            >
              <span className="rounded-full bg-espresso px-3 py-1 text-xs font-bold tracking-wide text-cream uppercase">
                {t.terms.spotlight}
              </span>
              <span className="font-heading text-lg leading-none tracking-wide uppercase">
                {spotlight.danceStyle}
              </span>
              <span className="font-heading text-lg leading-none">
                {formatPeso(spotlight.basePrice)}
              </span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
