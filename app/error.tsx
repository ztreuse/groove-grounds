"use client";

import Link from "next/link";
import { RotateCcw } from "lucide-react";
import { Missed, MissedCount } from "@/components/layout/MissedCount";
import { Button } from "@/components/ui/button";
import { useCopy } from "@/hooks/use-copy";
import { fill } from "@/lib/copy";
import { routes } from "@/lib/routes";

// Something broke while a page loaded: 5, 6, 7… and the 8 is missing.
// Renders inside the root layout, so the header and footer stay.
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t, plain, isPlain } = useCopy();

  return (
    <MissedCount
      display={
        <>
          567<Missed>8</Missed>
        </>
      }
      title={isPlain ? t.errors.errorTitle : t.terms.missedACount}
      plainTitle={plain.errors.errorTitle}
      body={t.errors.errorBody}
    >
      <Button size="lg" onClick={reset} aria-label={plain.errors.retry}>
        <RotateCcw aria-hidden />
        {t.errors.retry}
      </Button>
      <Button asChild size="lg" variant="outline">
        <Link href={routes.home.href} aria-label={plain.terms.centerStage}>
          {t.terms.centerStage}
        </Link>
      </Button>
      {error.digest && (
        <p className="basis-full font-mono text-xs text-muted-foreground">
          {fill(t.errors.reference, { digest: error.digest })}
        </p>
      )}
    </MissedCount>
  );
}
