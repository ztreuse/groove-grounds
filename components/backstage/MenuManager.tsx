"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import {
  createDrink,
  setDrinkFlag,
  updateDrink,
  updateOption,
} from "@/app/backstage/lineup/actions";
import { DrinkVisual } from "@/components/lineup/DrinkVisual";
import { Button } from "@/components/ui/button";
import { useCopy } from "@/hooks/use-copy";
import type { AdminDrink, AdminMenu } from "@/lib/db/menu-admin";
import { formatPeso } from "@/lib/format";
import { genreBlockFor, genreTerms } from "@/lib/genres";
import type { DrinkFormValues } from "@/lib/menu-schema";
import { DrinkForm } from "./DrinkForm";
import { Switch } from "./Switch";

type Tab = "drinks" | "options";

// Owner's menu manager: every item by genre with Spotlight and Sitting out
// switches and an inline editor, plus the Remix options with their add-on
// prices and availability. Saves go straight to the live menu.
export function MenuManager({ menu }: { menu: AdminMenu }) {
  const { t, plain, isPlain } = useCopy();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("drinks");
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  const genreLabel = (genre: AdminMenu["genres"][number]) => {
    const term = genreTerms[genre.slug];
    return term ? t.terms[term] : genre.name;
  };
  const genrePlain = (genre: AdminMenu["genres"][number]) => {
    const term = genreTerms[genre.slug];
    return term ? plain.terms[term] : genre.name;
  };

  async function saved(ok: boolean, message = t.menu.saved) {
    if (ok) {
      toast(message);
      router.refresh();
    } else {
      toast(t.menu.saveFailed);
    }
  }

  async function saveDrink(id: string, values: DrinkFormValues) {
    const result = await updateDrink(id, values);
    await saved(result.ok);
    if (result.ok) setEditing(null);
  }

  async function addDrink(values: DrinkFormValues & { genreId: string }) {
    const result = await createDrink(values);
    await saved(result.ok, t.menu.added);
    if (result.ok) setAdding(false);
  }

  const tabs: { value: Tab; label: string; ariaLabel: string }[] = [
    {
      value: "drinks",
      label: t.menu.drinksTab,
      ariaLabel: plain.menu.drinksTab,
    },
    {
      value: "options",
      label: t.menu.optionsTab,
      ariaLabel: plain.menu.optionsTab,
    },
  ];

  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          role="tablist"
          className="inline-flex rounded-md bg-muted p-1 ring-1 ring-border ring-inset"
        >
          {tabs.map((option) => {
            const active = option.value === tab;
            return (
              <button
                key={option.value}
                type="button"
                role="tab"
                aria-selected={active}
                aria-label={option.ariaLabel}
                onClick={() => setTab(option.value)}
                className={`relative min-h-10 rounded-sm px-4 text-sm font-semibold outline-none focus-visible:ring-3 focus-visible:ring-ring ${
                  active
                    ? "text-background"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {active && (
                  <motion.span
                    aria-hidden
                    layoutId="menu-tab"
                    transition={{ type: "spring", stiffness: 500, damping: 40 }}
                    className="absolute inset-0 rounded-sm bg-foreground"
                  />
                )}
                <span className="relative label-display text-[15px]">
                  {option.label}
                </span>
              </button>
            );
          })}
        </div>
        {tab === "drinks" && !adding && (
          <Button
            size="lg"
            onClick={() => setAdding(true)}
            aria-label={plain.menu.addDrink}
          >
            <Plus aria-hidden />
            {t.menu.addDrink}
          </Button>
        )}
      </div>

      {tab === "drinks" && (
        <>
          {adding && (
            <div className="mt-6 surface p-4 sm:p-6">
              <h2 className="text-2xl leading-none">{t.menu.addDrink}</h2>
              <DrinkForm
                genres={menu.genres.map((genre) => ({
                  id: genre.id,
                  label: genreLabel(genre),
                }))}
                defaults={{
                  genreId: menu.genres[0]?.id ?? "",
                  name: "",
                  danceStyle: "",
                  plainDescription: "",
                  blurb: "",
                  basePrice: 150,
                  tempsAllowed: ["hot", "iced"],
                }}
                onSubmit={addDrink}
                onCancel={() => setAdding(false)}
              />
            </div>
          )}

          {menu.genres.map((genre) => {
            const items = menu.drinks.filter((d) => d.genreId === genre.id);
            if (items.length === 0) return null;
            return (
              <section
                key={genre.id}
                aria-labelledby={`menu-${genre.slug}`}
                className="mt-10"
              >
                <div className="mb-3 flex items-end gap-3 border-b border-border pb-3">
                  <span
                    aria-hidden
                    className={`size-3 shrink-0 rounded-full ${genreBlockFor(genre.slug)}`}
                  />
                  <h2
                    id={`menu-${genre.slug}`}
                    className="text-3xl leading-none"
                  >
                    {genreLabel(genre)}
                  </h2>
                  {!isPlain && genrePlain(genre) !== genreLabel(genre) && (
                    <span className="pb-0.5 text-sm text-muted-foreground">
                      {genrePlain(genre)}
                    </span>
                  )}
                  <span className="ml-auto pb-0.5 label-display text-sm text-muted-foreground">
                    {items.length}
                  </span>
                </div>
                <ul className="divide-y divide-border">
                  {items.map((drink) => (
                    <DrinkRow
                      key={drink.id}
                      drink={drink}
                      editing={editing === drink.id}
                      onEdit={() =>
                        setEditing(editing === drink.id ? null : drink.id)
                      }
                      onSave={(values) => saveDrink(drink.id, values)}
                      onFlag={async (field, value) => {
                        const result = await setDrinkFlag({
                          id: drink.id,
                          field,
                          value,
                        });
                        await saved(result.ok);
                      }}
                    />
                  ))}
                </ul>
              </section>
            );
          })}
        </>
      )}

      {tab === "options" && (
        <div className="mt-6 grid gap-x-10 gap-y-8 lg:grid-cols-2">
          {menu.groups.map((group) => (
            <section key={group.id} aria-labelledby={`group-${group.slug}`}>
              <div className="mb-2 border-b border-border pb-2">
                <h2
                  id={`group-${group.slug}`}
                  className="text-2xl leading-none"
                >
                  {isPlain ? group.plainLabel : group.danceLabel}
                </h2>
                {!isPlain && group.plainLabel !== group.danceLabel && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {group.plainLabel}
                  </p>
                )}
              </div>
              <ul className="divide-y divide-border">
                {group.options.map((option) => (
                  <OptionRow
                    key={option.id}
                    option={option}
                    onSave={async (values) => {
                      const result = await updateOption({
                        id: option.id,
                        ...values,
                      });
                      await saved(result.ok);
                    }}
                  />
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

type DrinkRowProps = {
  drink: AdminDrink;
  editing: boolean;
  onEdit: () => void;
  onSave: (values: DrinkFormValues) => Promise<void>;
  onFlag: (
    field: "isAvailable" | "isFeatured",
    value: boolean,
  ) => Promise<void>;
};

function DrinkRow({ drink, editing, onEdit, onSave, onFlag }: DrinkRowProps) {
  const { t, plain } = useCopy();
  // Optimistic switches; the server result refreshes the page.
  const [available, setAvailable] = useState(drink.isAvailable);
  const [featured, setFeatured] = useState(drink.isFeatured);

  return (
    <li className="py-3">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <div
          className={`relative size-14 shrink-0 overflow-hidden ${
            drink.isAvailable ? "" : "grayscale"
          }`}
        >
          <DrinkVisual drink={drink} sizes="56px" />
        </div>
        <div className="min-w-0 flex-1 basis-48">
          <p className="truncate label-display text-lg leading-tight">
            {drink.name}
          </p>
          <p className="truncate text-sm text-muted-foreground">
            {drink.danceStyle} · {drink.plainDescription}
          </p>
        </div>
        <p className="font-heading text-xl font-black [font-stretch:70%] tabular-nums">
          {formatPeso(drink.basePrice)}
        </p>
        <div className="flex flex-wrap items-center gap-x-3">
          <Switch
            checked={featured}
            label={t.menu.spotlight}
            ariaLabel={`${plain.menu.spotlight}: ${drink.name}`}
            onChange={(next) => {
              setFeatured(next);
              void onFlag("isFeatured", next);
            }}
          />
          <Switch
            checked={available}
            label={available ? t.menu.onTheFloor : t.terms.sittingOut}
            ariaLabel={`${plain.menu.onTheFloor}: ${drink.name}`}
            onChange={(next) => {
              setAvailable(next);
              void onFlag("isAvailable", next);
            }}
          />
          <Button
            variant="outline"
            onClick={onEdit}
            aria-expanded={editing}
            aria-label={`${plain.menu.edit}: ${drink.name}`}
          >
            <Pencil aria-hidden />
            {t.menu.edit}
          </Button>
        </div>
      </div>
      {editing && (
        <div className="mt-3">
          <DrinkForm
            defaults={{
              genreId: drink.genreId,
              name: drink.name,
              danceStyle: drink.danceStyle,
              plainDescription: drink.plainDescription,
              blurb: drink.blurb,
              basePrice: drink.basePrice,
              tempsAllowed: drink.tempsAllowed,
            }}
            onSubmit={onSave}
            onCancel={onEdit}
          />
        </div>
      )}
    </li>
  );
}

type OptionRowProps = {
  option: AdminMenu["groups"][number]["options"][number];
  onSave: (values: {
    priceDelta: number;
    isAvailable: boolean;
  }) => Promise<void>;
};

function OptionRow({ option, onSave }: OptionRowProps) {
  const { t, plain, isPlain } = useCopy();
  const [price, setPrice] = useState(String(option.priceDelta));
  const [available, setAvailable] = useState(option.isAvailable);
  const label = isPlain ? option.plainLabel : option.danceLabel;
  const valid = /^\d{1,4}$/.test(price);

  function commit(
    next = { priceDelta: Number(price), isAvailable: available },
  ) {
    if (!/^\d{1,4}$/.test(String(next.priceDelta))) return;
    void onSave(next);
  }

  return (
    <li className="flex flex-wrap items-center gap-x-4 gap-y-1 py-2">
      <div className="min-w-0 flex-1 basis-40">
        <p className="label-display text-base leading-tight">{label}</p>
        {!isPlain && option.plainLabel !== option.danceLabel && (
          <p className="text-xs text-muted-foreground">{option.plainLabel}</p>
        )}
      </div>
      <label className="flex items-center gap-2 text-sm font-semibold">
        <span className="text-muted-foreground">{t.menu.priceDelta}</span>
        <input
          type="number"
          inputMode="numeric"
          min={0}
          step={1}
          value={price}
          aria-invalid={!valid}
          aria-label={`${plain.menu.priceDelta}: ${option.plainLabel}`}
          onChange={(event) => setPrice(event.target.value)}
          onBlur={() => {
            if (valid && Number(price) !== option.priceDelta) commit();
          }}
          className="h-11 w-20 field px-3 text-right tabular-nums"
        />
      </label>
      <Switch
        checked={available}
        label={available ? t.menu.onTheFloor : t.terms.sittingOut}
        ariaLabel={`${plain.menu.onTheFloor}: ${option.plainLabel}`}
        onChange={(next) => {
          setAvailable(next);
          commit({
            priceDelta: valid ? Number(price) : option.priceDelta,
            isAvailable: next,
          });
        }}
      />
    </li>
  );
}
