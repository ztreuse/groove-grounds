"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCopy } from "@/hooks/use-copy";
import { routes } from "@/lib/routes";

export default function NotFound() {
  const { t, plain, isPlain } = useCopy();

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-start justify-center px-4 py-16">
      <p className="font-heading text-8xl leading-none text-highlight">404</p>
      <h1 className="mt-4 text-4xl sm:text-5xl">{t.terms.missedACount}</h1>
      {!isPlain && (
        <p className="mt-2 text-muted-foreground">{plain.terms.missedACount}</p>
      )}
      <p className="mt-6 text-lg">{t.errors.notFoundBody}</p>
      <Button asChild size="lg" className="mt-8">
        <Link href={routes.home.href} aria-label={plain.terms.centerStage}>
          {t.terms.centerStage}
        </Link>
      </Button>
    </main>
  );
}
