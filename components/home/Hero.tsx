"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarClock, Zap } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { DrinkVisual } from "@/components/lineup/DrinkVisual";
import { KineticTitle } from "@/components/motion/KineticTitle";
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
    className:
      "bg-primary text-primary-foreground shadow-[0_18px_40px_-14px_var(--color-purple)] hover:bg-primary/90",
  },
  {
    intent: "class",
    term: "bookAClass",
    icon: CalendarClock,
    className:
      "border border-cream/25 bg-cream/10 text-cream backdrop-blur-md hover:bg-cream/20",
  },
] as const satisfies {
  intent: OrderIntent;
  term: "dropIn" | "bookAClass";
  icon: typeof Zap;
  className: string;
}[];

const ease = [0.16, 1, 0.3, 1] as const;

// Full-bleed hero: a dance-floor photo drifting behind a poster headline,
// the two order buttons, and the Spotlight drink on a glass card.
export function Hero({ spotlight }: { spotlight: LineupDrink | undefined }) {
  const { t, plain, isPlain } = useCopy();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const photoY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);

  return (
    <section
      ref={ref}
      className="theme-dark grain relative mx-2 mt-2 overflow-hidden rounded-[2rem] bg-background sm:mx-4 sm:rounded-[2.5rem]"
    >
      <motion.div
        aria-hidden
        style={{ y: photoY }}
        className="absolute inset-x-0 -inset-y-[12%]"
      >
        <Image
          src="/scenes/crew-purple.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[70%_center] opacity-70"
        />
      </motion.div>
      <span
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(95deg,var(--color-espresso-deep)_20%,color-mix(in_oklch,var(--color-espresso-deep)_60%,transparent)_50%,transparent_85%)]"
      />
      <span
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-espresso-deep via-espresso-deep/60 to-transparent"
      />

      <motion.div
        style={{ y: textY }}
        className="relative mx-auto grid min-h-[min(88dvh,52rem)] w-full max-w-6xl grid-cols-1 items-end gap-10 px-5 pt-28 pb-10 sm:px-8 sm:pb-14 lg:grid-cols-[1fr_auto]"
      >
        <div>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="mb-5 flex items-center gap-3 eyebrow text-lilac"
          >
            <span aria-hidden className="relative flex size-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-lilac opacity-75 motion-reduce:animate-none" />
              <span className="relative size-2 rounded-full bg-lilac" />
            </span>
            {t.home.heroEyebrow}
          </motion.p>
          <KineticTitle
            text={t.home.heroTitle}
            accentLast
            className="max-w-[11ch] text-[clamp(4rem,15vw,11rem)]"
          />
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45, ease }}
            className="mt-6 max-w-md text-lg text-foreground/80"
          >
            {t.home.heroBody}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55, ease }}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            {ctas.map(({ intent, term, icon: Icon, className }) => (
              <Link
                key={intent}
                href={routes.lineup.href}
                onClick={() => setOrderIntent(intent)}
                aria-label={plain.terms[term]}
                className={`group flex min-h-14 items-center gap-3 rounded-full py-2 pr-6 pl-5 transition-[transform,background-color] duration-300 outline-none focus-visible:ring-3 focus-visible:ring-lilac active:scale-[0.97] ${className}`}
              >
                <Icon
                  aria-hidden
                  className="size-5 shrink-0 transition-transform duration-300 group-hover:-rotate-12"
                />
                <span className="text-left">
                  <span className="block font-heading text-lg leading-none font-extrabold tracking-tight">
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
        </div>

        {spotlight && (
          <motion.div
            initial={{ opacity: 0, y: 40, rotate: 4 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ duration: 1, delay: 0.5, ease }}
            className="w-full max-w-sm min-w-0 justify-self-start lg:w-80 lg:justify-self-end"
          >
            <Link
              href={`/lineup/${spotlight.slug}`}
              aria-label={`${plain.home.spotlightCta}: ${spotlight.name}, ${formatPeso(spotlight.basePrice)}`}
              className="group block rounded-[1.75rem] border border-cream/15 bg-cream/10 p-2.5 backdrop-blur-xl transition-colors outline-none hover:bg-cream/15 focus-visible:ring-3 focus-visible:ring-lilac"
            >
              <span className="relative block aspect-[5/4] overflow-hidden rounded-[1.25rem] bg-espresso-soft">
                <span className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105">
                  <DrinkVisual drink={spotlight} live priority sizes="320px" />
                </span>
                <span className="absolute top-3 left-3 rounded-full bg-espresso-deep/70 px-2.5 py-1 eyebrow text-[0.65rem] text-lilac backdrop-blur">
                  {t.terms.spotlight}
                </span>
              </span>
              <span className="flex items-center gap-3 px-2 pt-3 pb-1.5">
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-heading text-lg leading-tight font-bold tracking-tight">
                    {spotlight.name}
                  </span>
                  <span className="block text-sm text-foreground/70">
                    {formatPeso(spotlight.basePrice)}
                  </span>
                </span>
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-lilac text-espresso transition-transform duration-300 group-hover:rotate-45">
                  <ArrowUpRight aria-hidden className="size-5" />
                </span>
              </span>
            </Link>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
