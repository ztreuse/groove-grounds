"use client";

import Link from "next/link";
import { Missed, MissedCount } from "@/components/layout/MissedCount";
import { Button } from "@/components/ui/button";
import { useCopy } from "@/hooks/use-copy";
import { routes } from "@/lib/routes";

export default function NotFound() {
  const { t, plain } = useCopy();

  return (
    <MissedCount
      display={
        <>
          4<Missed>0</Missed>4
        </>
      }
      title={t.terms.missedACount}
      plainTitle={plain.terms.missedACount}
      body={t.errors.notFoundBody}
    >
      <Button asChild size="lg">
        <Link href={routes.home.href} aria-label={plain.terms.centerStage}>
          {t.terms.centerStage}
        </Link>
      </Button>
    </MissedCount>
  );
}
