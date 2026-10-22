"use client";

import { useCopy } from "@/hooks/use-copy";
import type { PageKey } from "@/lib/copy";
import { routes } from "@/lib/routes";
import { PageHero } from "./PageHero";

const scenes: Partial<Record<PageKey, string>> = {
  crew: "/scenes/crew-color.webp",
  reps: "/scenes/bboy.webp",
  about: "/scenes/barista.webp",
  studio: "/scenes/studio-floor.webp",
};

// Temporary stand-in until each page is built. Shows the dance label with the
// plain meaning underneath, per the golden rule for copy.
export function PagePlaceholder({ page }: { page: PageKey }) {
  const { t, plain } = useCopy();
  const { phase, href } = routes[page];

  return (
    <main className="flex-1 pb-16">
      <PageHero
        title={t.pages[page]}
        plainTitle={plain.pages[page]}
        image={scenes[page]}
      />
      <div className="mx-auto w-full max-w-6xl px-4 pt-10">
        <div className="flex flex-col gap-4 surface p-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {phase && (
              <p className="eyebrow text-highlight">
                {t.placeholder.phase} {phase}: {t.phases[phase]}
              </p>
            )}
            <p className="mt-2 text-lg">{t.placeholder.comingSoon}</p>
          </div>
          <p className="font-mono text-sm text-muted-foreground">{href}</p>
        </div>
      </div>
    </main>
  );
}
