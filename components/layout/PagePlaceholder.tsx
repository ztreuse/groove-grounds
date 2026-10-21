"use client";

import { useCopy } from "@/hooks/use-copy";
import type { PageKey } from "@/lib/copy";
import { routes } from "@/lib/routes";

// Temporary stand-in until each page is built. Shows the dance label with the
// plain meaning underneath, per the golden rule for copy.
export function PagePlaceholder({ page }: { page: PageKey }) {
  const { t, plain, isPlain } = useCopy();
  const { phase, href } = routes[page];

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-12 sm:py-20">
      <div className="relative rounded-2xl border-2 border-dashed bg-card p-6 sm:p-10">
        <span
          aria-hidden
          className="absolute -top-3 left-8 h-6 w-20 -rotate-3 bg-khaki/70"
        />
        {phase && (
          <p className="mb-6 inline-block -rotate-2 rounded-md bg-accent px-3 py-1 text-xs font-semibold tracking-wider text-accent-foreground uppercase">
            {t.placeholder.phase} {phase} — {t.phases[phase]}
          </p>
        )}
        <h1 className="text-5xl leading-none sm:text-7xl">{t.pages[page]}</h1>
        {!isPlain && (
          <p className="mt-3 text-lg text-muted-foreground">
            {plain.pages[page]}
          </p>
        )}
        <p className="mt-8 text-base">{t.placeholder.comingSoon}</p>
        <p className="mt-2 font-mono text-sm text-muted-foreground">{href}</p>
      </div>
    </main>
  );
}
