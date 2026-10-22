"use client";

import { useId } from "react";
import { MugIcon } from "@/components/icons/GrooveIcons";
import { motion, useScroll, useTransform } from "motion/react";

type SpinBadgeProps = {
  // Words set around the ring, separated by dots.
  words: string[];
  className?: string;
};

// Round sticker with text set on a circle. It turns as the page scrolls
// (scroll-linked, so it never spins on its own). Decorative.
export function SpinBadge({ words, className }: SpinBadgeProps) {
  const id = useId();
  const { scrollY } = useScroll();
  const rotate = useTransform(scrollY, [0, 1200], [0, 240]);
  const ring = `${[...words, ...words].join(" • ")} • `;

  return (
    <motion.div
      aria-hidden
      style={{ rotate }}
      className={`relative flex size-32 items-center justify-center rounded-full bg-lilac text-espresso shadow-[0_20px_40px_-20px_rgb(43_30_23_/_0.6)] sm:size-36 ${className ?? ""}`}
    >
      <svg viewBox="0 0 100 100" className="absolute inset-0 size-full">
        <defs>
          <path
            id={id}
            d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
          />
        </defs>
        <text className="fill-current font-mono text-[8.6px] font-semibold tracking-[0.14em] uppercase">
          <textPath href={`#${id}`} textLength="230">
            {ring}
          </textPath>
        </text>
      </svg>
      <span className="flex size-12 items-center justify-center rounded-full bg-espresso text-lilac">
        <MugIcon className="size-6" />
      </span>
    </motion.div>
  );
}
