"use client";

import { useCopy } from "@/hooks/use-copy";

export function ShowtimeIntro() {
  const { t, plain, isPlain } = useCopy();

  return (
    <header>
      <h1 className="text-5xl leading-none sm:text-7xl">{t.pages.showtime}</h1>
      {!isPlain && (
        <p className="mt-1 text-lg text-muted-foreground">
          {plain.pages.showtime}
        </p>
      )}
      <p className="mt-3 max-w-prose">{t.showtime.intro}</p>
    </header>
  );
}
