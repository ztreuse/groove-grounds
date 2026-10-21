"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import type { FreestyleBase } from "@/lib/db/queries";
import { FreestyleBuilder } from "./FreestyleBuilder";

function BuilderFromQuery({ bases }: { bases: FreestyleBase[] }) {
  const editItemId = useSearchParams().get("edit");
  return <FreestyleBuilder bases={bases} editItemId={editItemId} />;
}

// The page is prerendered, so ?edit= is read on the client.
export function EditableFreestyleBuilder({
  bases,
}: {
  bases: FreestyleBase[];
}) {
  return (
    <Suspense fallback={<FreestyleBuilder bases={bases} />}>
      <BuilderFromQuery bases={bases} />
    </Suspense>
  );
}
