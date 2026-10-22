"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getCheckoutPrefill } from "@/app/(shop)/showtime/actions";
import { submitCrewRequest } from "@/app/(shop)/crew/actions";
import { AuthField } from "@/components/auth/AuthField";
import { CrewIcon } from "@/components/icons/GrooveIcons";
import { IconTile } from "@/components/layout/IconTile";
import { Button } from "@/components/ui/button";
import { useCopy } from "@/hooks/use-copy";
import { fill, type Copy } from "@/lib/copy";
import {
  CREW_LEAD_DAYS,
  CREW_MAX_DAYS,
  CREW_MAX_HEADCOUNT,
  CREW_MIN_HEADCOUNT,
  CREW_TEXT_LIMIT,
  crewFormSchema,
  type CrewForm as CrewFormValues,
  type CrewFormInput,
} from "@/lib/crew";
import { formatClock } from "@/lib/format";
import { dayKey } from "@/lib/schedule";
import { toHHMM } from "@/lib/schedule-schema";

type CrewFormProps = { openMinute: number; closeMinute: number };

const DAY = 24 * 60 * 60 * 1000;
const noopSubscribe = () => () => {};

function crewDateRange() {
  const now = Date.now();
  return {
    min: dayKey(new Date(now + (CREW_LEAD_DAYS + 1) * DAY)),
    max: dayKey(new Date(now + CREW_MAX_DAYS * DAY)),
  };
}

// Crew Order request: who, when and how many, what drinks. Lead time and
// hours are checked again on the server; members get their details filled.
export function CrewForm({ openMinute, closeMinute }: CrewFormProps) {
  const { t, plain } = useCopy();
  const router = useRouter();
  const [serverError, setServerError] = useState<keyof Copy["crew"] | null>(
    null,
  );
  // Date limits read the clock, so only compute them in the browser
  // (never while prerendering).
  const mounted = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
  const dateRange = mounted ? crewDateRange() : undefined;
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<CrewFormInput, unknown, CrewFormValues>({
    resolver: zodResolver(crewFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      date: "",
      time: toHHMM(Math.max(openMinute, 10 * 60)),
      headcount: 15,
      drinkMix: "",
      budget: "",
      details: "",
    },
  });

  useEffect(() => {
    getCheckoutPrefill().then((prefill) => {
      if (prefill) reset({ ...getValues(), ...prefill });
    });
  }, [reset, getValues]);

  const vars = {
    days: CREW_LEAD_DAYS,
    min: CREW_MIN_HEADCOUNT,
    max: CREW_MAX_HEADCOUNT,
    open: formatClock(openMinute),
    close: formatClock(closeMinute),
  };
  const message = (key?: string) =>
    key && key in t.crew
      ? fill(t.crew[key as keyof Copy["crew"]] as string, vars)
      : null;

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    const result = await submitCrewRequest(values);
    if (!result.ok) {
      setServerError(result.error);
      return;
    }
    router.push(`/crew/requests/${result.id}`);
  });

  // Legends don't pick up the h2 base style, so spell it out.
  const section =
    "border-b border-border pb-2 font-heading text-2xl leading-none font-extrabold tracking-tight";

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-10">
      <div className="flex items-start gap-4 rounded-md bg-accent p-4 text-accent-foreground">
        <IconTile icon={CrewIcon} tone="inherit" />
        <p className="pt-1.5 text-sm font-medium">
          {fill(t.crew.leadTime, vars)}
        </p>
      </div>

      <fieldset className="space-y-4">
        <legend className={`${section} mb-4 w-full`}>{t.crew.who}</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <AuthField
            id="name"
            label={t.crew.name}
            autoComplete="name"
            error={message(errors.name?.message)}
            register={register("name")}
          />
          <AuthField
            id="phone"
            type="tel"
            inputMode="tel"
            label={t.crew.phone}
            autoComplete="tel"
            placeholder={t.showtime.phonePlaceholder}
            error={message(errors.phone?.message)}
            register={register("phone")}
          />
        </div>
        <AuthField
          id="email"
          type="email"
          inputMode="email"
          label={t.crew.email}
          autoComplete="email"
          error={message(errors.email?.message)}
          register={register("email")}
        />
      </fieldset>

      <fieldset className="space-y-4">
        <legend className={`${section} mb-4 w-full`}>{t.crew.when}</legend>
        <div className="grid gap-4 sm:grid-cols-3">
          <AuthField
            id="date"
            type="date"
            min={dateRange?.min}
            max={dateRange?.max}
            label={t.crew.date}
            error={
              errors.date || serverError === "errorDate"
                ? fill(t.crew.errorDate, vars)
                : null
            }
            register={register("date")}
          />
          <AuthField
            id="time"
            type="time"
            step={900}
            min={toHHMM(openMinute)}
            max={toHHMM(closeMinute)}
            label={t.crew.time}
            error={
              errors.time || serverError === "errorTime"
                ? fill(t.crew.errorTime, vars)
                : null
            }
            register={register("time")}
          />
          <AuthField
            id="headcount"
            type="number"
            inputMode="numeric"
            min={CREW_MIN_HEADCOUNT}
            max={CREW_MAX_HEADCOUNT}
            label={t.crew.headcount}
            hint={fill(t.crew.headcountHint, vars)}
            error={message(errors.headcount?.message)}
            register={register("headcount")}
          />
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className={`${section} mb-4 w-full`}>{t.crew.what}</legend>
        <div>
          <label
            htmlFor="drinkMix"
            className="mb-1 block text-sm font-semibold"
          >
            {t.crew.drinkMix}
          </label>
          <textarea
            id="drinkMix"
            rows={3}
            maxLength={CREW_TEXT_LIMIT}
            placeholder={t.crew.drinkMixPlaceholder}
            aria-invalid={!!errors.drinkMix}
            className="w-full resize-none field px-4 py-3 text-base"
            {...register("drinkMix")}
          />
          {errors.drinkMix && (
            <p className="mt-1 text-sm text-destructive">
              {message(errors.drinkMix.message)}
            </p>
          )}
        </div>
        <div className="grid gap-4 sm:grid-cols-[1fr_2fr]">
          <AuthField
            id="budget"
            type="number"
            inputMode="numeric"
            min={0}
            label={t.crew.budget}
            register={register("budget")}
          />
          <div>
            <label
              htmlFor="details"
              className="mb-1 block text-sm font-semibold"
            >
              {t.crew.details}
            </label>
            <textarea
              id="details"
              rows={2}
              maxLength={CREW_TEXT_LIMIT}
              placeholder={t.crew.detailsPlaceholder}
              className="w-full resize-none field px-4 py-3 text-base"
              {...register("details")}
            />
          </div>
        </div>
      </fieldset>

      {serverError === "errorGeneric" && (
        <p
          role="alert"
          className="rounded-md bg-destructive/10 p-3 text-sm text-destructive"
        >
          {t.crew.errorGeneric}
        </p>
      )}

      <div className="flex justify-end border-t border-border pt-6">
        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          aria-label={plain.crew.submit}
          className="h-auto min-h-14 px-8 text-base font-bold"
        >
          {isSubmitting ? t.crew.sending : t.crew.submit}
        </Button>
      </div>
    </form>
  );
}
