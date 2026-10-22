"use client";

import { useCopy } from "@/hooks/use-copy";
import { fill, type PageKey } from "@/lib/copy";
import { CYPHER_ON_HOME } from "@/lib/cypher";

type BackstageHeaderProps = {
  page: PageKey;
  // Optional intro line for the page.
  intro?: "menu" | "schedule" | "crew" | "dashboard" | "cypher";
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
          {intro === "menu"
            ? t.menu.intro
            : intro === "schedule"
              ? t.scheduleAdmin.intro
              : intro === "crew"
                ? t.crewAdmin.intro
                : intro === "dashboard"
                  ? t.dashboard.intro
                  : fill(t.cypherAdmin.intro, { count: CYPHER_ON_HOME })}
        </p>
      )}
    </header>
  );
}
