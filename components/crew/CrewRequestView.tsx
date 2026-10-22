"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { respondToQuote } from "@/app/(shop)/crew/actions";
import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";
import { useCopy } from "@/hooks/use-copy";
import { fill } from "@/lib/copy";
import type { CrewRequest } from "@/lib/db/crew";
import { formatDay, formatPeso, formatTime } from "@/lib/format";
import { routes } from "@/lib/routes";
import { dayKey } from "@/lib/schedule";

const STEPS = ["new", "quoted", "accepted"] as const;

// A Crew Order request as the customer sees it: status steps, the quote
// with Accept / Decline once it's ready, and the request details.
export function CrewRequestView({ request }: { request: CrewRequest }) {
  const { t, plain } = useCopy();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const declined = request.status === "declined";
  const reached = declined
    ? 0
    : STEPS.indexOf(request.status as (typeof STEPS)[number]);

  async function respond(accept: boolean) {
    setBusy(true);
    await respondToQuote(request.id, accept);
    router.refresh();
    setBusy(false);
  }

  return (
    <main className="flex-1 pb-16">
      <PageHero
        title={t.crew.requestTitle}
        plainTitle={plain.crew.requestTitle}
        body={fill(t.crew.requestCode, { name: request.name })}
        image="/scenes/crew-color.webp"
      />
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 pt-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <div>
          {/* Status steps. */}
          <ol className="grid grid-cols-3 gap-2">
            {STEPS.map((step, index) => {
              const done = !declined && index <= reached;
              return (
                <li key={step}>
                  <span
                    className={`block h-2 rounded-full ${done ? "bg-primary" : "bg-muted"}`}
                  />
                  <span
                    className={`mt-2 flex items-center gap-1 text-sm font-semibold ${done ? "" : "text-muted-foreground"}`}
                  >
                    {done && <Check aria-hidden className="size-4" />}
                    {t.crew.statuses[step]}
                  </span>
                </li>
              );
            })}
          </ol>

          <div
            role="status"
            className={`mt-8 p-6 ${
              declined
                ? "bg-muted"
                : request.status === "accepted"
                  ? "bg-accent text-accent-foreground"
                  : "surface"
            }`}
          >
            <h2 className="text-3xl leading-none">
              {t.crew.statuses[request.status]}
            </h2>
            <p className="mt-2">{t.crew.statusBody[request.status]}</p>

            {request.quoteAmount !== null && !declined && (
              <div className="mt-6 border-t border-border pt-5">
                <p className="text-sm font-medium text-muted-foreground">
                  {t.crew.quote}
                </p>
                <p className="font-heading text-5xl leading-none font-black [font-stretch:70%]">
                  {formatPeso(request.quoteAmount)}
                </p>
                {request.quoteNote && (
                  <p className="mt-3 max-w-prose whitespace-pre-line">
                    {request.quoteNote}
                  </p>
                )}
                {request.status === "quoted" && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    <Button
                      size="lg"
                      disabled={busy}
                      onClick={() => respond(true)}
                      aria-label={plain.crew.accept}
                    >
                      {t.crew.accept}
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      disabled={busy}
                      onClick={() => respond(false)}
                      aria-label={plain.crew.decline}
                    >
                      {t.crew.decline}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            {t.crew.keepLink}
          </p>
        </div>

        <aside className="h-fit surface p-6 lg:sticky lg:top-24">
          <h2 className="border-b border-border pb-2 text-2xl leading-none">
            {t.crew.summary}
          </h2>
          <dl className="mt-4 space-y-4 text-sm">
            <div>
              <dt className="text-muted-foreground">{t.crew.pickup}</dt>
              <dd className="font-semibold">
                {formatDay(dayKey(new Date(request.eventDate)))},{" "}
                {formatTime(request.eventDate)}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">{t.crew.headcount}</dt>
              <dd className="font-semibold">
                {fill(t.crew.people, { count: request.headcount })}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">{t.crew.drinkMix}</dt>
              <dd className="whitespace-pre-line">{request.drinkMix}</dd>
            </div>
            {request.budget !== null && (
              <div>
                <dt className="text-muted-foreground">{t.crew.budgetShort}</dt>
                <dd className="font-semibold">{formatPeso(request.budget)}</dd>
              </div>
            )}
            {request.details && (
              <div>
                <dt className="text-muted-foreground">{t.crew.details}</dt>
                <dd className="whitespace-pre-line">{request.details}</dd>
              </div>
            )}
          </dl>
          <Link
            href={routes.crew.href}
            className="mt-6 inline-flex min-h-11 items-center text-sm font-semibold text-highlight underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring"
          >
            {t.crew.newRequest}
          </Link>
        </aside>
      </div>
    </main>
  );
}
