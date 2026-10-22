"use client";

import { RemixSummary } from "@/components/playlist/RemixSummary";
import { useCopy } from "@/hooks/use-copy";
import { formatPeso } from "@/lib/format";
import type { PlaylistItem } from "@/stores/playlist";

type OrderSummaryProps = {
  items: PlaylistItem[];
  pickupLabel: string;
  total: number;
};

export function OrderSummary({ items, pickupLabel, total }: OrderSummaryProps) {
  const { t } = useCopy();

  return (
    <section aria-labelledby="order-summary" className="surface p-4">
      <h2 id="order-summary" className="text-3xl leading-none">
        {t.showtime.summary}
      </h2>
      <ul className="mt-3 divide-y">
        {items.map((item) => (
          <li key={item.id} className="py-3">
            <div className="flex items-start justify-between gap-3">
              <p className="font-semibold">
                {item.name}{" "}
                <span className="text-muted-foreground">×{item.quantity}</span>
              </p>
              <p className="shrink-0 font-semibold">
                {formatPeso(item.unitPrice * item.quantity)}
              </p>
            </div>
            <RemixSummary item={item} />
          </li>
        ))}
      </ul>
      <div className="flex justify-between border-t-2 pt-3 text-sm">
        <span className="font-semibold">{t.showtime.pickup}</span>
        <span>{pickupLabel}</span>
      </div>
      <div className="mt-2 flex items-baseline justify-between">
        <span className="font-semibold">{t.showtime.total}</span>
        <span className="font-heading text-4xl font-black [font-stretch:70%]">
          {formatPeso(total)}
        </span>
      </div>
    </section>
  );
}
