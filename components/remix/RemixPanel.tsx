"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "motion/react";
import { Check, Minus, Plus } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useCopy } from "@/hooks/use-copy";
import { fill } from "@/lib/copy";
import type { DrinkDetail } from "@/lib/db/queries";
import { formatPeso } from "@/lib/format";
import {
  defaultSelection,
  isGroupHidden,
  optionsFor,
  priceRemix,
  type RemixGroup,
  type RemixSelection,
} from "@/lib/pricing";
import { routes } from "@/lib/routes";
import { MAX_QUANTITY, usePlaylist } from "@/stores/playlist";
import { OptionGroup } from "./OptionGroup";

const NOTES_LIMIT = 140;

const remixSchema = z.object({
  // Keyed by group slug: a radio gives a string, checkboxes give an array.
  options: z.record(
    z.string(),
    z.union([z.string(), z.array(z.string()), z.boolean()]),
  ),
  notes: z.string().max(NOTES_LIMIT),
  quantity: z.number().int().min(1).max(MAX_QUANTITY),
});

type RemixFormValues = z.infer<typeof remixSchema>;

function toSelection(
  groups: RemixGroup[],
  values: RemixFormValues["options"] = {},
): RemixSelection {
  const selection: RemixSelection = {};
  for (const group of groups) {
    const value = values[group.slug];
    selection[group.id] = Array.isArray(value)
      ? value
      : typeof value === "string" && value
        ? [value]
        : [];
  }
  return selection;
}

function toFormOptions(drink: DrinkDetail) {
  const selection = defaultSelection(drink);
  const values: RemixFormValues["options"] = {};
  for (const group of drink.groups) {
    if (group.type === "text") continue;
    const ids = selection[group.id] ?? [];
    values[group.slug] = group.type === "multi" ? ids : (ids[0] ?? "");
  }
  return values;
}

export function RemixPanel({ drink }: { drink: DrinkDetail }) {
  const { t, plain, isPlain } = useCopy();
  const addItem = usePlaylist((state) => state.addItem);
  const [justAdded, setJustAdded] = useState(false);

  const { register, handleSubmit, control, setValue } =
    useForm<RemixFormValues>({
      resolver: zodResolver(remixSchema),
      defaultValues: {
        options: toFormOptions(drink),
        notes: "",
        quantity: 1,
      },
    });

  const values = useWatch({ control });
  const selection = useMemo(
    () =>
      toSelection(drink.groups, values.options as RemixFormValues["options"]),
    [drink.groups, values.options],
  );
  const quantity = values.quantity ?? 1;
  const notes = values.notes ?? "";
  const priced = priceRemix(drink, selection, notes);
  const total = priced.unitPrice * quantity;

  const notesGroup = drink.groups.find((group) => group.type === "text");
  const notesLimit = notesGroup?.maxSelect ?? NOTES_LIMIT;

  useEffect(() => {
    if (!justAdded) return;
    const timer = setTimeout(() => setJustAdded(false), 2500);
    return () => clearTimeout(timer);
  }, [justAdded]);

  const onSubmit = handleSubmit((form) => {
    const result = priceRemix(
      drink,
      toSelection(drink.groups, form.options),
      form.notes,
    );
    addItem({
      drinkId: drink.id,
      slug: drink.slug,
      name: drink.name,
      plainDescription: drink.plainDescription,
      unitPrice: result.unitPrice,
      quantity: form.quantity,
      selection: Object.fromEntries(
        result.choices.map(({ group, options }) => [
          group.id,
          options.map((option) => option.id),
        ]),
      ),
      notes: result.notes,
      choices: result.choices.map(({ group, options }) => ({
        groupId: group.id,
        danceLabel: group.danceLabel,
        plainLabel: group.plainLabel,
        options: options.map(({ id, danceLabel, plainLabel }) => ({
          id,
          danceLabel,
          plainLabel,
        })),
      })),
    });
    setValue("quantity", 1);
    setJustAdded(true);
  });

  const stepQuantity = (delta: number) =>
    setValue("quantity", Math.min(MAX_QUANTITY, Math.max(1, quantity + delta)));

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="mb-2">
        <h2 className="text-4xl leading-none">{t.terms.remix}</h2>
        {!isPlain && (
          <p className="mt-1 text-muted-foreground">{plain.terms.remix}</p>
        )}
      </div>

      <div className="space-y-5">
        {drink.groups.map((group) => {
          if (group.type === "text") {
            return (
              <div key={group.id} className="border-t-2 border-dashed pt-5">
                <label htmlFor="remix-notes" className="block">
                  <span className="block font-heading text-2xl leading-none tracking-wide uppercase">
                    {isPlain ? group.plainLabel : group.danceLabel}
                  </span>
                  {!isPlain && (
                    <span className="mt-1 block text-sm text-muted-foreground">
                      {group.plainLabel}
                    </span>
                  )}
                </label>
                <textarea
                  id="remix-notes"
                  rows={2}
                  maxLength={notesLimit}
                  placeholder={t.drink.notesPlaceholder}
                  className="mt-3 w-full resize-none rounded-xl border-2 border-input bg-card px-3 py-2 text-base outline-none placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-ring/40"
                  {...register("notes")}
                />
                <p className="mt-1 text-right text-xs text-muted-foreground">
                  {fill(t.drink.notesCount, {
                    count: notes.length,
                    max: notesLimit,
                  })}
                </p>
              </div>
            );
          }
          if (isGroupHidden(group, drink, selection)) return null;
          return (
            <OptionGroup
              key={group.id}
              group={group}
              options={optionsFor(group, drink.tempsAllowed)}
              picked={selection[group.id] ?? []}
              register={register(`options.${group.slug}`)}
            />
          );
        })}
      </div>

      <div className="sticky bottom-0 z-20 -mx-4 mt-6 border-t-2 bg-background/95 px-4 pt-3 pb-4 backdrop-blur supports-backdrop-filter:bg-background/85 sm:mx-0 sm:rounded-t-2xl sm:border-x-2 sm:px-5">
        {!drink.isAvailable && (
          <p className="mb-3 text-sm font-medium">{t.drink.unavailable}</p>
        )}
        <div className="flex items-center justify-between gap-3">
          <div
            role="group"
            aria-label={plain.drink.quantity}
            className="flex items-center rounded-full border-2 bg-card"
          >
            <button
              type="button"
              onClick={() => stepQuantity(-1)}
              disabled={quantity <= 1}
              aria-label={plain.drink.decrease}
              className="flex size-11 items-center justify-center rounded-full outline-none hover:bg-accent focus-visible:ring-3 focus-visible:ring-ring disabled:opacity-40"
            >
              <Minus aria-hidden className="size-4" />
            </button>
            <span
              aria-live="polite"
              className="w-8 text-center font-heading text-xl"
            >
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => stepQuantity(1)}
              disabled={quantity >= MAX_QUANTITY}
              aria-label={plain.drink.increase}
              className="flex size-11 items-center justify-center rounded-full outline-none hover:bg-accent focus-visible:ring-3 focus-visible:ring-ring disabled:opacity-40"
            >
              <Plus aria-hidden className="size-4" />
            </button>
          </div>
          <div className="text-right">
            <p className="text-xs font-medium text-muted-foreground">
              {t.drink.total}
            </p>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.p
                key={total}
                initial={{ y: -8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 8, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="font-heading text-4xl leading-none"
              >
                {formatPeso(total)}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={!drink.isAvailable}
          aria-label={plain.drink.addToPlaylist}
          className="mt-3 h-auto min-h-14 w-full flex-col gap-0 rounded-xl py-2"
        >
          {justAdded ? (
            <span className="flex items-center gap-2 text-base font-bold">
              <Check aria-hidden className="size-5" />
              {t.drink.added}
            </span>
          ) : (
            <>
              <span className="text-base font-bold">
                {t.drink.addToPlaylist}
              </span>
              {!isPlain && (
                <span className="text-xs font-medium">
                  {plain.drink.addToPlaylist}
                </span>
              )}
            </>
          )}
        </Button>

        <p aria-live="polite" className="sr-only">
          {justAdded ? plain.drink.added : ""}
        </p>
        {justAdded && (
          <Link
            href={routes.playlist.href}
            className="mt-2 flex min-h-11 items-center justify-center rounded-xl text-sm font-semibold text-highlight underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring"
          >
            {t.drink.viewPlaylist}
          </Link>
        )}
      </div>
    </form>
  );
}
