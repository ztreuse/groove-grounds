"use client";

import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { QuantityStepper } from "@/components/remix/QuantityStepper";
import { useCopy } from "@/hooks/use-copy";
import { fill } from "@/lib/copy";
import { formatPeso } from "@/lib/format";
import { usePlaylist, type PlaylistItem as Item } from "@/stores/playlist";
import { RemixSummary } from "./RemixSummary";

const actionClass =
  "inline-flex min-h-11 items-center gap-1.5 rounded-lg px-2 text-sm font-semibold outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-3 focus-visible:ring-ring";

export function PlaylistItem({ item }: { item: Item }) {
  const { t, plain } = useCopy();
  const setQuantity = usePlaylist((state) => state.setQuantity);
  const removeItem = usePlaylist((state) => state.removeItem);

  return (
    <li className="rounded-2xl border-2 bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-2xl leading-tight">{item.name}</h2>
          <p className="text-sm text-muted-foreground">
            {item.plainDescription}
          </p>
        </div>
        <p className="shrink-0 font-heading text-2xl">
          {formatPeso(item.unitPrice * item.quantity)}
        </p>
      </div>
      <RemixSummary item={item} />
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <QuantityStepper
          value={item.quantity}
          onChange={(quantity) => setQuantity(item.id, quantity)}
          label={item.name}
        />
        <div className="flex items-center">
          <Link
            href={`/lineup/${item.slug}?edit=${item.id}`}
            aria-label={fill(plain.playlist.editItem, { name: item.name })}
            className={actionClass}
          >
            <Pencil aria-hidden className="size-4" />
            {t.playlist.edit}
          </Link>
          <button
            type="button"
            onClick={() => removeItem(item.id)}
            aria-label={fill(plain.playlist.removeItem, { name: item.name })}
            className={`${actionClass} text-destructive`}
          >
            <Trash2 aria-hidden className="size-4" />
            {t.playlist.remove}
          </button>
        </div>
      </div>
    </li>
  );
}
