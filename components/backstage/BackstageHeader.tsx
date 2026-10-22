"use client";

import { useCopy } from "@/hooks/use-copy";
import type { PageKey } from "@/lib/copy";

type BackstageHeaderProps = {
  page: PageKey;
  // Optional intro line for the page.
  intro?: "menu" | "schedule";
};

// Title block for Backstage pages: section label, poster-caps title.
export function BackstageHeader({ page, intro }: BackstageHeaderProps) {
  const { t, plain, isPlain } = useCopy();

  return (
    <header>
      <p className="eyebrow text-highlight">
        {t.terms.backstage}
        {!isPlain && ` · ${plain.terms.backstage}`}
      </p>
      <h1 className="mt-3 text-6xl sm:text-8xl">{t.pages[page]}</h1>
      {!isPlain && plain.pages[page] !== t.pages[page] && (
        <p className="mt-2 text-sm font-medium text-muted-foreground">
          {plain.pages[page]}
        </p>
      )}
      {intro && (
        <p className="mt-4 max-w-prose text-muted-foreground">
          {intro === "menu" ? t.menu.intro : t.scheduleAdmin.intro}
        </p>
      )}
    </header>
  );
}
