"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCopy } from "@/hooks/use-copy";
import { fill } from "@/lib/copy";
import type { TrackedOrder } from "@/lib/db/orders";
import { formatTime } from "@/lib/format";
import { nextStatus, statusCopyKey } from "@/lib/orders";

type QueueCardProps = {
  order: TrackedOrder;
  upcoming: boolean;
  busy: boolean;
  onMove: () => void;
  onCut: () => void;
};

export function QueueCard({
  order,
  upcoming,
  busy,
  onMove,
  onCut,
}: QueueCardProps) {
  const { t, plain } = useCopy();
  const [confirmCut, setConfirmCut] = useState(false);
  const next = nextStatus(order.status);

  // A second tap confirms the cut; the prompt resets after a few seconds.
  useEffect(() => {
    if (!confirmCut) return;
    const timer = setTimeout(() => setConfirmCut(false), 4000);
    return () => clearTimeout(timer);
  }, [confirmCut]);

  return (
    <li className={`surface rounded-md p-3 ${upcoming ? "border-dashed" : ""}`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="label-display text-2xl leading-none">{order.code}</p>
          {order.guestName && (
            <p className="mt-1 text-sm font-semibold">{order.guestName}</p>
          )}
        </div>
        <span className="shrink-0 rounded-md bg-accent px-2 py-0.5 text-xs font-bold text-accent-foreground">
          {order.slotStart
            ? fill(t.queue.classAt, { time: formatTime(order.slotStart) })
            : t.terms.dropIn}
        </span>
      </div>
      {upcoming && (
        <p className="mt-1 text-xs font-semibold text-muted-foreground">
          {t.queue.upcoming}
        </p>
      )}

      <ul className="mt-2 space-y-0.5 text-sm">
        {order.items.map((item, index) => (
          <li key={index}>
            <span className="font-semibold">{item.quantity}×</span> {item.name}
          </li>
        ))}
      </ul>

      <div className="mt-3 space-y-1">
        {next && (
          <Button
            type="button"
            onClick={onMove}
            disabled={busy}
            aria-label={fill(plain.queue.moveTo, {
              status: plain.status[statusCopyKey[next]],
            })}
            className="w-full justify-between gap-2 [&>span]:truncate"
          >
            <span>
              {fill(t.queue.moveTo, { status: t.status[statusCopyKey[next]] })}
            </span>
            <ArrowRight aria-hidden />
          </Button>
        )}
        <div className="flex flex-wrap items-center justify-between gap-x-2">
          <Link
            href={`/track/${order.id}`}
            target="_blank"
            className="inline-flex min-h-11 items-center gap-1 rounded-md px-1 text-xs font-semibold whitespace-nowrap text-highlight outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring"
          >
            {t.queue.viewTracker}
            <ExternalLink aria-hidden className="size-3.5" />
          </Link>
          {next && (
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                if (confirmCut) onCut();
                else setConfirmCut(true);
              }}
              aria-label={confirmCut ? plain.queue.confirmCut : plain.queue.cut}
              className="inline-flex min-h-11 items-center rounded-md px-1 text-xs font-semibold whitespace-nowrap text-destructive outline-none hover:bg-destructive/10 focus-visible:ring-3 focus-visible:ring-ring"
            >
              {confirmCut ? t.queue.confirmCut : t.queue.cut}
            </button>
          )}
        </div>
      </div>
    </li>
  );
}
