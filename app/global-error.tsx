"use client";

import { Missed, MissedCount } from "@/components/layout/MissedCount";
import { Button } from "@/components/ui/button";
import { useCopy } from "@/hooks/use-copy";
import "./globals.css";

// Last resort, when the root layout itself fails: it replaces the whole
// document, so there's no header or footer (and system fonts, since the
// site fonts load in the layout).
export default function GlobalError({ reset }: { reset: () => void }) {
  const { t, plain, isPlain } = useCopy();

  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-background text-foreground">
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
            {t.errors.retry}
          </Button>
        </MissedCount>
      </body>
    </html>
  );
}
