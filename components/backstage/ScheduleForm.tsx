"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";
import { saveSchedule } from "@/app/backstage/schedule/actions";
import { AuthField } from "@/components/auth/AuthField";
import { Button } from "@/components/ui/button";
import { useCopy } from "@/hooks/use-copy";
import { fill } from "@/lib/copy";
import { formatClock, formatDay } from "@/lib/format";
import type { ScheduleRules } from "@/lib/schedule";
import {
  SLOT_LENGTHS,
  scheduleFormSchema,
  toHHMM,
  toMinutes,
  type ScheduleFormInput,
  type ScheduleFormValues,
} from "@/lib/schedule-schema";

// Owner's class schedule: hours, slot length and capacity, booking window,
// minimum notice and blackout dates, with a live preview of the day.
export function ScheduleForm({ rules }: { rules: ScheduleRules }) {
  const { t, plain } = useCopy();
  const router = useRouter();
  const [newDate, setNewDate] = useState("");
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ScheduleFormInput, unknown, ScheduleFormValues>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: {
      opens: toHHMM(rules.openMinute),
      closes: toHHMM(rules.closeMinute),
      slotMinutes: rules.slotMinutes,
      slotCapacity: rules.slotCapacity,
      daysAhead: rules.daysAhead,
      leadMinutes: rules.leadMinutes,
      blackoutDates: rules.blackoutDates,
    },
  });
  const values = useWatch({ control });
  const blackouts = values.blackoutDates ?? [];

  // Preview: how many classes a day and when the last one starts.
  const open = toMinutes(values.opens || "00:00");
  const close = toMinutes(values.closes || "00:00");
  const step = Number(values.slotMinutes) || 15;
  const count = close > open ? Math.ceil((close - open) / step) : 0;
  const last = open + (count - 1) * step;

  const onSubmit = handleSubmit(async (form) => {
    const result = await saveSchedule(form);
    if (result.ok) {
      toast(t.scheduleAdmin.saved);
      router.refresh();
    } else {
      toast(t.scheduleAdmin.saveFailed);
    }
  });

  function addDate() {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(newDate) || blackouts.includes(newDate)) {
      return;
    }
    setValue("blackoutDates", [...blackouts, newDate].sort(), {
      shouldDirty: true,
    });
    setNewDate("");
  }

  const closesError =
    errors.closes?.message === "closeAfterOpen"
      ? t.scheduleAdmin.closeAfterOpen
      : null;

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="mt-8 grid gap-10 lg:grid-cols-2"
    >
      <section aria-labelledby="hours" className="space-y-4">
        <h2
          id="hours"
          className="border-b border-border pb-2 text-2xl leading-none"
        >
          {t.scheduleAdmin.hoursTitle}
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <AuthField
            id="opens"
            type="time"
            label={t.scheduleAdmin.opens}
            register={register("opens")}
          />
          <AuthField
            id="closes"
            type="time"
            label={t.scheduleAdmin.closes}
            error={closesError}
            register={register("closes")}
          />
        </div>

        <h2 className="border-b border-border pt-4 pb-2 text-2xl leading-none">
          {t.scheduleAdmin.slotsTitle}
        </h2>
        <fieldset>
          <legend className="mb-1 block text-sm font-semibold">
            {t.scheduleAdmin.slotMinutes}
          </legend>
          <div className="flex flex-wrap gap-2">
            {SLOT_LENGTHS.map((length) => (
              <label
                key={length}
                className="flex min-h-11 cursor-pointer items-center rounded-md bg-muted px-4 text-sm font-semibold has-checked:bg-foreground has-checked:text-background has-focus-visible:ring-3 has-focus-visible:ring-ring"
              >
                {/* Controlled so the saved length starts checked. */}
                <input
                  type="radio"
                  name="slotMinutes"
                  value={length}
                  checked={String(values.slotMinutes) === String(length)}
                  onChange={() =>
                    setValue("slotMinutes", length, { shouldDirty: true })
                  }
                  className="sr-only"
                />
                {fill(t.scheduleAdmin.minutes, { count: length })}
              </label>
            ))}
          </div>
        </fieldset>
        <div className="grid grid-cols-2 gap-4">
          <AuthField
            id="slotCapacity"
            type="number"
            inputMode="numeric"
            min={1}
            max={50}
            label={t.scheduleAdmin.capacity}
            register={register("slotCapacity")}
          />
          <AuthField
            id="daysAhead"
            type="number"
            inputMode="numeric"
            min={1}
            max={30}
            label={t.scheduleAdmin.daysAhead}
            register={register("daysAhead")}
          />
          <AuthField
            id="leadMinutes"
            type="number"
            inputMode="numeric"
            min={0}
            max={240}
            label={t.scheduleAdmin.lead}
            register={register("leadMinutes")}
          />
        </div>
        {count > 0 && (
          <p className="rounded-md bg-muted px-4 py-3 text-sm font-medium">
            {fill(t.scheduleAdmin.preview, {
              count,
              time: formatClock(last),
            })}
          </p>
        )}
      </section>

      <section aria-labelledby="blackouts" className="space-y-4">
        <h2
          id="blackouts"
          className="border-b border-border pb-2 text-2xl leading-none"
        >
          {t.scheduleAdmin.blackoutTitle}
        </h2>
        <p className="text-sm text-muted-foreground">
          {t.scheduleAdmin.blackoutBody}
        </p>
        <div className="flex gap-2">
          <input
            type="date"
            value={newDate}
            onChange={(event) => setNewDate(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addDate();
              }
            }}
            aria-label={plain.scheduleAdmin.blackoutTitle}
            className="h-12 min-w-0 flex-1 field px-4 text-base"
          />
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={addDate}
            aria-label={plain.scheduleAdmin.addBlackout}
          >
            <Plus aria-hidden />
            {t.scheduleAdmin.addBlackout}
          </Button>
        </div>
        {blackouts.length === 0 ? (
          <p className="rounded-md bg-muted/60 p-4 text-sm text-muted-foreground">
            {t.scheduleAdmin.noBlackouts}
          </p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {blackouts.map((date) => (
              <li key={date}>
                <span className="inline-flex min-h-11 items-center gap-1 rounded-md bg-card py-1 pr-1 pl-3 text-sm font-semibold ring-1 ring-border ring-inset">
                  {formatDay(date)}
                  <button
                    type="button"
                    aria-label={fill(plain.scheduleAdmin.removeBlackout, {
                      date: formatDay(date),
                    })}
                    onClick={() =>
                      setValue(
                        "blackoutDates",
                        blackouts.filter((d) => d !== date),
                        { shouldDirty: true },
                      )
                    }
                    className="flex size-9 items-center justify-center rounded-sm text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring"
                  >
                    <X aria-hidden className="size-4" />
                  </button>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="flex justify-end border-t border-border pt-6 lg:col-span-2">
        <Button type="submit" size="lg" disabled={isSubmitting}>
          {t.scheduleAdmin.save}
        </Button>
      </div>
    </form>
  );
}
