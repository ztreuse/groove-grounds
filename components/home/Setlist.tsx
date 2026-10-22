"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "motion/react";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { DrinkVisual } from "@/components/lineup/DrinkVisual";
import { useCopy } from "@/hooks/use-copy";
import type { LineupDrink } from "@/lib/db/queries";
import { formatPeso } from "@/lib/format";
import { routes } from "@/lib/routes";

const pad = (n: number) => String(n).padStart(2, "0");

// The Lineup as a record's tracklist: number, dance style, drink, price.
// Hovering a track sweeps a dark band up the row and a photo of the drink
// follows the pointer (wide screens with a mouse only).
export function Setlist({ drinks }: { drinks: LineupDrink[] }) {
  const { t, plain } = useCopy();
  const list = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState<LineupDrink | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const followX = useSpring(x, { stiffness: 260, damping: 28, mass: 0.6 });
  const followY = useSpring(y, { stiffness: 260, damping: 28, mass: 0.6 });

  function track(event: React.PointerEvent) {
    const box = list.current?.getBoundingClientRect();
    if (!box) return;
    x.set(event.clientX - box.left);
    y.set(event.clientY - box.top);
  }

  return (
    <section
      aria-labelledby="setlist"
      className="mx-auto w-full max-w-6xl px-4"
    >
      <SectionHeading
        id="setlist"
        index="02"
        title={t.pages.lineup}
        plainTitle={plain.pages.lineup}
        body={t.lineup.intro}
      />

      <div className="relative">
        <ul
          ref={list}
          onPointerMove={track}
          onPointerLeave={() => setActive(null)}
          className="border-t border-foreground"
        >
          {drinks.map((drink, index) => (
            <li key={drink.id} onPointerEnter={() => setActive(drink)}>
              <Link
                href={`/lineup/${drink.slug}`}
                className="group relative grid grid-cols-[2.25rem_minmax(0,1fr)_auto] items-center gap-3 overflow-hidden border-b border-border py-4 outline-none focus-visible:ring-3 focus-visible:ring-ring sm:grid-cols-[3.5rem_minmax(0,1.1fr)_minmax(0,1fr)_auto] sm:gap-6 sm:py-5"
              >
                <span
                  aria-hidden
                  className="absolute inset-0 origin-bottom scale-y-0 bg-foreground transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100"
                />
                <span className="relative eyebrow text-muted-foreground transition-colors group-hover:text-lilac">
                  {pad(index + 1)}
                </span>
                <span className="relative truncate font-heading text-4xl leading-none font-black uppercase [font-stretch:64%] transition-[translate,color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2 group-hover:text-background sm:text-6xl">
                  {drink.danceStyle}
                </span>
                <span className="relative hidden min-w-0 transition-colors group-hover:text-background sm:block">
                  <span className="block truncate font-semibold">
                    {drink.name}
                  </span>
                  <span className="block truncate text-sm text-muted-foreground transition-colors group-hover:text-background/70">
                    {drink.plainDescription}
                  </span>
                </span>
                <span className="relative font-heading text-xl font-black [font-stretch:70%] transition-colors group-hover:text-lilac sm:text-2xl">
                  {formatPeso(drink.basePrice)}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Pointer-following photo of the hovered drink. */}
        <motion.div
          aria-hidden
          style={{ x: followX, y: followY }}
          className="pointer-events-none absolute top-0 left-0 z-10 hidden lg:block"
        >
          <AnimatePresence>
            {active && (
              <motion.div
                key={active.id}
                initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
                animate={{ opacity: 1, scale: 1, rotate: -4 }}
                exit={{ opacity: 0, scale: 0.8, rotate: 4 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="absolute -top-36 left-10 aspect-[4/5] w-56 overflow-hidden bg-muted shadow-[0_30px_60px_-24px_rgb(43_30_23_/_0.7)]"
              >
                <DrinkVisual drink={active} sizes="224px" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <div className="mt-8 flex justify-center">
        <Link
          href={routes.lineup.href}
          className="group inline-flex min-h-12 items-center gap-2 rounded-md bg-foreground px-6 font-semibold text-background outline-none focus-visible:ring-3 focus-visible:ring-ring active:translate-y-px"
        >
          {t.home.seeLineup}
          <ArrowRight
            aria-hidden
            className="size-4 transition-transform group-hover:translate-x-1"
          />
        </Link>
      </div>
    </section>
  );
}
