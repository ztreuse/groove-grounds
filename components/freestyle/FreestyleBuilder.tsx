"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Check, RotateCcw } from "lucide-react";
import { toast } from "sonner";
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
  // +1 moving forward, -1 moving back: steps slide in from that side.
  const [direction, setDirection] = useState(1);
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

  function goTo(next: number) {
    setDirection(next >= current ? 1 : -1);
    setStep(next);
  }

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
    setDirection(1);
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
      if (saved.ok) toast(t.freestyle.savedNote, { description: choreoName });
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
  const glow = cup
    ? (cup.liquid ?? baseColor(cup.base))
    : "var(--color-purple)";
  const labelOf = (item: { danceLabel: string; plainLabel: string }) =>
    isPlain ? item.plainLabel : item.danceLabel;
  const stepLabel = group
    ? labelOf(group)
    : current === reviewStep
      ? t.freestyle.review
      : "";
  const nextLabel =
    current < steps.length ? labelOf(steps[current]) : t.freestyle.review;
  const receipt = (priced?.choices ?? []).flatMap(({ group: g, options }) =>
    options.map((o) => ({ key: `${g.slug}:${o.slug}`, label: labelOf(o) })),
  );
  const displayName =
    values.name?.trim() ||
    (base ? fill(t.freestyle.defaultName, { base: base.name }) : "");

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 gap-6 px-4 pt-8 pb-16 sm:pt-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-12"
    >
      {/* Live preview: compact strip on phones, sticky stage on desktop. */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="relative overflow-hidden rounded-[2rem] bg-espresso p-4 text-cream shadow-[0_30px_60px_-30px_rgb(43_30_23_/_0.8)] lg:p-7 dark:bg-espresso-deep">
          <span
            aria-hidden
            className="absolute inset-0 opacity-60 transition-[background] duration-700"
            style={{
              background: `radial-gradient(circle at 50% 78%, ${glow} 0%, transparent 62%)`,
            }}
          />
          <span
            aria-hidden
            className="absolute inset-x-[20%] bottom-[18%] hidden h-6 rounded-[50%] bg-black/40 blur-md lg:block"
          />
          <div className="relative flex items-center gap-5 lg:flex-col lg:gap-6">
            <div className="h-36 w-28 shrink-0 lg:h-80 lg:w-full">
              <CupPreview
                state={
                  cup ?? {
                    base: "",
                    size: "count-16",
                    temp: "iced",
                    milk: false,
                    shots: 0,
                    flavors: 0,
                    toppings: [],
                    ice: null,
                  }
                }
                label={cup ? cupLabel : plain.freestyle.preview}
              />
            </div>
            <div className="min-w-0 flex-1 lg:w-full lg:text-center">
              <p className="text-xs font-semibold text-khaki">
                {t.freestyle.preview}
              </p>
              {base && (
                <p className="mt-1 truncate font-heading text-2xl leading-tight">
                  {displayName}
                </p>
              )}
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.p
                  key={priced ? priced.unitPrice * quantity : "none"}
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 10, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-1 font-heading text-4xl leading-none lg:text-5xl"
                >
                  {priced ? formatPeso(priced.unitPrice * quantity) : "-"}
                </motion.p>
              </AnimatePresence>
              {base && current > 0 && (
                <button
                  type="button"
                  onClick={() => goTo(0)}
                  className="mt-2 inline-flex min-h-11 items-center gap-1.5 rounded-full text-sm font-semibold text-lilac outline-none hover:underline focus-visible:ring-3 focus-visible:ring-lilac"
                >
                  <RotateCcw aria-hidden className="size-4" />
                  {t.freestyle.changeBase}
                </button>
              )}
            </div>
          </div>
          {/* Running receipt of choices (desktop). */}
          {receipt.length > 0 && (
            <ul className="relative mt-5 hidden flex-wrap justify-center gap-1.5 lg:flex">
              <AnimatePresence initial={false}>
                {receipt.map(({ key, label }) => (
                  <motion.li
                    key={key}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                    className="rounded-full bg-cream/10 px-3 py-1 text-xs font-medium text-cream/90"
                  >
                    {label}
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </div>
      </aside>

      <div className="min-w-0">
        <h1 className="text-4xl leading-tight sm:text-6xl">
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
              <span className="text-foreground"> {stepLabel}</span>
            </p>
            <div aria-hidden className="mt-2 flex gap-1">
              {Array.from({ length: reviewStep }, (_, index) => (
                <span
                  key={index}
                  className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-muted"
                >
                  <span
                    className={`absolute inset-0 origin-left rounded-full bg-primary transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      index < current ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </span>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.div
            key={
              current === 0
                ? "base"
                : current === reviewStep
                  ? "review"
                  : group?.id
            }
            custom={direction}
            initial={{ opacity: 0, x: direction * 32 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -32 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6"
          >
            {current === 0 && (
              <fieldset>
                <legend className="mb-4 font-heading text-3xl tracking-tight">
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
                        className={`flex min-h-20 items-center gap-4 surface p-4 text-left outline-none hover:animate-beat focus-visible:ring-3 focus-visible:ring-ring motion-reduce:hover:animate-none ${
                          active ? "ring-2 ring-primary" : ""
                        }`}
                      >
                        <span
                          aria-hidden
                          className="size-10 shrink-0 rounded-full ring-1 ring-black/10"
                          style={{ background: baseColor(option.slug) }}
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block font-heading text-2xl leading-none tracking-tight">
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
                <ul className="space-y-2 surface p-4">
                  {priced?.choices.map(({ group: g, options }) => (
                    <li
                      key={g.id}
                      className="flex justify-between gap-3 text-sm"
                    >
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
                    className="block font-heading text-2xl leading-none tracking-tight"
                  >
                    {t.freestyle.nameLabel}
                  </label>
                  <input
                    id="choreo-name"
                    maxLength={CHOREO_NAME_LIMIT}
                    placeholder={t.freestyle.namePlaceholder}
                    aria-describedby="choreo-name-hint"
                    className="mt-3 h-12 w-full field px-4 text-base focus-visible:ring-ring/40"
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
                    className="block font-heading text-2xl leading-none tracking-tight"
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
                    className="mt-3 w-full resize-none field px-4 py-2 text-base focus-visible:ring-ring/40"
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
                    className="rounded-2xl bg-accent p-4 text-accent-foreground"
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
                      <Button
                        type="button"
                        variant="outline"
                        onClick={startOver}
                      >
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
          </motion.div>
        </AnimatePresence>

        {base && current > 0 && (
          <div className="fade-above sticky bottom-0 z-20 -mx-4 mt-8 flex items-center justify-between gap-3 bg-background/90 px-4 py-3 backdrop-blur sm:mx-0 sm:px-0">
            <Button
              type="button"
              variant="ghost"
              size="lg"
              onClick={() => goTo(current - 1)}
            >
              <ArrowLeft aria-hidden />
              {t.freestyle.back}
            </Button>
            {current < reviewStep && (
              <Button
                type="button"
                size="lg"
                onClick={() => goTo(current + 1)}
                className="h-auto min-h-12 gap-3 py-1.5 pr-4 pl-6"
              >
                <span className="text-left leading-tight">
                  <span className="block">{t.freestyle.next}</span>
                  <span className="block text-xs font-medium opacity-80">
                    {nextLabel}
                  </span>
                </span>
                <ArrowRight aria-hidden />
              </Button>
            )}
          </div>
        )}
      </div>
    </form>
  );
}
