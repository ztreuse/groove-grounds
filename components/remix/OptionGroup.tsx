"use client";

import type { UseFormRegisterReturn } from "react-hook-form";
import { useCopy } from "@/hooks/use-copy";
import { fill } from "@/lib/copy";
import { formatPeso } from "@/lib/format";
import type { RemixGroup, RemixOption } from "@/lib/pricing";

type OptionGroupProps = {
  group: RemixGroup;
  options: RemixOption[];
  picked: string[];
  register: UseFormRegisterReturn;
};

// Dance label first, plain label underneath (Dance mode only).
function useLabels(item: { danceLabel: string; plainLabel: string }) {
  const { isPlain } = useCopy();
  return {
    main: isPlain ? item.plainLabel : item.danceLabel,
    sub:
      !isPlain && item.plainLabel !== item.danceLabel ? item.plainLabel : null,
  };
}

function Chip({
  type,
  value,
  checked,
  disabled,
  register,
  danceLabel,
  plainLabel,
  extra,
  soldOut,
}: {
  type: "radio" | "checkbox";
  value: string;
  checked: boolean;
  disabled: boolean;
  register: UseFormRegisterReturn;
  danceLabel: string;
  plainLabel: string;
  extra?: string | null;
  soldOut?: boolean;
}) {
  const { t, plain } = useCopy();
  const { main, sub } = useLabels({ danceLabel, plainLabel });

  return (
    <label className={disabled ? "cursor-not-allowed" : "cursor-pointer"}>
      <input
        type={type}
        value={value}
        disabled={disabled}
        aria-label={plainLabel}
        className="peer sr-only"
        {...register}
      />
      <span
        className={`flex min-h-11 flex-col justify-center rounded-2xl px-4 py-2 text-left transition-colors peer-focus-visible:ring-3 peer-focus-visible:ring-ring ${
          checked
            ? "bg-espresso text-cream dark:bg-cream dark:text-espresso"
            : "bg-muted hover:bg-accent hover:text-accent-foreground"
        } ${disabled ? "opacity-50" : ""}`}
      >
        <span className="text-sm font-semibold">{main}</span>
        {sub && (
          <span
            className={`text-xs ${checked ? "opacity-80" : "text-muted-foreground"}`}
          >
            {sub}
          </span>
        )}
        {(extra || soldOut) && (
          <span className="text-xs font-semibold">
            {soldOut ? (
              <>
                <span aria-hidden>{t.terms.sittingOut}</span>
                <span className="sr-only">{plain.terms.sittingOut}</span>
              </>
            ) : (
              extra
            )}
          </span>
        )}
      </span>
    </label>
  );
}

export function OptionGroup({
  group,
  options,
  picked,
  register,
}: OptionGroupProps) {
  const { t, plain } = useCopy();
  const { main, sub } = useLabels(group);
  const isMulti = group.type === "multi";
  const limit = group.maxSelect ?? Infinity;
  const atLimit = isMulti && picked.length >= limit;

  const hint = isMulti
    ? fill(t.drink.pickUpTo, { max: limit })
    : group.required
      ? t.drink.pickOne
      : t.drink.optional;

  return (
    <fieldset className="border-t pt-6">
      <legend className="sr-only">{group.plainLabel}</legend>
      <div
        aria-hidden
        className="mb-3 flex items-baseline justify-between gap-3"
      >
        <div>
          <p className="font-heading text-2xl leading-none tracking-wide uppercase">
            {main}
          </p>
          {sub && <p className="mt-1 text-sm text-muted-foreground">{sub}</p>}
        </div>
        <p className="shrink-0 text-xs font-medium text-muted-foreground">
          {hint}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {group.type === "single" && !group.required && (
          <Chip
            type="radio"
            value=""
            checked={picked.length === 0}
            disabled={false}
            register={register}
            danceLabel={t.drink.none}
            plainLabel={plain.drink.none}
          />
        )}
        {options.map((option) => {
          const checked = picked.includes(option.id);
          const charged =
            option.priceDelta > 0 && option.id !== group.defaultOptionId;
          return (
            <Chip
              key={option.id}
              type={isMulti ? "checkbox" : "radio"}
              value={option.id}
              checked={checked}
              disabled={!option.isAvailable || (atLimit && !checked)}
              register={register}
              danceLabel={option.danceLabel}
              plainLabel={option.plainLabel}
              extra={charged ? `+${formatPeso(option.priceDelta)}` : null}
              soldOut={!option.isAvailable}
            />
          );
        })}
      </div>
    </fieldset>
  );
}
