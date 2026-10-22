"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { removeChoreo } from "@/app/(shop)/profile/actions";
import { useCopy } from "@/hooks/use-copy";
import type { SavedChoreoEntry } from "@/lib/db/choreo";
import { formatPeso } from "@/lib/format";
import { routes } from "@/lib/routes";
import { RunItBackButton } from "./RunItBackButton";

function RemoveButton({ id }: { id: string }) {
  const { t, plain } = useCopy();
  const router = useRouter();
  const [confirm, setConfirm] = useState(false);

  // The confirm prompt resets after a few seconds.
  useEffect(() => {
    if (!confirm) return;
    const timer = setTimeout(() => setConfirm(false), 4000);
    return () => clearTimeout(timer);
  }, [confirm]);

  return (
    <button
      type="button"
      onClick={async () => {
        if (!confirm) return setConfirm(true);
        await removeChoreo(id);
        router.refresh();
      }}
      aria-label={confirm ? plain.profile.confirmRemove : plain.profile.remove}
      className="inline-flex min-h-11 items-center rounded-md px-2 text-sm font-semibold text-destructive outline-none hover:bg-destructive/10 focus-visible:ring-3 focus-visible:ring-ring"
    >
      {confirm ? t.profile.confirmRemove : t.profile.remove}
    </button>
  );
}

export function SavedChoreo({
  choreo,
  readOnly = false,
}: {
  choreo: SavedChoreoEntry[];
  // Demo dancer: Run it back only, no removing.
  readOnly?: boolean;
}) {
  const { t, plain, isPlain } = useCopy();

  return (
    <section aria-labelledby="saved-choreo" className="mt-6">
      <h2 id="saved-choreo" className="text-3xl leading-none">
        {t.profile.savedChoreo}
      </h2>
      {!isPlain && (
        <p className="mt-1 text-sm text-muted-foreground">
          {plain.profile.savedChoreo}
        </p>
      )}
      {choreo.length === 0 ? (
        <div className="mt-4 rounded-md bg-muted/60 p-6 text-center">
          <p className="text-muted-foreground">{t.profile.noChoreo}</p>
          <Link
            href={routes.freestyle.href}
            className="mt-2 inline-flex min-h-11 items-center font-semibold text-highlight underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring"
          >
            {t.profile.buildChoreo}
          </Link>
        </div>
      ) : (
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {choreo.map((entry) => (
            <li key={entry.id} className="flex flex-col surface p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate label-display text-2xl leading-tight">
                    {entry.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t.terms.freestyle} · {entry.baseName}
                  </p>
                </div>
                {entry.unitPrice !== null ? (
                  <span className="shrink-0 font-heading text-2xl font-black [font-stretch:70%]">
                    {formatPeso(entry.unitPrice)}
                  </span>
                ) : (
                  <span className="shrink-0 rounded-md bg-muted px-2 py-0.5 text-xs font-bold">
                    <span aria-hidden>{t.terms.sittingOut}</span>
                    <span className="sr-only">{plain.terms.sittingOut}</span>
                  </span>
                )}
              </div>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">
                {entry.choices
                  .flatMap((choice) =>
                    choice.options.map((option) =>
                      isPlain ? option.plainLabel : option.danceLabel,
                    ),
                  )
                  .join(" · ")}
              </p>
              <div className="mt-3 flex flex-wrap items-start justify-between gap-2">
                {entry.available && (
                  <RunItBackButton kind="choreo" id={entry.id} />
                )}
                {!readOnly && <RemoveButton id={entry.id} />}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
