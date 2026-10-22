"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarClock, Zap } from "lucide-react";
import { createOrder, getCheckoutPrefill } from "@/app/(shop)/showtime/actions";
import { CountIn } from "@/components/layout/CountIn";
import { Button } from "@/components/ui/button";
import { useCopy } from "@/hooks/use-copy";
import { usePlaylistHydrated } from "@/hooks/use-playlist-hydrated";
import {
  checkoutFormSchema,
  NOTES_LIMIT,
  type CheckoutForm,
  type CheckoutFormInput,
  type CreateOrderResult,
} from "@/lib/checkout";
import { fill, type Copy } from "@/lib/copy";
import { formatDay, formatPeso, formatTime } from "@/lib/format";
import { getOrderIntent } from "@/lib/order-intent";
import { routes } from "@/lib/routes";
import { dayKey, schedule } from "@/lib/schedule";
import { isDrinkItem, usePlaylist } from "@/stores/playlist";
import { OrderSummary } from "./OrderSummary";
import { PaymentOptions } from "./PaymentOptions";
import { SlotPicker } from "./SlotPicker";

// The simulated payment takes about two seconds.
const DEMO_PAY_MS = 2000;
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type ErrorKey = Extract<CreateOrderResult, { ok: false }>["error"];

const inputClass = "field h-12 w-full px-4 text-base";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t pt-6">
      <h2 className="mb-4 text-3xl leading-none">{title}</h2>
      {children}
    </section>
  );
}

export function ShowtimeForm() {
  const { t, plain, isPlain } = useCopy();
  const router = useRouter();
  const hydrated = usePlaylistHydrated();
  const items = usePlaylist((state) => state.items);
  const clear = usePlaylist((state) => state.clear);
  const [processing, setProcessing] = useState(false);
  const [serverError, setServerError] = useState<{
    key: ErrorKey;
    itemName?: string;
  } | null>(null);
  const [slotRefresh, setSlotRefresh] = useState(0);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<CheckoutFormInput, unknown, CheckoutForm>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      orderType: "drop_in",
      slotStart: "",
      name: "",
      phone: "",
      notes: "",
      paymentMethod: "demo_gcash",
    },
  });
  // Preselect Book a Class when the visitor came from that home button.
  useEffect(() => {
    if (getOrderIntent() === "class") setValue("orderType", "class");
  }, [setValue]);

  // Signed-in members: fill in name and number if still empty.
  useEffect(() => {
    getCheckoutPrefill().then((prefill) => {
      if (!prefill) return;
      if (!getValues("name")) setValue("name", prefill.name);
      if (!getValues("phone")) setValue("phone", prefill.phone);
    });
  }, [getValues, setValue]);

  const orderType = useWatch({ control, name: "orderType" });
  const slotStart = useWatch({ control, name: "slotStart" });
  const paymentMethod = useWatch({ control, name: "paymentMethod" });

  const subtotal = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );
  const drinkCount = items
    .filter(isDrinkItem)
    .reduce((sum, item) => sum + item.quantity, 0);
  const isClass = orderType === "class";
  const tooManyForClass = isClass && drinkCount > schedule.slotCapacity;

  const pickupLabel = isClass
    ? slotStart
      ? `${formatDay(dayKey(new Date(slotStart)))}, ${formatTime(slotStart)}`
      : "-"
    : t.showtime.dropInHint;

  const errorText = (key?: string) =>
    key && key in t.showtime ? t.showtime[key as keyof Copy["showtime"]] : null;

  const onSubmit = handleSubmit(async () => {
    setServerError(null);
    setProcessing(true);
    const [result] = await Promise.all([
      createOrder({
        // The server validates and normalizes the raw form values itself.
        form: getValues(),
        items: items.map((item) => ({
          drinkId: item.drinkId,
          quantity: item.quantity,
          selection: item.selection,
          notes: item.notes,
          name: item.choreoName,
        })),
      }).catch((): CreateOrderResult => ({ ok: false, error: "errorGeneric" })),
      wait(DEMO_PAY_MS),
    ]);

    if (result.ok) {
      clear();
      router.replace(`/track/${result.orderId}`);
      return;
    }
    setProcessing(false);
    setServerError({ key: result.error, itemName: result.itemName });
    if (result.error === "errorSlotFull") {
      setValue("slotStart", "");
      setSlotRefresh((n) => n + 1);
    }
  });

  if (!hydrated) return <CountIn />;

  if (items.length === 0) {
    return (
      <div className="mt-10 rounded-3xl bg-muted/60 px-6 py-12 text-center">
        <h2 className="text-3xl">{t.playlist.emptyTitle}</h2>
        <p className="mt-2 text-muted-foreground">{t.playlist.emptyBody}</p>
        <Button asChild size="lg" className="mt-6">
          <Link href={routes.lineup.href} aria-label={plain.playlist.browse}>
            {t.playlist.browse}
          </Link>
        </Button>
      </div>
    );
  }

  const orderTypes = [
    { value: "drop_in", term: "dropIn", icon: Zap },
    { value: "class", term: "bookAClass", icon: CalendarClock },
  ] as const;

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-12"
    >
      <div className="min-w-0 space-y-8">
        <Section title={t.showtime.orderType}>
          <div
            role="radiogroup"
            aria-label={plain.showtime.orderType}
            className="grid gap-3 sm:grid-cols-2"
          >
            {orderTypes.map(({ value, term, icon: Icon }) => {
              const active = orderType === value;
              return (
                <label
                  key={value}
                  className={`flex min-h-20 cursor-pointer items-center gap-3 rounded-3xl p-4 transition-colors has-focus-visible:ring-3 has-focus-visible:ring-ring ${
                    active
                      ? "bg-espresso text-cream shadow-[0_18px_40px_-24px_rgb(59_42_32_/_0.7)] dark:bg-cream dark:text-espresso"
                      : "surface hover:bg-accent/40"
                  }`}
                >
                  <input
                    type="radio"
                    value={value}
                    aria-label={plain.terms[term]}
                    className="sr-only"
                    {...register("orderType")}
                  />
                  <Icon aria-hidden className="size-6 shrink-0" />
                  <span>
                    <span className="block font-heading text-2xl leading-none tracking-tight">
                      {t.terms[term]}
                    </span>
                    {!isPlain && (
                      <span className="mt-1 block text-sm">
                        {plain.terms[term]}
                      </span>
                    )}
                  </span>
                </label>
              );
            })}
          </div>

          {isClass ? (
            <>
              {tooManyForClass ? (
                <p className="mt-4 rounded-2xl bg-destructive/10 p-4 text-sm text-destructive">
                  {fill(t.showtime.tooManyDrinks, {
                    max: schedule.slotCapacity,
                  })}
                </p>
              ) : (
                <SlotPicker
                  value={slotStart}
                  onChange={(value) =>
                    setValue("slotStart", value, { shouldValidate: !!value })
                  }
                  drinkCount={drinkCount}
                  refreshToken={slotRefresh}
                />
              )}
              {errors.slotStart && (
                <p role="alert" className="mt-2 text-sm text-destructive">
                  {errorText(errors.slotStart.message)}
                </p>
              )}
            </>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              {t.showtime.dropInHint}
            </p>
          )}
        </Section>

        <Section title={t.showtime.details}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="mb-1 block text-sm font-semibold"
              >
                {t.showtime.name}
              </label>
              <input
                id="name"
                autoComplete="name"
                placeholder={t.showtime.namePlaceholder}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
                className={inputClass}
                {...register("name")}
              />
              {errors.name && (
                <p id="name-error" className="mt-1 text-sm text-destructive">
                  {errorText(errors.name.message)}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="phone"
                className="mb-1 block text-sm font-semibold"
              >
                {t.showtime.phone}
              </label>
              <input
                id="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder={t.showtime.phonePlaceholder}
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? "phone-error" : undefined}
                className={inputClass}
                {...register("phone")}
              />
              {errors.phone && (
                <p id="phone-error" className="mt-1 text-sm text-destructive">
                  {errorText(errors.phone.message)}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="notes"
                className="mb-1 block text-sm font-semibold"
              >
                {t.remix.notes}
                {!isPlain && (
                  <span className="ml-2 font-normal text-muted-foreground">
                    {plain.remix.notes}
                  </span>
                )}
              </label>
              <textarea
                id="notes"
                rows={2}
                maxLength={NOTES_LIMIT}
                placeholder={t.showtime.notesPlaceholder}
                className={`${inputClass} h-auto resize-none py-2`}
                {...register("notes")}
              />
            </div>
          </div>
        </Section>

        <Section title={t.showtime.payment}>
          <PaymentOptions
            value={paymentMethod}
            register={register("paymentMethod")}
          />
        </Section>
      </div>

      <div className="lg:sticky lg:top-24 lg:self-start">
        <OrderSummary
          items={items}
          pickupLabel={pickupLabel}
          total={subtotal}
        />

        {serverError && (
          <p
            role="alert"
            className="mt-4 rounded-2xl bg-destructive/10 p-3 text-sm text-destructive"
          >
            {fill(t.showtime[serverError.key], {
              name: serverError.itemName ?? "",
            })}
          </p>
        )}

        <Button
          type="submit"
          size="lg"
          disabled={processing || tooManyForClass}
          aria-label={`${plain.showtime.pay}, ${formatPeso(subtotal)}`}
          className="mt-4 h-auto min-h-16 w-full flex-col gap-0 rounded-md py-2"
        >
          <span className="text-lg font-bold">
            {t.showtime.pay} · {formatPeso(subtotal)}
          </span>
          <span className="text-xs font-medium">{t.showtime.paySub}</span>
        </Button>
      </div>

      {processing && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/95 px-6 text-center backdrop-blur">
          <CountIn />
          <p className="-mt-16 text-lg font-semibold">
            {t.showtime.processing}
          </p>
        </div>
      )}
    </form>
  );
}
