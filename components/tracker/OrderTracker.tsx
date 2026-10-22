"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PartyPopper, Radio } from "lucide-react";
import { getTrackedOrder } from "@/app/(shop)/track/actions";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/layout/PageHero";
import { useCopy } from "@/hooks/use-copy";
import { useLiveUpdates } from "@/hooks/use-live-updates";
import { fill } from "@/lib/copy";
import type { TrackedOrder } from "@/lib/db/orders";
import { formatDay, formatPeso, formatTime } from "@/lib/format";
import { choreographerFor, isOpen, statusCopyKey } from "@/lib/orders";
import { routes } from "@/lib/routes";
import { dayKey } from "@/lib/schedule";
import { StatusSteps } from "./StatusSteps";

export function OrderTracker({ initialOrder }: { initialOrder: TrackedOrder }) {
  const { t, plain, isPlain } = useCopy();
  const [order, setOrder] = useState(initialOrder);
  const open = isOpen(order.status);

  const live = useLiveUpdates(
    `order:${order.id}`,
    "order_changed",
    () => {
      getTrackedOrder(order.id).then((fresh) => fresh && setOrder(fresh));
    },
    { pollMs: 15_000, enabled: open },
  );

  // Flag the browser tab when the order is ready.
  useEffect(() => {
    if (order.status !== "stage_ready") return;
    const previous = document.title;
    document.title = `${plain.status.stageReady} · ${order.code}`;
    return () => {
      document.title = previous;
    };
  }, [order.status, order.code, plain.status.stageReady]);

  const pickup = order.slotStart
    ? fill(t.tracker.classAt, {
        time: `${formatDay(dayKey(new Date(order.slotStart)))}, ${formatTime(order.slotStart)}`,
      })
    : t.tracker.asap;
  const statusKey = statusCopyKey[order.status];

  return (
    <main className="flex-1 pb-16">
      <PageHero
        title={t.pages.track}
        plainTitle={plain.pages.track}
        image="/scenes/hero-garage.webp"
        imagePosition="center 35%"
      >
        {open && (
          <p className="inline-flex items-center gap-2 rounded-md bg-muted px-3 py-1.5 text-sm font-semibold">
            <Radio
              aria-hidden
              className={`size-4 ${live ? "text-highlight motion-safe:animate-pulse" : "text-muted-foreground"}`}
            />
            {live ? t.tracker.live : t.tracker.polling}
          </p>
        )}
      </PageHero>
      <div className="mx-auto grid w-full max-w-6xl gap-x-12 px-4 pt-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-start">
        {/* Left: code and live status. Right: pickup details and items. */}
        <div>
          <div className="mt-6 rounded-3xl bg-espresso p-5 text-cream dark:bg-espresso-deep">
            <p className="text-sm font-medium text-khaki">
              {t.tracker.orderCode}
            </p>
            <p className="font-heading text-6xl leading-none font-black tracking-wide [font-stretch:70%]">
              {order.code}
            </p>
            {order.guestName && (
              <p className="mt-2">
                {fill(t.tracker.greeting, { name: order.guestName })}
              </p>
            )}
          </div>

          <p aria-live="polite" className="sr-only">
            {plain.status[statusKey]}
          </p>

          {order.status === "stage_ready" && (
            <div
              role="alert"
              className="mt-6 flex items-center gap-3 rounded-2xl bg-accent p-4 font-semibold text-accent-foreground"
            >
              <PartyPopper aria-hidden className="size-6 shrink-0" />
              {t.tracker.stageReadyAlert}
            </div>
          )}
          {order.status === "bow" && (
            <p className="mt-6 rounded-2xl bg-muted p-4 font-semibold">
              {t.tracker.bowMessage}
            </p>
          )}
          {order.status === "cut" && (
            <p
              role="alert"
              className="mt-6 rounded-2xl bg-destructive/10 p-4 font-semibold text-destructive"
            >
              <span className="block font-heading text-2xl uppercase">
                {t.status.cut}
              </span>
              {t.tracker.cutMessage}
            </p>
          )}

          <section className="mt-8">
            <StatusSteps status={order.status} />
          </section>
        </div>

        <div>
          <dl className="mt-6 grid gap-3 surface p-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-muted-foreground">
                {t.tracker.pickup}
              </dt>
              <dd className="font-semibold">{pickup}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">
                {t.tracker.choreographer}
              </dt>
              <dd className="font-semibold">{choreographerFor(order.id)}</dd>
            </div>
          </dl>

          <section className="mt-6 surface p-4">
            <h2 className="text-3xl leading-none">{t.tracker.items}</h2>
            <ul className="mt-3 divide-y">
              {order.items.map((item, index) => (
                <li key={index} className="py-3">
                  <div className="flex justify-between gap-3">
                    <p className="font-semibold">
                      {item.name}{" "}
                      <span className="text-muted-foreground">
                        ×{item.quantity}
                      </span>
                    </p>
                    <p className="font-semibold">
                      {formatPeso(item.lineTotal)}
                    </p>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.options.choices
                      .flatMap((choice) =>
                        choice.options.map((option) =>
                          isPlain ? option.plainLabel : option.danceLabel,
                        ),
                      )
                      .join(" · ")}
                  </p>
                  {item.options.notes && (
                    <p className="mt-1 text-sm">
                      <span className="font-semibold">{t.remix.notes}:</span>{" "}
                      {item.options.notes}
                    </p>
                  )}
                </li>
              ))}
            </ul>
            <div className="flex items-baseline justify-between border-t-2 pt-3">
              <span className="text-sm">
                {order.paymentStatus === "paid"
                  ? t.tracker.paid
                  : t.tracker.payAtPickup}
              </span>
              <span className="font-heading text-3xl">
                {t.tracker.total} {formatPeso(order.total)}
              </span>
            </div>
          </section>

          {open && (
            <section className="mt-6 rounded-3xl bg-muted/60 p-5">
              <h2 className="text-3xl leading-none">{t.tracker.demoTitle}</h2>
              <p className="mt-2 text-muted-foreground">{t.tracker.demoBody}</p>
              <Button asChild size="lg" variant="outline" className="mt-4">
                <Link
                  href={routes.backstageQueue.href}
                  aria-label={plain.tracker.demoCta}
                >
                  {t.tracker.demoCta}
                </Link>
              </Button>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
