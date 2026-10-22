"use client";

import { Asterisk } from "lucide-react";

type TickerProps = {
  items: string[];
  className?: string;
};

// Endless band of words that drifts sideways; pauses on hover. Decorative,
// so it's hidden from screen readers. Reduced motion stops it.
export function Ticker({ items, className }: TickerProps) {
  const row = items.map((item, index) => (
    <li key={index} className="flex shrink-0 items-center gap-6 pr-6">
      <span className={index % 2 ? "italic [font-stretch:80%]" : undefined}>
        {item}
      </span>
      <Asterisk className="size-[0.6em] shrink-0 text-highlight" />
    </li>
  ));

  return (
    <div aria-hidden className={`overflow-hidden ${className ?? ""}`}>
      <div className="flex w-max animate-ticker hover:[animation-play-state:paused] motion-reduce:animate-none">
        <ul className="flex shrink-0">{row}</ul>
        <ul className="flex shrink-0">{row}</ul>
      </div>
    </div>
  );
}
