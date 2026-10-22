"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";

type KineticTitleProps = {
  text: string;
  as?: "h1" | "h2" | "p";
  id?: string;
  className?: string;
  // Italic accent on the last word ("Coffee with a *beat.*").
  accentLast?: boolean;
  // "mount" plays on load (page titles); "view" when scrolled into view.
  trigger?: "mount" | "view";
  delay?: number;
};

const ease = [0.16, 1, 0.3, 1] as const;

const char: Variants = {
  hidden: { y: "110%", rotate: 6 },
  // custom = when this letter starts, in seconds.
  shown: (start: number) => ({
    y: 0,
    rotate: 0,
    transition: { duration: 0.9, delay: start, ease },
  }),
};

// Display title whose letters rise into place one after another, each word
// masked so it slides up from behind its own baseline. On hover a letter
// stretches wider on the font's width axis and settles back, like a beat.
// Screen readers get the plain string once.
export function KineticTitle({
  text,
  as = "h1",
  id,
  className,
  accentLast = false,
  trigger = "mount",
  delay = 0,
}: KineticTitleProps) {
  const reduce = useReducedMotion();
  const Tag = as;
  const words = text.split(" ");
  let index = 0;

  const play =
    trigger === "mount"
      ? { animate: "shown" }
      : { whileInView: "shown", viewport: { once: true, amount: 0.6 } };

  return (
    <Tag id={id} className={className}>
      <span className="sr-only">{text}</span>
      <motion.span aria-hidden initial={reduce ? false : "hidden"} {...play}>
        {words.map((word, w) => {
          const accent = accentLast && w === words.length - 1;
          const Word = accent ? "em" : "span";
          return (
            <span key={w}>
              <Word className="-mx-[0.06em] -mt-[0.16em] -mb-[0.04em] inline-block overflow-hidden px-[0.06em] pt-[0.18em] pb-[0.08em] align-bottom">
                {[...word].map((letter, c) => (
                  <motion.span
                    key={c}
                    variants={char}
                    custom={delay + index++ * 0.025}
                    className="kinetic-char inline-block"
                  >
                    {letter}
                  </motion.span>
                ))}
              </Word>
              {w < words.length - 1 && " "}
            </span>
          );
        })}
      </motion.span>
    </Tag>
  );
}
