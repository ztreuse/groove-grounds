"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { getOrderProps, submitProps } from "@/app/(shop)/track/actions";
import { StarIcon } from "@/components/icons/GrooveIcons";
import { Button } from "@/components/ui/button";
import { useCopy } from "@/hooks/use-copy";
import { fill } from "@/lib/copy";
import type { TrackedOrder } from "@/lib/db/orders";

type Ratable = { drinkId: string; name: string };

// After pickup (Bow): one Give Props card per menu drink on the order.
export function PropsPrompt({ order }: { order: TrackedOrder }) {
  const { t } = useCopy();
  const [rated, setRated] = useState<string[] | null>(null);

  useEffect(() => {
    getOrderProps(order.id).then(setRated);
  }, [order.id]);

  // One card per drink, even if it was ordered twice.
  const drinks: Ratable[] = [
    ...new Map(
      order.items
        .filter((item) => item.ratable && item.drinkId)
        .map((item) => [
          item.drinkId!,
          { drinkId: item.drinkId!, name: item.name },
        ]),
    ).values(),
  ];
  if (!rated || drinks.length === 0) return null;

  return (
    <section aria-labelledby="give-props" className="mt-8">
      <h2 id="give-props" className="text-3xl leading-none">
        {t.props.giveTitle}
      </h2>
      <p className="mt-2 text-muted-foreground">{t.props.giveBody}</p>
      <ul className="mt-4 space-y-3">
        {drinks.map((drink) => (
          <PropsCard
            key={drink.drinkId}
            orderId={order.id}
            drink={drink}
            done={rated.includes(drink.drinkId)}
          />
        ))}
      </ul>
    </section>
  );
}

function PropsCard({
  orderId,
  drink,
  done,
}: {
  orderId: string;
  drink: Ratable;
  done: boolean;
}) {
  const { t, plain } = useCopy();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "sent" | "failed">(
    done ? "sent" : "idle",
  );

  async function send() {
    setState("busy");
    const ok = await submitProps({
      orderId,
      drinkId: drink.drinkId,
      rating,
      comment,
    });
    setState(ok ? "sent" : "failed");
  }

  return (
    <li className="surface p-4">
      <p className="label-display text-lg leading-tight">{drink.name}</p>
      {state === "sent" ? (
        <p
          role="status"
          className="mt-2 flex items-center gap-2 text-sm font-semibold text-highlight"
        >
          <Check aria-hidden className="size-4" />
          {t.props.thanks}
        </p>
      ) : (
        <>
          <div
            role="radiogroup"
            aria-label={plain.props.giveTitle}
            className="mt-3 flex flex-wrap items-center gap-1"
          >
            {([1, 2, 3, 4, 5] as const).map((value) => (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={rating === value}
                aria-label={fill(plain.props.rate, {
                  name: drink.name,
                  count: value,
                })}
                onClick={() => setRating(value)}
                className={`flex size-11 items-center justify-center rounded-md transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring ${
                  value <= rating
                    ? "text-primary"
                    : "text-muted-foreground/40 hover:text-muted-foreground"
                }`}
              >
                <StarIcon className="size-7" />
              </button>
            ))}
            {rating > 0 && (
              <span className="ml-2 label-display text-base">
                {t.props.labels[rating as 1 | 2 | 3 | 4 | 5]}
              </span>
            )}
          </div>
          {rating > 0 && (
            <div className="mt-3 space-y-3">
              <label className="block text-sm font-semibold">
                {t.props.comment}
                <textarea
                  rows={2}
                  maxLength={280}
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                  placeholder={t.props.commentPlaceholder}
                  className="mt-1 w-full resize-none field px-4 py-3 text-base font-normal"
                />
              </label>
              <div className="flex items-center justify-between gap-3">
                {state === "failed" && (
                  <p role="alert" className="text-sm text-destructive">
                    {t.props.failed}
                  </p>
                )}
                <Button
                  className="ml-auto"
                  disabled={state === "busy"}
                  onClick={send}
                  aria-label={plain.props.submit}
                >
                  {t.props.submit}
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </li>
  );
}
