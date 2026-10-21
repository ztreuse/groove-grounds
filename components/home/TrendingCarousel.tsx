"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DrinkCard } from "@/components/lineup/DrinkCard";
import { useCopy } from "@/hooks/use-copy";
import type { LineupDrink } from "@/lib/db/queries";
import { routes } from "@/lib/routes";

const arrowClass =
  "hidden size-11 items-center justify-center rounded-full border-2 bg-card outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-3 focus-visible:ring-ring sm:flex";

export function TrendingCarousel({ drinks }: { drinks: LineupDrink[] }) {
  const { t, plain, isPlain } = useCopy();
  const track = useRef<HTMLUListElement>(null);

  // Scroll by most of a screen; smooth unless the user prefers less motion.
  const scroll = (direction: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    el.scrollBy({
      left: direction * el.clientWidth * 0.8,
      behavior: reduce ? "auto" : "smooth",
    });
  };

  return (
    <section
      aria-labelledby="trending"
      className="mx-auto w-full max-w-6xl px-4"
    >
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="trending" className="text-4xl leading-none">
            {t.home.trendingTitle}
          </h2>
          {!isPlain && (
            <p className="mt-1 text-sm text-muted-foreground">
              {plain.home.trendingTitle}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={routes.lineup.href}
            className="inline-flex min-h-11 items-center rounded-lg px-2 text-sm font-semibold text-highlight outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring"
          >
            {t.home.seeLineup}
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
      </div>
      <ul
        ref={track}
        className="relative -mx-4 flex snap-x snap-mandatory [scrollbar-width:none] gap-4 overflow-x-auto px-4 pt-1 pb-4 [&::-webkit-scrollbar]:hidden"
      >
        {drinks.map((drink) => (
          <li
            key={drink.id}
            className="w-[80%] shrink-0 snap-start sm:w-[45%] lg:w-[31%]"
          >
            <DrinkCard drink={drink} />
          </li>
        ))}
      </ul>
    </section>
  );
}
