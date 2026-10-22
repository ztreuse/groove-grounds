"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Check, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { KineticTitle } from "@/components/motion/KineticTitle";
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

  const emptyCup: CupState = {
    base: "",
    size: "count-16",
    temp: "iced",
    milk: false,
    shots: 0,
    flavors: 0,
    toppings: [],
    ice: null,
  };
  const total = priced ? formatPeso(priced.unitPrice * quantity) : "-";
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="theme-dark relative flex-1 overflow-clip bg-background"
    >
      {/* Ambient stage lights fading down into the floor. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[38rem] [mask-image:linear-gradient(to_bottom,black,transparent)]"
      >
        <Image
          src="/scenes/stage-lights.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-30"
        />
      </div>

      <div className="relative mx-auto grid w-full max-w-6xl grid-cols-1 gap-x-14 gap-y-8 px-4 pt-8 pb-6 sm:pt-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:grid-rows-[auto_1fr]">
        {/* Live preview: compact strip on phones, sticky stage on desktop. */}
        <aside
          className={`lg:sticky lg:top-20 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:self-start ${
            base ? "" : "hidden lg:block"
          }`}
        >
          <div className="relative overflow-hidden border border-border bg-espresso-deep/70 p-4 backdrop-blur-sm lg:p-6">
            {/* Spotlight cone from above, the drink's glow, the floor. */}
            <span
              aria-hidden
              className="absolute inset-0 hidden bg-[conic-gradient(from_180deg_at_50%_-8%,transparent_158deg,rgb(255_255_255_/_0.09)_180deg,transparent_202deg)] lg:block"
            />
            <span
              aria-hidden
              className="absolute inset-0 opacity-70 transition-[background] duration-700"
              style={{
                background: `radial-gradient(circle at 50% 72%, ${glow} 0%, transparent 58%)`,
              }}
            />
            <span
              aria-hidden
              className="absolute inset-x-[18%] top-[56%] hidden h-10 rounded-[50%] bg-black/50 blur-xl lg:block"
            />

            <div className="relative mb-2 hidden items-center justify-between lg:flex">
              <p className="flex items-center gap-2 eyebrow text-lilac">
                {t.freestyle.preview}
              </p>
              {base && current > 0 && (
                <p className="eyebrow text-foreground/60">
                  {pad(current)} / {pad(reviewStep)}
                </p>
              )}
            </div>

            <div className="relative flex items-center gap-5 lg:flex-col lg:gap-4">
              <div className="h-32 w-24 shrink-0 lg:h-[22rem] lg:w-full">
                <CupPreview
                  state={cup ?? emptyCup}
                  label={cup ? cupLabel : plain.freestyle.preview}
                />
              </div>
              <div className="min-w-0 flex-1 lg:w-full lg:text-center">
                <p className="eyebrow text-lilac lg:hidden">
                  {t.freestyle.preview}
                </p>
                {base && (
                  <p className="mt-1 truncate font-heading text-xl leading-tight font-bold lg:text-2xl">
                    {displayName}
                  </p>
                )}
                <div
                  className={`relative h-14 overflow-hidden lg:h-20 ${base ? "" : "invisible"}`}
                >
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.p
                      key={total}
                      initial={{ y: "100%", opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: "-100%", opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="font-heading text-5xl leading-[1.1] font-black [font-stretch:70%] lg:text-7xl"
                    >
                      {total}
                    </motion.p>
                  </AnimatePresence>
                </div>
                {base && current > 0 && (
                  <button
                    type="button"
                    onClick={() => goTo(0)}
                    className="inline-flex min-h-11 items-center gap-1.5 rounded-md text-sm font-semibold text-lilac outline-none hover:underline focus-visible:ring-3 focus-visible:ring-lilac"
                  >
                    <RotateCcw aria-hidden className="size-4" />
                    {t.freestyle.changeBase}
                  </button>
                )}
              </div>
            </div>

            {/* Running receipt of choices (desktop). */}
            {receipt.length > 0 && (
              <ul className="relative mt-4 hidden flex-wrap justify-center gap-1.5 border-t border-border pt-4 lg:flex">
                <AnimatePresence initial={false}>
                  {receipt.map(({ key, label }) => (
                    <motion.li
                      key={key}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                      className="rounded-md bg-muted px-3 py-1 text-xs font-medium text-foreground/90"
                    >
                      {label}
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            )}
          </div>
        </aside>

        <div className="order-first min-w-0 lg:order-none lg:col-start-2 lg:row-start-1 lg:pt-4">
          <KineticTitle
            text={t.terms.freestyle}
            className="text-[clamp(4rem,11vw,8rem)]"
          />
          {!isPlain && (
            <p className="mt-3 eyebrow text-foreground/70">
              {plain.terms.freestyle}
            </p>
          )}
          <p className="mt-4 max-w-prose text-foreground/80">
            {t.freestyle.intro}
          </p>
        </div>

        <div className="min-w-0 lg:col-start-2 lg:row-start-2">
          {base && current > 0 && (
            <div>
              <div className="flex items-baseline justify-between gap-3">
                <p className="shrink-0 eyebrow whitespace-nowrap text-muted-foreground">
                  {fill(t.freestyle.stepOf, {
                    step: current,
                    total: reviewStep,
                  })}
                </p>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.p
                    key={stepLabel}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="truncate font-heading text-base font-bold"
                  >
                    {stepLabel}
                  </motion.p>
                </AnimatePresence>
              </div>
              {/* Each count is a button: jump straight to any step. */}
              <div className="mt-1 flex gap-1">
                {Array.from({ length: reviewStep }, (_, index) => {
                  const target = steps[index];
                  const label = target
                    ? target.plainLabel
                    : plain.freestyle.review;
                  return (
                    <button
                      key={index}
                      type="button"
                      aria-label={label}
                      aria-current={index + 1 === current ? "step" : undefined}
                      onClick={() => goTo(index + 1)}
                      className="group flex h-11 flex-1 items-center rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring"
                    >
                      <span className="relative h-1.5 w-full overflow-hidden rounded-full bg-muted transition-[height] group-hover:h-2.5">
                        <span
                          className={`absolute inset-0 origin-left rounded-md bg-lilac transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                            index < current ? "scale-x-100" : "scale-x-0"
                          }`}
                        />
                      </span>
                    </button>
                  );
                })}
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
              initial={{ opacity: 0, x: direction * 40, filter: "blur(4px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: direction * -40, filter: "blur(4px)" }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6"
            >
              {current === 0 && (
                <fieldset>
                  <legend className="mb-5 font-heading text-3xl font-extrabold tracking-tight">
                    {t.freestyle.pickBase}
                  </legend>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {bases.map((option, index) => {
                      const active = option.id === baseId;
                      return (
                        <motion.button
                          key={option.id}
                          type="button"
                          aria-pressed={active}
                          aria-label={`${option.plainDescription}, ${fill(plain.freestyle.from, { price: formatPeso(option.basePrice) })}`}
                          onClick={() => chooseBase(option)}
                          initial={{ opacity: 0, y: 24 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.6,
                            delay: 0.15 + index * 0.06,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          className={`group relative aspect-[3/4] overflow-hidden text-left outline-none focus-visible:ring-3 focus-visible:ring-ring active:scale-[0.98] ${
                            active ? "ring-2 ring-lilac" : "ring-1 ring-border"
                          }`}
                        >
                          {option.imageSrc ? (
                            <Image
                              src={option.imageSrc}
                              alt=""
                              fill
                              sizes="(min-width: 1024px) 220px, 45vw"
                              className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
                            />
                          ) : (
                            <span
                              aria-hidden
                              className="absolute inset-0"
                              style={{ background: baseColor(option.slug) }}
                            />
                          )}
                          <span
                            aria-hidden
                            className="absolute inset-0 bg-gradient-to-t from-espresso-deep via-espresso-deep/45 to-transparent"
                          />
                          <span className="absolute top-3 right-3 rounded-md bg-espresso-deep/70 px-2.5 py-1 text-xs font-semibold backdrop-blur">
                            {fill(t.freestyle.from, {
                              price: formatPeso(option.basePrice),
                            })}
                          </span>
                          {active && (
                            <span className="absolute top-3 left-3 flex size-7 items-center justify-center rounded-full bg-lilac text-espresso">
                              <Check aria-hidden className="size-4" />
                            </span>
                          )}
                          <span className="absolute inset-x-0 bottom-0 p-4">
                            <span className="block font-heading text-3xl leading-[0.9] font-black uppercase [font-stretch:64%] sm:text-4xl">
                              {option.name}
                            </span>
                            <span className="mt-1.5 line-clamp-2 block text-xs text-foreground/75">
                              {option.blurb}
                            </span>
                          </span>
                        </motion.button>
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
                <div className="space-y-6">
                  {/* Ticket stub: notches cut where the tear line sits. */}
                  <div
                    className="bg-cream text-espresso shadow-[0_30px_60px_-30px_rgb(0_0_0_/_0.8)]"
                    style={{
                      mask: "radial-gradient(circle at 0 5.5rem, #0000 0.75rem, #000 calc(0.75rem + 0.5px)) left / 51% 100% no-repeat, radial-gradient(circle at 100% 5.5rem, #0000 0.75rem, #000 calc(0.75rem + 0.5px)) right / 51% 100% no-repeat",
                    }}
                  >
                    <div className="flex h-[5.5rem] items-center justify-between gap-4 px-6">
                      <div className="min-w-0">
                        <p className="eyebrow text-roast">
                          {t.freestyle.review}
                        </p>
                        <h2 className="truncate text-2xl leading-tight">
                          {displayName}
                        </h2>
                      </div>
                      <p className="shrink-0 font-heading text-3xl font-black [font-stretch:70%]">
                        {total}
                      </p>
                    </div>
                    <ul className="space-y-2.5 border-t-2 border-dashed border-khaki px-6 pt-5 pb-6">
                      {priced?.choices.map(({ group: g, options }) => (
                        <li
                          key={g.id}
                          className="flex justify-between gap-3 text-sm"
                        >
                          <span className="text-roast">
                            {isPlain ? g.plainLabel : g.danceLabel}
                          </span>
                          <span className="text-right font-semibold">
                            {options
                              .map((o) =>
                                isPlain ? o.plainLabel : o.danceLabel,
                              )
                              .join(", ")}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <label
                      htmlFor="choreo-name"
                      className="block font-heading text-2xl leading-none font-bold tracking-tight"
                    >
                      {t.freestyle.nameLabel}
                    </label>
                    <input
                      id="choreo-name"
                      maxLength={CHOREO_NAME_LIMIT}
                      placeholder={t.freestyle.namePlaceholder}
                      aria-describedby="choreo-name-hint"
                      className="mt-3 h-12 w-full field px-4 text-base"
                      {...register("name")}
                    />
                    <p
                      id="choreo-name-hint"
                      className="mt-1.5 text-sm text-muted-foreground"
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
                          className="size-5 accent-[var(--color-lilac)]"
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
                      className="block font-heading text-2xl leading-none font-bold tracking-tight"
                    >
                      {t.remix.notes}
                    </label>
                    {!isPlain && (
                      <p className="mt-1.5 text-sm text-muted-foreground">
                        {plain.remix.notes}
                      </p>
                    )}
                    <textarea
                      id="freestyle-notes"
                      rows={2}
                      maxLength={NOTES_LIMIT}
                      placeholder={t.drink.notesPlaceholder}
                      className="mt-3 w-full resize-none field px-4 py-3 text-base"
                      {...register("notes")}
                    />
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <QuantityStepper
                      value={quantity}
                      onChange={(value) => setValue("quantity", value)}
                    />
                  </div>

                  {added ? (
                    <motion.div
                      role="status"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-lilac p-5 text-espresso"
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
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Link
                          href={routes.playlist.href}
                          aria-label={plain.drink.viewPlaylist}
                          className="inline-flex min-h-11 items-center rounded-md bg-espresso px-5 text-sm font-semibold text-cream outline-none focus-visible:ring-3 focus-visible:ring-ring"
                        >
                          {t.drink.viewPlaylist}
                        </Link>
                        <button
                          type="button"
                          onClick={startOver}
                          className="inline-flex min-h-11 items-center rounded-md px-5 text-sm font-semibold ring-1 ring-espresso/30 outline-none hover:bg-espresso/10 focus-visible:ring-3 focus-visible:ring-ring"
                        >
                          {t.freestyle.changeBase}
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <Button
                      type="submit"
                      size="lg"
                      aria-label={
                        editItem
                          ? plain.drink.update
                          : plain.drink.addToPlaylist
                      }
                      className="h-auto min-h-16 w-full flex-col gap-0 rounded-md py-2 shadow-[0_18px_40px_-14px_var(--color-purple)]"
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

          {/* Floating control dock: back, running total, next. */}
          {base && current > 0 && (
            <div className="sticky bottom-3 z-20 mt-10">
              <div className="flex items-center gap-2 rounded-full border border-border bg-espresso-deep/80 p-1.5 shadow-[0_24px_50px_-20px_rgb(0_0_0_/_0.9)] backdrop-blur-xl">
                <Button
                  type="button"
                  variant="ghost"
                  size="lg"
                  onClick={() => goTo(current - 1)}
                  className="rounded-md text-foreground hover:bg-muted"
                >
                  <ArrowLeft aria-hidden />
                  {t.freestyle.back}
                </Button>
                <p className="ml-auto px-2 font-heading text-xl font-black [font-stretch:70%] tabular-nums lg:hidden">
                  {total}
                </p>
                {current < reviewStep && (
                  <Button
                    type="button"
                    size="lg"
                    onClick={() => goTo(current + 1)}
                    className="h-auto min-h-12 gap-3 rounded-md py-1.5 pr-4 pl-6 lg:ml-auto"
                  >
                    <span className="text-left leading-tight">
                      <span className="block">{t.freestyle.next}</span>
                      <span className="block max-w-[9rem] truncate text-xs font-medium opacity-80">
                        {nextLabel}
                      </span>
                    </span>
                    <ArrowRight aria-hidden />
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
