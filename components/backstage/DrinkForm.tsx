"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthField } from "@/components/auth/AuthField";
import { IconTile } from "@/components/layout/IconTile";
import { Button } from "@/components/ui/button";
import { useCopy } from "@/hooks/use-copy";
import {
  newDrinkSchema,
  TEMPS,
  type DrinkFormValues,
  type NewDrinkInput,
} from "@/lib/menu-schema";
import { tempStyles } from "@/lib/temps";

type GenreChoice = { id: string; label: string };

type DrinkFormProps = {
  // Present when adding a new item: the genre picker shows.
  genres?: GenreChoice[];
  defaults: NewDrinkInput;
  onSubmit: (values: DrinkFormValues & { genreId: string }) => Promise<void>;
  onCancel: () => void;
};

// Edit or add a menu item: name, dance style, descriptions, base price and
// the temperatures it's served at (empty = a snack).
export function DrinkForm({
  genres,
  defaults,
  onSubmit,
  onCancel,
}: DrinkFormProps) {
  const { t, plain } = useCopy();
  const isNew = Boolean(genres);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NewDrinkInput, unknown, DrinkFormValues & { genreId: string }>({
    // Edits carry the current genreId too; the server ignores it there.
    resolver: zodResolver(newDrinkSchema),
    defaultValues: defaults,
  });

  const message = (key?: string) =>
    key === "required" || key === "priceInvalid" ? t.menu[key] : null;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="grid gap-4 border-t border-border pt-4 sm:grid-cols-2"
    >
      {genres && (
        <div className="sm:col-span-2">
          <label htmlFor="genreId" className="mb-1 block text-sm font-semibold">
            {t.menu.genre}
          </label>
          <select
            id="genreId"
            className="h-12 w-full field px-3 text-base"
            {...register("genreId")}
          >
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.label}
              </option>
            ))}
          </select>
        </div>
      )}
      <AuthField
        id="name"
        label={t.menu.name}
        error={message(errors.name?.message)}
        register={register("name")}
      />
      <AuthField
        id="danceStyle"
        label={t.menu.danceStyle}
        error={message(errors.danceStyle?.message)}
        register={register("danceStyle")}
      />
      <div className="sm:col-span-2">
        <AuthField
          id="plainDescription"
          label={t.menu.plainDescription}
          error={message(errors.plainDescription?.message)}
          register={register("plainDescription")}
        />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="blurb" className="mb-1 block text-sm font-semibold">
          {t.menu.blurb}
        </label>
        <textarea
          id="blurb"
          rows={2}
          aria-invalid={!!errors.blurb}
          className="w-full resize-none field px-4 py-3 text-base"
          {...register("blurb")}
        />
        {errors.blurb && (
          <p className="mt-1 text-sm text-destructive">
            {message(errors.blurb.message)}
          </p>
        )}
      </div>
      <AuthField
        id="basePrice"
        type="number"
        inputMode="numeric"
        min={0}
        step={1}
        label={t.menu.basePrice}
        error={message(errors.basePrice?.message)}
        register={register("basePrice")}
      />
      <fieldset>
        <legend className="mb-1 block text-sm font-semibold">
          {t.menu.temps}
        </legend>
        <div className="flex flex-wrap gap-2">
          {TEMPS.map((temp) => {
            const style = tempStyles[temp];
            return (
              <label
                key={temp}
                className="flex min-h-11 cursor-pointer items-center gap-2 rounded-md bg-muted py-1 pr-3 pl-1.5 text-sm font-semibold has-checked:ring-2 has-checked:ring-primary has-focus-visible:ring-3 has-focus-visible:ring-ring"
              >
                <input
                  type="checkbox"
                  value={temp}
                  aria-label={plain.remix[style.key]}
                  className="sr-only"
                  {...register("tempsAllowed")}
                />
                <IconTile
                  icon={style.icon}
                  tone="custom"
                  className={style.accent}
                  size="sm"
                />
                {t.remix[style.key]}
              </label>
            );
          })}
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{t.menu.snack}</p>
      </fieldset>
      {isNew && (
        <p className="text-sm text-muted-foreground sm:col-span-2">
          {t.menu.newNote}
        </p>
      )}
      <div className="flex flex-wrap justify-end gap-2 sm:col-span-2">
        <Button type="button" variant="outline" size="lg" onClick={onCancel}>
          {t.menu.cancel}
        </Button>
        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isNew ? t.menu.addDrink : t.menu.save}
        </Button>
      </div>
    </form>
  );
}
