"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCopy } from "@/hooks/use-copy";
import { routes } from "@/lib/routes";

// Points portfolio visitors at the full order → Backstage → tracker loop.
export function BackstagePromo() {
  const { t, plain } = useCopy();

  return (
    <section className="mx-auto w-full max-w-6xl px-4">
      <div className="rounded-3xl border-2 border-dashed p-6 sm:p-8">
        <h2 className="text-4xl leading-none">{t.home.backstageTitle}</h2>
        <p className="mt-3 max-w-prose text-muted-foreground">
          {t.home.backstageBody}
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href={routes.lineup.href} aria-label={plain.home.seeLineup}>
              {t.home.seeLineup}
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link
              href={routes.backstageQueue.href}
              aria-label={plain.tracker.demoCta}
            >
              {t.tracker.demoCta}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
