"use client";

import { useCopy } from "@/hooks/use-copy";
import type { PlaylistItem } from "@/stores/playlist";

// One line of Remix choices ("16-count · Cool-down · Oat milk") plus notes.
export function RemixSummary({ item }: { item: PlaylistItem }) {
  const { t, isPlain } = useCopy();
  const labels = item.choices.flatMap((choice) =>
    choice.options.map((option) =>
      isPlain ? option.plainLabel : option.danceLabel,
    ),
  );

  if (labels.length === 0 && !item.notes) return null;

  return (
    <div className="mt-1 space-y-1 text-sm text-muted-foreground">
      {labels.length > 0 && <p>{labels.join(" · ")}</p>}
      {item.notes && (
        <p>
          <span className="font-semibold text-foreground">
            {t.remix.notes}:
          </span>{" "}
          {item.notes}
        </p>
      )}
    </div>
  );
}
