"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCopy } from "@/hooks/use-copy";
import { routes } from "@/lib/routes";

export default function NotFound() {
  const { t, plain, isPlain } = useCopy();

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-start justify-center px-4 py-16">
      <p
        aria-hidden
        className="font-heading text-[clamp(8rem,30vw,16rem)] leading-[0.8] font-black text-highlight [font-stretch:62%]"
      >
        4<span className="text-foreground/40 text-outline">0</span>4
      </p>
      <h1 className="mt-6 text-5xl sm:text-7xl">{t.terms.missedACount}</h1>
      {!isPlain && (
        <p className="mt-3 eyebrow text-muted-foreground">
          {plain.terms.missedACount}
        </p>
      )}
      <p className="mt-6 text-lg">{t.errors.notFoundBody}</p>
      <Button asChild size="lg" className="mt-8 rounded-md">
        <Link href={routes.home.href} aria-label={plain.terms.centerStage}>
          {t.terms.centerStage}
        </Link>
      </Button>
    </main>
  );
}
