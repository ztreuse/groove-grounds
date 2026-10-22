"use client";

import type { UseFormRegisterReturn } from "react-hook-form";
import { CardIcon, ShopIcon, WalletIcon } from "@/components/icons/GrooveIcons";
import { IconTile } from "@/components/layout/IconTile";
import { useCopy } from "@/hooks/use-copy";
import type { PaymentMethod } from "@/lib/checkout";

// Obvious fake details, shown read-only. Never accept real card numbers.
const DEMO_CARD = {
  number: "4242 4242 4242 4242",
  expiry: "12/34",
  cvc: "123",
};

type PaymentOptionsProps = {
  value: PaymentMethod;
  register: UseFormRegisterReturn;
};

export function PaymentOptions({ value, register }: PaymentOptionsProps) {
  const { t, plain } = useCopy();

  const methods = [
    {
      value: "demo_gcash",
      label: t.showtime.gcash,
      ariaLabel: plain.showtime.gcash,
      icon: WalletIcon,
      hint: t.showtime.gcashHint,
    },
    {
      value: "demo_card",
      label: t.showtime.card,
      ariaLabel: plain.showtime.card,
      icon: CardIcon,
      hint: null,
    },
    {
      value: "pay_at_pickup",
      label: t.showtime.payAtPickup,
      ariaLabel: plain.showtime.payAtPickup,
      icon: ShopIcon,
      hint: t.showtime.payAtPickupHint,
    },
  ] as const;

  const readOnlyField =
    "h-11 w-full field rounded-xl px-3 font-mono text-sm text-muted-foreground";

  return (
    <div className="space-y-2">
      {methods.map(({ value: method, label, ariaLabel, icon: Icon, hint }) => {
        const active = method === value;
        return (
          <div
            key={method}
            className={`surface rounded-2xl transition-shadow ${
              active ? "ring-2 ring-primary" : ""
            }`}
          >
            <label className="flex min-h-14 cursor-pointer items-center gap-3 px-4">
              <input
                type="radio"
                value={method}
                aria-label={ariaLabel}
                className="size-5 accent-[var(--color-purple)]"
                {...register}
              />
              <IconTile
                icon={Icon}
                tone={active ? "accent" : "neutral"}
                size="sm"
              />
              <span className="font-semibold">{label}</span>
            </label>
            {active && hint && (
              <p className="px-4 pb-3 text-sm text-muted-foreground">{hint}</p>
            )}
            {active && method === "demo_card" && (
              <div className="grid grid-cols-2 gap-2 px-4 pb-4">
                <label className="col-span-2 text-xs font-medium">
                  {t.showtime.cardNumber}
                  <input
                    readOnly
                    tabIndex={-1}
                    value={DEMO_CARD.number}
                    aria-label={plain.showtime.cardNumber}
                    className={`mt-1 ${readOnlyField}`}
                  />
                </label>
                <label className="text-xs font-medium">
                  {t.showtime.cardExpiry}
                  <input
                    readOnly
                    tabIndex={-1}
                    value={DEMO_CARD.expiry}
                    aria-label={plain.showtime.cardExpiry}
                    className={`mt-1 ${readOnlyField}`}
                  />
                </label>
                <label className="text-xs font-medium">
                  {t.showtime.cardCvc}
                  <input
                    readOnly
                    tabIndex={-1}
                    value={DEMO_CARD.cvc}
                    aria-label={plain.showtime.cardCvc}
                    className={`mt-1 ${readOnlyField}`}
                  />
                </label>
              </div>
            )}
          </div>
        );
      })}
      <p className="rounded-xl bg-accent px-4 py-3 text-sm font-medium text-accent-foreground">
        {t.showtime.demoNotice}
      </p>
    </div>
  );
}
