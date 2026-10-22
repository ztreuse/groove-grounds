"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, useScroll } from "motion/react";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { DrinkCard } from "@/components/lineup/DrinkCard";
import { useScrollEdges } from "@/hooks/use-scroll-edges";
import { useCopy } from "@/hooks/use-copy";
import type { LineupDrink } from "@/lib/db/queries";
import { routes } from "@/lib/routes";

const arrowClass =
  "flex size-12 items-center justify-center rounded-full ring-1 ring-foreground/30 ring-inset outline-none transition-colors hover:bg-foreground hover:text-background focus-visible:ring-3 focus-visible:ring-ring active:scale-95";

// Left inset that lines the first card up with the page's content column
// while the row itself runs off the right edge of the screen.
const gutter =
  "pl-[max(1rem,calc((100vw-72rem)/2+1rem))] scroll-pl-[max(1rem,calc((100vw-72rem)/2+1rem))]";

export function TrendingCarousel({ drinks }: { drinks: LineupDrink[] }) {
  const { t, plain } = useCopy();
  const track = useRef<HTMLUListElement>(null);
  const edges = useScrollEdges<HTMLUListElement>();
  const { scrollXProgress } = useScroll({ container: track });

  // Scroll by most of a screen; smooth unless the user prefers less motion.
  const scroll = (direction: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    el.scrollBy({
      left: direction * el.clientWidth * 0.7,
      behavior: reduce ? "auto" : "smooth",
    });
  };

  return (
    <section aria-labelledby="trending">
      <div className="mx-auto w-full max-w-6xl px-4">
        <SectionHeading
          id="trending"
          title={t.home.trendingTitle}
          plainTitle={plain.home.trendingTitle}
        />
      </div>
      <ul
        ref={(el) => {
          track.current = el;
          edges(el);
        }}
        className={`flex snap-x snap-mandatory [scrollbar-width:none] gap-5 overflow-x-auto scroll-edges py-2 pr-4 sm:gap-8 [&::-webkit-scrollbar]:hidden ${gutter}`}
      >
        {drinks.map((drink) => (
          <li
            key={drink.id}
            className="w-[72%] shrink-0 snap-start sm:w-[40%] lg:w-[22rem]"
          >
            <DrinkCard drink={drink} />
          </li>
        ))}
      </ul>
      <div className="mx-auto mt-8 flex w-full max-w-6xl items-center gap-4 px-4">
        <div className="relative h-px flex-1 bg-border">
          <motion.span
            aria-hidden
            style={{ scaleX: scrollXProgress }}
            className="absolute inset-0 origin-left bg-foreground"
          />
        </div>
        <Link
          href={routes.lineup.href}
          className="group inline-flex min-h-11 items-center gap-1.5 px-2 text-sm font-semibold outline-none hover:text-highlight focus-visible:ring-3 focus-visible:ring-ring"
        >
          {t.home.seeLineup}
          <ArrowRight
            aria-hidden
            className="size-4 transition-transform group-hover:translate-x-1"
          />
        </Link>
        <button
          type="button"
          onClick={() => scroll(-1)}
          aria-label={plain.home.previous}
          className={arrowClass}
        >
          <ChevronLeft aria-hidden className="size-5" />
        </button>
        <button
          type="button"
          onClick={() => scroll(1)}
          aria-label={plain.home.next}
          className={arrowClass}
        >
          <ChevronRight aria-hidden className="size-5" />
        </button>
      </div>
    </section>
  );
}
