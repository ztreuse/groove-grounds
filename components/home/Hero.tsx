"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, CalendarClock, Zap } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { DrinkVisual } from "@/components/lineup/DrinkVisual";
import { KineticTitle } from "@/components/motion/KineticTitle";
import { SpinBadge } from "@/components/motion/SpinBadge";
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
    className:
      "bg-transparent text-foreground ring-1 ring-foreground/80 ring-inset hover:bg-foreground hover:text-background",
  },
] as const satisfies {
  intent: OrderIntent;
  term: "dropIn" | "bookAClass";
  icon: typeof Zap;
  className: string;
}[];

const ease = [0.16, 1, 0.3, 1] as const;

// Split hero: the headline and order buttons on cream, a breaker frozen
// mid-move in a white studio running to the edge, the scroll-turned
// sticker on the seam and the Spotlight drink pinned to the photo.
export function Hero({ spotlight }: { spotlight: LineupDrink | undefined }) {
  const { t, plain, isPlain } = useCopy();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const photoY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const photoScale = useTransform(scrollYProgress, [0, 1], [1.04, 1.14]);

  return (
    <section
      ref={ref}
      className="relative grid grid-cols-1 border-b border-border lg:min-h-[calc(100dvh-5.5rem)] lg:grid-cols-2"
    >
      <div className="flex flex-col justify-center px-5 pt-12 pb-14 sm:px-8 lg:py-16 lg:pr-12 lg:pl-[max(2rem,calc((100vw-72rem)/2+1rem))]">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="mb-6 flex items-center gap-3 eyebrow text-muted-foreground"
        >
          <span aria-hidden className="relative flex size-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-primary opacity-60 motion-reduce:animate-none" />
            <span className="relative size-2 rounded-full bg-primary" />
          </span>
          {t.home.heroEyebrow}
        </motion.p>
        <KineticTitle
          text={t.home.heroTitle}
          accentLast
          className="text-[clamp(4.25rem,9vw,8.5rem)] [&_em]:text-highlight"
        />
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45, ease }}
          className="mt-7 max-w-sm text-lg text-muted-foreground"
        >
          {t.home.heroBody}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55, ease }}
          className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
        >
          {ctas.map(({ intent, term, icon: Icon, className }) => (
            <Link
              key={intent}
              href={routes.lineup.href}
              onClick={() => setOrderIntent(intent)}
              aria-label={plain.terms[term]}
              className={`group flex min-h-14 items-center gap-3 rounded-md py-2 pr-4 pl-5 transition-colors duration-300 outline-none focus-visible:ring-3 focus-visible:ring-ring active:translate-y-px ${className}`}
            >
              <Icon aria-hidden className="size-5 shrink-0" />
              <span className="flex-1 text-left">
                <span className="block font-heading text-lg leading-none font-extrabold tracking-tight whitespace-nowrap">
                  {t.terms[term]}
                </span>
                {!isPlain && (
                  <span className="block text-xs font-medium opacity-80">
                    {plain.terms[term]}
                  </span>
                )}
              </span>
              <ArrowRight
                aria-hidden
                className="size-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          ))}
        </motion.div>
      </div>

      <div className="relative min-h-[26rem] overflow-hidden bg-cream-soft sm:min-h-[34rem] lg:min-h-0">
        <motion.div
          initial={{ clipPath: "inset(0 0 0 100%)" }}
          animate={{ clipPath: "inset(0 0 0 0%)" }}
          transition={{ duration: 1.2, ease }}
          className="absolute inset-0"
        >
          <motion.div
            style={{ y: photoY, scale: photoScale }}
            className="absolute inset-0"
          >
            <Image
              src="/scenes/studio-freeze.webp"
              alt=""
              fill
              priority
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="object-cover object-[30%_center]"
            />
          </motion.div>
        </motion.div>

        {spotlight && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.8, ease }}
            className="absolute right-4 bottom-4 left-4 sm:right-auto sm:bottom-6 sm:left-6 sm:w-80"
          >
            <Link
              href={`/lineup/${spotlight.slug}`}
              aria-label={`${plain.home.spotlightCta}: ${spotlight.name}, ${formatPeso(spotlight.basePrice)}`}
              className="group flex items-center gap-3 bg-background/90 p-2 pr-4 shadow-[0_24px_50px_-24px_rgb(43_30_23_/_0.6)] backdrop-blur-xl outline-none focus-visible:ring-3 focus-visible:ring-ring"
            >
              <span className="relative size-16 shrink-0 overflow-hidden bg-muted">
                <span className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110">
                  <DrinkVisual drink={spotlight} sizes="64px" />
                </span>
              </span>
              <span className="min-w-0 flex-1">
                <span className="block eyebrow text-[0.65rem] text-highlight">
                  {t.terms.spotlight}
                </span>
                <span className="block truncate font-heading text-base leading-tight font-bold">
                  {spotlight.name}
                </span>
                <span className="block text-sm text-muted-foreground">
                  {formatPeso(spotlight.basePrice)}
                </span>
              </span>
              <ArrowUpRight
                aria-hidden
                className="size-5 shrink-0 transition-transform duration-300 group-hover:rotate-45"
              />
            </Link>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1, ease }}
          className="absolute top-5 right-5"
        >
          <SpinBadge words={[t.brand]} />
        </motion.div>
      </div>
    </section>
  );
}
