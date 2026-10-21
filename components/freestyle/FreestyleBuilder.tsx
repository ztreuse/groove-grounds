"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Check, RotateCcw } from "lucide-react";
import { z } from "zod";
import { OptionGroup } from "@/components/remix/OptionGroup";
import { QuantityStepper } from "@/components/remix/QuantityStepper";
import {
  baseColor,
  CupPreview,
  type CupState,
} from "@/components/remix/CupPreview";
import { Button } from "@/components/ui/button";
import { useCopy } from "@/hooks/use-copy";
import { CHOREO_NAME_LIMIT, NOTES_LIMIT } from "@/lib/checkout";
import { fill } from "@/lib/copy";
import type { FreestyleBase } from "@/lib/db/queries";
import { formatPeso } from "@/lib/format";
import {
  isGroupHidden,
  optionsFor,
  priceRemix,
  type RemixSelection,
  type Temperature,
} from "@/lib/pricing";
import {
  remixSchema,
  toFormOptions,
  toPlaylistItem,
  toSelection,
} from "@/lib/remix-form";
import { routes } from "@/lib/routes";
import { useUser } from "@/hooks/use-user";
import { saveChoreo } from "@/app/(shop)/freestyle/actions";
import { usePlaylist } from "@/stores/playlist";

const freestyleSchema = remixSchema
  .extend({
    name: z.string().trim().max(CHOREO_NAME_LIMIT),
    // Save to the member's Saved Choreo as well as the Playlist.
    save: z.boolean(),
  })
  .refine((form) => !form.save || form.name.length > 0, {
    path: ["name"],
    message: "nameRequired",
  });
type FreestyleValues = z.infer<typeof freestyleSchema>;

// Reads what the cup preview needs from the current choices.
function cupState(base: FreestyleBase, selection: RemixSelection): CupState {
  const picked = (slug: string) => {
    const group = base.groups.find((g) => g.slug === slug);
    if (!group) return [];
    const ids = selection[group.id] ?? [];
    return group.options.filter((o) => ids.includes(o.id)).map((o) => o.slug);
  };
  const shots = picked("shots")[0];
  return {
    base: base.slug,
    size: picked("counts")[0] ?? null,
    temp: (picked("temperature")[0] ?? base.tempsAllowed[0]) as Temperature,
    milk: picked("foundation").length > 0,
    shots: shots === "triple-time" ? 2 : shots === "double-time" ? 1 : 0,
    flavors: picked("flavor").length,
    toppings: picked("accents"),
    ice: picked("freeze")[0] ?? null,
  };
}

type FreestyleBuilderProps = {
  bases: FreestyleBase[];
  editItemId?: string | null;
};

export function FreestyleBuilder({
  bases,
  editItemId = null,
}: FreestyleBuilderProps) {
  const { t, plain, isPlain } = useCopy();
  const router = useRouter();
  const addItem = usePlaylist((state) => state.addItem);
  const updateItem = usePlaylist((state) => state.updateItem);
  const editItem = usePlaylist((state) =>
    editItemId
      ? state.items.find(
          (item) => item.id === editItemId && item.kind === "freestyle",
        )
      : undefined,
  );

  const editBase = editItem
    ? (bases.find((b) => b.id === editItem.drinkId) ?? null)
    : null;
  const [baseId, setBaseId] = useState<string | null>(null);
  // 0 = pick a base, then one step per Remix group, then the review.
  // Editing from the Playlist starts on the review (null = not moved yet).
  const [stepState, setStep] = useState<number | null>(null);
  const step = stepState ?? (editBase ? Number.MAX_SAFE_INTEGER : 0);
  const [added, setAdded] = useState(false);
  const [saveState, setSaveState] = useState<"saved" | "failed" | null>(null);
  const user = useUser();
  const base = bases.find((b) => b.id === (baseId ?? editBase?.id)) ?? null;

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FreestyleValues>({
    resolver: zodResolver(freestyleSchema),
    defaultValues: {
      options: {},
      notes: "",
      quantity: 1,
      name: "",
      save: false,
    },
  });
  const values = useWatch({ control });
  const selection = useMemo(
    () =>
      base
        ? toSelection(base.groups, values.options as FreestyleValues["options"])
        : {},
    [base, values.options],
  );

  const steps = base
    ? base.groups.filter(
        (group) =>
          group.type !== "text" && !isGroupHidden(group, base, selection),
      )
    : [];
  const reviewStep = steps.length + 1;
  // Hiding a group (e.g. Freeze after picking Warm-up) can shorten the list.
  const current = Math.min(step, reviewStep);
  const group =
    current >= 1 && current <= steps.length ? steps[current - 1] : null;
  const priced = base ? priceRemix(base, selection, values.notes ?? "") : null;
  const quantity = values.quantity ?? 1;

  function chooseBase(next: FreestyleBase) {
    setBaseId(next.id);
    reset({
      options: toFormOptions(next),
      notes: values.notes ?? "",
      quantity,
      name: values.name ?? "",
      save: values.save ?? false,
    });
    setAdded(false);
    setStep(1);
  }

  // Editing from the Playlist: load the item's choices into the form.
  const loadedEditId = useRef<string | null>(null);
  useEffect(() => {
    if (!editItem || !editBase || loadedEditId.current === editItem.id) return;
    loadedEditId.current = editItem.id;
    reset({
      options: toFormOptions(editBase, editItem.selection),
      notes: editItem.notes,
      quantity: editItem.quantity,
      name: editItem.choreoName ?? "",
      save: false,
    });
  }, [editItem, editBase, reset]);

  const onSubmit = handleSubmit(async (form) => {
    if (!base) return;
    const result = priceRemix(
      base,
      toSelection(base.groups, form.options),
      form.notes,
    );
    const choreoName = form.name || undefined;
    const item = toPlaylistItem(base, result, form.quantity, {
      kind: "freestyle",
      choreoName,
      name: choreoName ?? fill(t.freestyle.defaultName, { base: base.name }),
    });
    if (editItem) {
      updateItem(editItem.id, item);
      router.push(routes.playlist.href);
      return;
    }
    addItem(item);
    setAdded(true);
    setSaveState(null);
    if (form.save && user && choreoName) {
      const saved = await saveChoreo({
        drinkId: base.id,
        name: choreoName,
        selection: item.selection,
        notes: item.notes,
      }).catch(() => ({ ok: false }));
      setSaveState(saved.ok ? "saved" : "failed");
    }
  });

  function startOver() {
    setBaseId(null);
    reset({ options: {}, notes: "", quantity: 1, name: "", save: false });
    setAdded(false);
    setSaveState(null);
    setStep(0);
  }

  const cup = base ? cupState(base, selection) : null;
  const cupLabel =
    base && cup
      ? fill(plain.freestyle.cupLabel, {
          base: base.name,
          size:
            base.groups
              .find((g) => g.slug === "counts")
              ?.options.find((o) => o.slug === cup.size)?.plainLabel ?? "",
          temp: plain.remix[
            cup.temp === "hot"
              ? "warmUp"
              : cup.temp === "iced"
                ? "coolDown"
                : "blended"
          ],
        })
      : "";
  const displayName =
    values.name?.trim() ||
    (base ? fill(t.freestyle.defaultName, { base: base.name }) : "");

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 gap-6 px-4 pt-8 pb-16 sm:pt-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-12"
    >
      {/* Live preview: compact strip on phones, sticky card on desktop. */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="flex items-center gap-4 rounded-3xl border-2 bg-card p-4 lg:flex-col lg:p-6">
          <div className="h-36 w-28 shrink-0 text-foreground lg:h-72 lg:w-full">
            {cup ? (
              <CupPreview state={cup} label={cupLabel} />
            ) : (
              <CupPreview
                state={{
                  base: "",
                  size: "count-16",
                  temp: "iced",
                  milk: false,
                  shots: 0,
                  flavors: 0,
                  toppings: [],
                  ice: null,
                }}
                label={plain.freestyle.preview}
              />
            )}
          </div>
          <div className="min-w-0 flex-1 lg:w-full lg:text-center">
            <p className="text-xs font-semibold tracking-widest text-highlight uppercase">
              {t.freestyle.preview}
            </p>
            {base && (
              <p className="mt-1 truncate font-heading text-2xl leading-tight tracking-wide uppercase">
                {displayName}
              </p>
            )}
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.p
                key={priced ? priced.unitPrice * quantity : "none"}
                initial={{ y: -8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 8, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="font-heading text-4xl leading-none"
              >
                {priced ? formatPeso(priced.unitPrice * quantity) : "-"}
              </motion.p>
            </AnimatePresence>
            {base && current > 0 && (
              <button
                type="button"
                onClick={() => setStep(0)}
                className="mt-2 inline-flex min-h-11 items-center gap-1.5 rounded-lg text-sm font-semibold text-highlight outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring"
              >
                <RotateCcw aria-hidden className="size-4" />
                {t.freestyle.changeBase}
              </button>
            )}
          </div>
        </div>
      </aside>

      <div className="min-w-0">
        <h1 className="text-5xl leading-none sm:text-7xl">
          {t.terms.freestyle}
        </h1>
        {!isPlain && (
          <p className="mt-1 text-lg text-muted-foreground">
            {plain.terms.freestyle}
          </p>
        )}
        <p className="mt-3 max-w-prose">{t.freestyle.intro}</p>

        {base && current > 0 && (
          <div className="mt-6">
            <p className="text-sm font-semibold text-muted-foreground">
              {fill(t.freestyle.stepOf, { step: current, total: reviewStep })}
            </p>
            <div aria-hidden className="mt-2 flex gap-1">
              {Array.from({ length: reviewStep }, (_, index) => (
                <span
                  key={index}
                  className={`h-2 flex-1 rounded-full transition-colors ${
                    index < current ? "bg-primary" : "bg-muted"
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        <div className="mt-6">
          {current === 0 && (
            <fieldset>
              <legend className="mb-4 font-heading text-3xl tracking-wide uppercase">
                {t.freestyle.pickBase}
              </legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {bases.map((option) => {
                  const active = option.id === baseId;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      aria-pressed={active}
                      aria-label={`${option.plainDescription}, ${fill(plain.freestyle.from, { price: formatPeso(option.basePrice) })}`}
                      onClick={() => chooseBase(option)}
                      className={`flex min-h-20 items-center gap-4 rounded-2xl border-2 p-4 text-left outline-none hover:animate-beat focus-visible:ring-3 focus-visible:ring-ring motion-reduce:hover:animate-none ${
                        active ? "border-primary bg-card" : "bg-card"
                      }`}
                    >
                      <span
                        aria-hidden
                        className="size-10 shrink-0 rounded-full border-2"
                        style={{ background: baseColor(option.slug) }}
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block font-heading text-2xl leading-none tracking-wide uppercase">
                          {option.name}
                        </span>
                        <span className="mt-1 block text-sm text-muted-foreground">
                          {option.blurb}
                        </span>
                      </span>
                      <span className="shrink-0 text-sm font-semibold">
                        {fill(t.freestyle.from, {
                          price: formatPeso(option.basePrice),
                        })}
                      </span>
                    </button>
                  );
                })}
              </div>
            </fieldset>
          )}

          {base && group && (
            <OptionGroup
              key={group.id}
              group={group}
              options={optionsFor(group, base.tempsAllowed)}
              picked={selection[group.id] ?? []}
              register={register(`options.${group.slug}`)}
            />
          )}

          {base && current === reviewStep && (
            <div className="space-y-5">
              <h2 className="text-3xl leading-none">{t.freestyle.review}</h2>
              <ul className="space-y-2 rounded-2xl border-2 bg-card p-4">
                {priced?.choices.map(({ group: g, options }) => (
                  <li key={g.id} className="flex justify-between gap-3 text-sm">
                    <span className="text-muted-foreground">
                      {isPlain ? g.plainLabel : g.danceLabel}
                    </span>
                    <span className="text-right font-semibold">
                      {options
                        .map((o) => (isPlain ? o.plainLabel : o.danceLabel))
                        .join(", ")}
                    </span>
                  </li>
                ))}
              </ul>

              <div>
                <label
                  htmlFor="choreo-name"
                  className="block font-heading text-2xl leading-none tracking-wide uppercase"
                >
                  {t.freestyle.nameLabel}
                </label>
                <input
                  id="choreo-name"
                  maxLength={CHOREO_NAME_LIMIT}
                  placeholder={t.freestyle.namePlaceholder}
                  aria-describedby="choreo-name-hint"
                  className="mt-3 h-12 w-full rounded-xl border-2 border-input bg-card px-3 text-base outline-none placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-ring/40"
                  {...register("name")}
                />
                <p
                  id="choreo-name-hint"
                  className="mt-1 text-sm text-muted-foreground"
                >
                  {t.freestyle.nameHint}
                </p>
                {errors.name?.message === "nameRequired" && (
                  <p role="alert" className="mt-1 text-sm text-destructive">
                    {t.freestyle.nameRequired}
                  </p>
                )}
                {user && !editItem && (
                  <label className="mt-3 flex min-h-11 cursor-pointer items-center gap-3 text-sm font-semibold">
                    <input
                      type="checkbox"
                      className="size-5 accent-[var(--color-purple)]"
                      {...register("save")}
                    />
                    {t.freestyle.saveToProfile}
                  </label>
                )}
                {user === null && (
                  <Link
                    href={`${routes.join.href}?next=${routes.freestyle.href}`}
                    className="mt-2 inline-flex min-h-11 items-center text-sm font-semibold text-highlight underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring"
                  >
                    {t.freestyle.joinToSave}
                  </Link>
                )}
              </div>

              <div>
                <label
                  htmlFor="freestyle-notes"
                  className="block font-heading text-2xl leading-none tracking-wide uppercase"
                >
                  {t.remix.notes}
                </label>
                {!isPlain && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {plain.remix.notes}
                  </p>
                )}
                <textarea
                  id="freestyle-notes"
                  rows={2}
                  maxLength={NOTES_LIMIT}
                  placeholder={t.drink.notesPlaceholder}
                  className="mt-3 w-full resize-none rounded-xl border-2 border-input bg-card px-3 py-2 text-base outline-none placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-ring/40"
                  {...register("notes")}
                />
              </div>

              <div className="flex items-center justify-between gap-3">
                <QuantityStepper
                  value={quantity}
                  onChange={(value) => setValue("quantity", value)}
                />
                <p className="font-heading text-4xl">
                  {priced && formatPeso(priced.unitPrice * quantity)}
                </p>
              </div>

              {added ? (
                <div
                  role="status"
                  className="rounded-2xl border-2 border-primary bg-accent p-4 text-accent-foreground"
                >
                  <p className="flex items-center gap-2 font-semibold">
                    <Check aria-hidden className="size-5" />
                    {t.freestyle.added}
                  </p>
                  {saveState && (
                    <p className="mt-1 text-sm">
                      {saveState === "saved"
                        ? t.freestyle.savedNote
                        : t.freestyle.saveFailed}
                    </p>
                  )}
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button asChild>
                      <Link
                        href={routes.playlist.href}
                        aria-label={plain.drink.viewPlaylist}
                      >
                        {t.drink.viewPlaylist}
                      </Link>
                    </Button>
                    <Button type="button" variant="outline" onClick={startOver}>
                      {t.freestyle.changeBase}
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  type="submit"
                  size="lg"
                  aria-label={
                    editItem ? plain.drink.update : plain.drink.addToPlaylist
                  }
                  className="h-auto min-h-14 w-full flex-col gap-0 rounded-full py-2"
                >
                  <span className="text-base font-bold">
                    {editItem ? t.drink.update : t.drink.addToPlaylist}
                  </span>
                  {!isPlain && (
                    <span className="text-xs font-medium">
                      {editItem
                        ? plain.drink.update
                        : plain.drink.addToPlaylist}
                    </span>
                  )}
                </Button>
              )}
            </div>
          )}
        </div>

        {base && current > 0 && (
          <div className="sticky bottom-0 z-20 -mx-4 mt-6 flex justify-between gap-3 border-t-2 bg-background/95 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-2xl sm:border-2">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => setStep(current - 1)}
            >
              <ArrowLeft aria-hidden />
              {t.freestyle.back}
            </Button>
            {current < reviewStep && (
              <Button
                type="button"
                size="lg"
                onClick={() => setStep(current + 1)}
              >
                {t.freestyle.next}
                <ArrowRight aria-hidden />
              </Button>
            )}
          </div>
        )}
      </div>
    </form>
  );
}
