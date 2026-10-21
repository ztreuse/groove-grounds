"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import type { DrinkDetail } from "@/lib/db/queries";
import { RemixPanel } from "./RemixPanel";

function RemixPanelFromQuery({ drink }: { drink: DrinkDetail }) {
  const editItemId = useSearchParams().get("edit");
  return <RemixPanel drink={drink} editItemId={editItemId} />;
}

// The drink page is prerendered, so ?edit= is read on the client. The
// fallback is the normal panel, which keeps the static page complete.
export function EditableRemixPanel({ drink }: { drink: DrinkDetail }) {
  return (
    <Suspense fallback={<RemixPanel drink={drink} />}>
      <RemixPanelFromQuery drink={drink} />
    </Suspense>
  );
}
