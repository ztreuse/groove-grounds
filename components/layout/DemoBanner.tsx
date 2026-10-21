"use client";

import { useCopy } from "@/hooks/use-copy";

export function DemoBanner() {
  const { t } = useCopy();

  return (
    <div
      role="note"
      className="bg-espresso-deep px-4 py-1.5 text-center text-xs font-medium text-cream"
    >
      {t.demoBanner}
    </div>
  );
}
