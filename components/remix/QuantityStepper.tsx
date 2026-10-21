"use client";

import { Minus, Plus } from "lucide-react";
import { useCopy } from "@/hooks/use-copy";
import { MAX_QUANTITY } from "@/lib/checkout";

type QuantityStepperProps = {
  value: number;
  onChange: (value: number) => void;
  // Spoken label for the group, e.g. the drink name.
  label?: string;
};

const buttonClass =
  "flex size-11 items-center justify-center rounded-full outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-3 focus-visible:ring-ring disabled:opacity-40 disabled:hover:bg-transparent";

export function QuantityStepper({
  value,
  onChange,
  label,
}: QuantityStepperProps) {
  const { plain } = useCopy();

  return (
    <div
      role="group"
      aria-label={
        label ? `${plain.drink.quantity}, ${label}` : plain.drink.quantity
      }
      className="flex items-center rounded-full bg-muted"
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(1, value - 1))}
        disabled={value <= 1}
        aria-label={plain.drink.decrease}
        className={buttonClass}
      >
        <Minus aria-hidden className="size-4" />
      </button>
      <span aria-live="polite" className="w-8 text-center font-heading text-xl">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(MAX_QUANTITY, value + 1))}
        disabled={value >= MAX_QUANTITY}
        aria-label={plain.drink.increase}
        className={buttonClass}
      >
        <Plus aria-hidden className="size-4" />
      </button>
    </div>
  );
}
