"use client";

import type { UseFormRegisterReturn } from "react-hook-form";
import { Check } from "lucide-react";
import { motion } from "motion/react";
import { useCopy } from "@/hooks/use-copy";
import { IconTile } from "@/components/layout/IconTile";
import { fill } from "@/lib/copy";
import { isTemperature, tempStyles } from "@/lib/temps";
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
  groupId,
  type,
  value,
  checked,
  disabled,
  register,
  danceLabel,
  plainLabel,
  extra,
  soldOut,
  temp,
}: {
  groupId: string;
  type: "radio" | "checkbox";
  value: string;
  checked: boolean;
  disabled: boolean;
  register: UseFormRegisterReturn;
  danceLabel: string;
  plainLabel: string;
  extra?: string | null;
  soldOut?: boolean;
  // Temperature options show their colour-coded icon.
  temp?: keyof typeof tempStyles;
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
        className={`relative flex min-h-12 flex-col justify-center rounded-2xl px-4 py-2 text-left transition-[color,translate] duration-300 peer-focus-visible:ring-3 peer-focus-visible:ring-ring active:translate-y-px ${
          checked
            ? "text-background"
            : "bg-muted hover:bg-accent hover:text-accent-foreground"
        } ${disabled ? "opacity-50" : ""}`}
      >
        {/* Selected fill: one per group glides between single choices;
            multi choices each pop in their own. */}
        {checked && (
          <motion.span
            aria-hidden
            layoutId={type === "radio" ? `pick-${groupId}` : undefined}
            initial={type === "checkbox" ? { scale: 0.85, opacity: 0 } : false}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 520, damping: 38 }}
            className="absolute inset-0 rounded-2xl bg-foreground shadow-[0_10px_24px_-12px_rgb(43_30_23_/_0.6)]"
          />
        )}
        {checked && type === "checkbox" && (
          <Check
            aria-hidden
            className="absolute top-2 right-2 size-3.5 text-background"
          />
        )}
        <span className="relative flex items-center gap-2 pr-3 text-sm font-semibold">
          {temp && (
            <IconTile
              icon={tempStyles[temp].icon}
              tone="custom"
              className={
                checked ? tempStyles[temp].solid : tempStyles[temp].tile
              }
              size="sm"
            />
          )}
          {main}
        </span>
        {sub && (
          <span
            className={`relative text-xs ${checked ? "opacity-75" : "text-muted-foreground"}`}
          >
            {sub}
          </span>
        )}
        {(extra || soldOut) && (
          <span className="relative text-xs font-semibold">
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
    <fieldset className="border-t border-border pt-6">
      <legend className="sr-only">{group.plainLabel}</legend>
      <div
        aria-hidden
        className="mb-3 flex items-baseline justify-between gap-3"
      >
        <div>
          <p className="font-heading text-2xl leading-none font-bold tracking-tight">
            {main}
          </p>
          {sub && <p className="mt-1 text-sm text-muted-foreground">{sub}</p>}
        </div>
        <p className="shrink-0 eyebrow text-[0.65rem] text-muted-foreground">
          {hint}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {group.type === "single" && !group.required && (
          <Chip
            groupId={group.id}
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
              groupId={group.id}
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
              temp={
                group.slug === "temperature" && isTemperature(option.slug)
                  ? option.slug
                  : undefined
              }
            />
          );
        })}
      </div>
    </fieldset>
  );
}
