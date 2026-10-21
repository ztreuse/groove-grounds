"use client";

import Link from "next/link";
import { CalendarClock, Zap } from "lucide-react";
import { motion } from "motion/react";
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

const rise = {
  hidden: { opacity: 0, y: 24 },
  shown: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  },
};

// Split hero: headline and the two order buttons on the left, the
// Spotlight drink photo on the right.
export function Hero({ spotlight }: { spotlight: LineupDrink | undefined }) {
  const { t, plain, isPlain } = useCopy();
  const words = t.home.heroTitle.split(" ");
  const lastWord = words.pop();

  return (
    <section className="relative mx-2 mt-2 overflow-hidden rounded-[2rem] bg-espresso text-cream sm:mx-4 sm:rounded-[2.5rem] dark:bg-espresso-deep">
      <span
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_78%_45%,var(--color-purple)_0%,transparent_45%)] opacity-60"
      />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-6 px-4 pt-10 pb-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10 lg:pt-16 lg:pb-20">
        <motion.div
          initial="hidden"
          animate="shown"
          transition={{ staggerChildren: 0.08 }}
        >
          <motion.h1
            variants={rise}
            className="text-5xl leading-[0.95] sm:text-6xl lg:text-7xl"
          >
            {words.join(" ")} <span className="text-lilac">{lastWord}</span>
          </motion.h1>
          <motion.p
            variants={rise}
            className="mt-6 max-w-md text-lg text-cream/85"
          >
            {t.home.heroBody}
          </motion.p>
          <motion.div
            variants={rise}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
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
                  <span className="block font-heading text-xl leading-none tracking-tight">
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
          </motion.div>
        </motion.div>

        {spotlight && (
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="relative mx-auto w-full max-w-[360px] pb-8 sm:max-w-[420px] lg:max-w-[460px]"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-espresso-soft shadow-[0_40px_80px_-30px_rgb(0_0_0_/_0.7)]">
              <DrinkVisual
                drink={spotlight}
                live
                priority
                sizes="(min-width: 1024px) 460px, 80vw"
              />
            </div>
            <Link
              href={`/lineup/${spotlight.slug}`}
              aria-label={`${plain.home.spotlightCta}: ${spotlight.name}, ${formatPeso(spotlight.basePrice)}`}
              className="absolute bottom-0 -left-2 flex items-center gap-4 rounded-2xl bg-background py-3 pr-5 pl-4 text-foreground shadow-xl outline-none focus-visible:ring-3 focus-visible:ring-ring sm:-left-8"
            >
              <span>
                <span className="block text-xs font-semibold text-highlight">
                  {t.terms.spotlight}
                </span>
                <span className="block text-base font-semibold">
                  {spotlight.name}
                </span>
              </span>
              <span className="text-lg font-semibold">
                {formatPeso(spotlight.basePrice)}
              </span>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
