"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Radio, RefreshCw } from "lucide-react";
import {
  cutMyOrder,
  getMyQueue,
  moveOrder,
} from "@/app/backstage/queue/actions";
import { CountIn } from "@/components/layout/CountIn";
import { Button } from "@/components/ui/button";
import { useCopy } from "@/hooks/use-copy";
import { useLiveUpdates } from "@/hooks/use-live-updates";
import type { TrackedOrder } from "@/lib/db/orders";
import {
  ORDER_FLOW,
  SURFACE_MINUTES,
  nextStatus,
  statusCopyKey,
} from "@/lib/orders";
import { routes } from "@/lib/routes";
import { QueueCard } from "./QueueCard";

// Short two-note chime for new orders. Browsers may block audio until the
// page has been tapped once; that's fine to ignore.
function chime() {
  try {
    const audio = new AudioContext();
    [660, 880].forEach((frequency, index) => {
      const osc = audio.createOscillator();
      const gain = audio.createGain();
      osc.frequency.value = frequency;
      gain.gain.setValueAtTime(0.15, audio.currentTime + index * 0.15);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        audio.currentTime + index * 0.15 + 0.3,
      );
      osc.connect(gain).connect(audio.destination);
      osc.start(audio.currentTime + index * 0.15);
      osc.stop(audio.currentTime + index * 0.15 + 0.3);
    });
  } catch {}
}

type QueueState = { orders: TrackedOrder[]; loadedAt: number };

export function QueueBoard() {
  const { t, plain, isPlain } = useCopy();
  const [queue, setQueue] = useState<QueueState | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const seenIds = useRef<Set<string> | null>(null);

  const load = () =>
    getMyQueue().then((orders) => {
      const seen = seenIds.current;
      if (seen && orders.some((order) => !seen.has(order.id))) chime();
      seenIds.current = new Set(orders.map((order) => order.id));
      setQueue({ orders, loadedAt: Date.now() });
    });

  useEffect(() => {
    load();
    // Load once on mount; later loads come from live updates.
  }, []);

  const live = useLiveUpdates("backstage:queue", "queue_changed", load, {
    pollMs: 20_000,
  });

  async function act(order: TrackedOrder, action: "move" | "cut") {
    setBusyId(order.id);
    const next = nextStatus(order.status);
    if (action === "move" && next) {
      // Optimistic: show the move right away, then sync with the server.
      setQueue(
        (current) =>
          current && {
            ...current,
            orders: current.orders.map((o) =>
              o.id === order.id ? { ...o, status: next } : o,
            ),
          },
      );
      await moveOrder(order.id, order.status);
    } else {
      await cutMyOrder(order.id);
    }
    await load();
    setBusyId(null);
  }

  if (!queue) return <CountIn />;

  const surfaceAt = (order: TrackedOrder) =>
    order.slotStart
      ? Date.parse(order.slotStart) - SURFACE_MINUTES * 60_000
      : 0;

  return (
    <>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <p className="flex items-center gap-2 rounded-full border-2 px-3 py-1 text-sm font-semibold">
          <Radio
            aria-hidden
            className={`size-4 ${live ? "text-highlight motion-safe:animate-pulse" : "text-muted-foreground"}`}
          />
          {live ? t.tracker.live : t.tracker.polling}
        </p>
        <Button
          type="button"
          variant="ghost"
          onClick={() => load()}
          aria-label={plain.queue.refresh}
        >
          <RefreshCw aria-hidden />
          {t.queue.refresh}
        </Button>
      </div>

      {queue.orders.length === 0 ? (
        <div className="mt-8 rounded-3xl border-2 border-dashed px-6 py-12 text-center">
          <p className="text-lg">{t.queue.empty}</p>
          <Button asChild size="lg" className="mt-6">
            <Link href={routes.lineup.href} aria-label={plain.queue.emptyCta}>
              {t.queue.emptyCta}
            </Link>
          </Button>
        </div>
      ) : (
        <div className="-mx-4 mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-4 lg:mx-0 lg:grid lg:grid-cols-5 lg:overflow-visible lg:px-0">
          {ORDER_FLOW.map((status) => {
            const key = statusCopyKey[status];
            const column = queue.orders.filter(
              (order) => order.status === status,
            );
            return (
              <section
                key={status}
                aria-labelledby={`column-${status}`}
                className="w-[85%] shrink-0 snap-start rounded-2xl bg-muted p-3 sm:w-72 lg:w-auto"
              >
                <div className="mb-3 flex items-baseline justify-between gap-2">
                  <div>
                    <h2
                      id={`column-${status}`}
                      className="text-2xl leading-none"
                    >
                      {t.status[key]}
                    </h2>
                    {!isPlain && (
                      <p className="text-xs text-muted-foreground">
                        {plain.status[key]}
                      </p>
                    )}
                  </div>
                  <span className="font-heading text-2xl text-highlight">
                    {column.length}
                  </span>
                </div>
                {column.length === 0 ? (
                  <p className="rounded-xl border-2 border-dashed p-3 text-center text-sm text-muted-foreground">
                    {t.queue.columnEmpty}
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {column.map((order) => (
                      <QueueCard
                        key={order.id}
                        order={order}
                        upcoming={
                          status === "warm_up" &&
                          surfaceAt(order) > queue.loadedAt
                        }
                        busy={busyId === order.id}
                        onMove={() => act(order, "move")}
                        onCut={() => act(order, "cut")}
                      />
                    ))}
                  </ul>
                )}
              </section>
            );
          })}
        </div>
      )}
    </>
  );
}
