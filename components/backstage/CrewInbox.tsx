"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { declineRequest, sendQuote } from "@/app/backstage/crew-orders/actions";
import { Button } from "@/components/ui/button";
import { useCopy } from "@/hooks/use-copy";
import { fill } from "@/lib/copy";
import type { CrewInboxItem } from "@/lib/db/crew";
import { formatDay, formatPeso, formatTime } from "@/lib/format";
import { dayKey } from "@/lib/schedule";

const GROUPS = ["new", "quoted", "accepted", "declined"] as const;

// Owner's Crew Order inbox: requests grouped by status. New ones take a
// quote (amount + note) or a decline; the customer answers on their page.
export function CrewInbox({ requests }: { requests: CrewInboxItem[] }) {
  const { t } = useCopy();

  if (requests.length === 0) {
    return (
      <p className="mt-8 rounded-md bg-muted/60 p-8 text-center text-muted-foreground">
        {t.crewAdmin.empty}
      </p>
    );
  }

  return (
    <div className="mt-8 space-y-12">
      {GROUPS.map((group) => {
        const items = requests.filter((r) => r.status === group);
        if (items.length === 0) return null;
        return (
          <section key={group} aria-labelledby={`crew-${group}`}>
            <div className="mb-3 flex items-end justify-between border-b border-border pb-2">
              <h2 id={`crew-${group}`} className="text-2xl leading-none">
                {t.crewAdmin.groups[group]}
              </h2>
              <span className="label-display text-sm text-muted-foreground">
                {items.length}
              </span>
            </div>
            <ul className="grid gap-4 lg:grid-cols-2">
              {items.map((request) => (
                <RequestCard key={request.id} request={request} />
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

function RequestCard({ request }: { request: CrewInboxItem }) {
  const { t, plain } = useCopy();
  const router = useRouter();
  const [amount, setAmount] = useState(
    request.budget ? String(request.budget) : "",
  );
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [confirmDecline, setConfirmDecline] = useState(false);

  useEffect(() => {
    if (!confirmDecline) return;
    const timer = setTimeout(() => setConfirmDecline(false), 4000);
    return () => clearTimeout(timer);
  }, [confirmDecline]);

  async function run(action: () => Promise<boolean>, done: string) {
    setBusy(true);
    const ok = await action();
    setBusy(false);
    toast(ok ? done : t.crewAdmin.failed);
    if (ok) router.refresh();
  }

  const validAmount = /^\d{1,7}$/.test(amount) && Number(amount) > 0;

  return (
    <li className="surface p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="label-display text-xl leading-tight">{request.name}</p>
          <p className="text-sm text-muted-foreground">
            {request.phone}
            {request.contact && ` · ${request.contact}`}
          </p>
        </div>
        <p className="text-right text-sm font-semibold">
          {formatDay(dayKey(new Date(request.eventDate)))}
          <br />
          {formatTime(request.eventDate)}
        </p>
      </div>
      <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
        <dt className="text-muted-foreground">{t.crew.headcount}</dt>
        <dd className="font-semibold">
          {fill(t.crew.people, { count: request.headcount })}
        </dd>
        <dt className="text-muted-foreground">{t.crew.drinkMix}</dt>
        <dd className="whitespace-pre-line">{request.drinkMix}</dd>
        {request.details && (
          <>
            <dt className="text-muted-foreground">{t.crew.details}</dt>
            <dd className="whitespace-pre-line">{request.details}</dd>
          </>
        )}
        <dt className="text-muted-foreground">{t.crew.budgetShort}</dt>
        <dd>
          {request.budget !== null
            ? formatPeso(request.budget)
            : t.crewAdmin.noBudget}
        </dd>
        {request.quoteAmount !== null && (
          <>
            <dt className="text-muted-foreground">{t.crew.quote}</dt>
            <dd className="font-semibold">
              {formatPeso(request.quoteAmount)}
              {request.quoteNote && (
                <span className="block font-normal text-muted-foreground">
                  {request.quoteNote}
                </span>
              )}
            </dd>
          </>
        )}
      </dl>

      {request.status === "new" && (
        <div className="mt-5 space-y-3 border-t border-border pt-4">
          <div className="grid gap-3 sm:grid-cols-[8rem_1fr]">
            <label className="text-sm font-semibold">
              {t.crewAdmin.quoteAmount}
              <input
                type="number"
                inputMode="numeric"
                min={1}
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                aria-invalid={amount !== "" && !validAmount}
                className="mt-1 h-11 w-full field px-3 tabular-nums"
              />
            </label>
            <label className="text-sm font-semibold">
              {t.crewAdmin.quoteNote}
              <input
                value={note}
                maxLength={500}
                onChange={(event) => setNote(event.target.value)}
                className="mt-1 h-11 w-full field px-3"
              />
            </label>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                if (!confirmDecline) return setConfirmDecline(true);
                void run(
                  () => declineRequest(request.id),
                  t.crewAdmin.declined,
                );
              }}
              aria-label={
                confirmDecline
                  ? plain.crewAdmin.confirmDecline
                  : plain.crewAdmin.decline
              }
              className="inline-flex min-h-11 items-center rounded-md px-3 text-sm font-semibold text-destructive outline-none hover:bg-destructive/10 focus-visible:ring-3 focus-visible:ring-ring"
            >
              {confirmDecline
                ? t.crewAdmin.confirmDecline
                : t.crewAdmin.decline}
            </button>
            <Button
              disabled={busy || !validAmount}
              onClick={() =>
                run(
                  () => sendQuote({ id: request.id, amount, note }),
                  t.crewAdmin.sent,
                )
              }
              aria-label={plain.crewAdmin.sendQuote}
            >
              {t.crewAdmin.sendQuote}
            </Button>
          </div>
        </div>
      )}

      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {fill(t.crewAdmin.received, {
            date: formatDay(dayKey(new Date(request.createdAt))),
          })}
        </span>
        <Link
          href={`/crew/requests/${request.id}`}
          target="_blank"
          className="inline-flex min-h-11 items-center gap-1 font-semibold text-highlight outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring"
        >
          {t.crewAdmin.customerView}
          <ExternalLink aria-hidden className="size-3.5" />
        </Link>
      </div>
    </li>
  );
}
