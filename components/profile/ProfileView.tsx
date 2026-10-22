"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, LogOut } from "lucide-react";
import { toast } from "sonner";
import { signOut } from "@/app/(auth)/actions";
import { saveProfile } from "@/app/(shop)/profile/actions";
import { AuthField } from "@/components/auth/AuthField";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/layout/PageHero";
import { useCopy } from "@/hooks/use-copy";
import { profileSchema, type ProfileInput } from "@/lib/auth-schema";
import { fill, type Copy } from "@/lib/copy";
import type { SavedChoreoEntry } from "@/lib/db/choreo";
import type { TrackedOrder } from "@/lib/db/orders";
import type { Profile } from "@/lib/db/profiles";
import { formatDay, formatPeso } from "@/lib/format";
import { statusCopyKey } from "@/lib/orders";
import { dayKey } from "@/lib/schedule";
import { RunItBackButton } from "./RunItBackButton";
import { SavedChoreo } from "./SavedChoreo";
import { Reveal } from "@/components/motion/Reveal";

const levelKey: Record<Profile["level"], keyof Copy["levels"]> = {
  rookie: "rookie",
  cypher_regular: "cypherRegular",
  battler: "battler",
  judge: "judge",
  legend: "legend",
};

type ProfileViewProps = {
  email: string;
  profile: Profile;
  orders: TrackedOrder[];
  choreo: SavedChoreoEntry[];
};

export function ProfileView({
  email,
  profile,
  orders,
  choreo,
}: ProfileViewProps) {
  const { t, plain, isPlain } = useCopy();
  const router = useRouter();
  const [saved, setSaved] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: profile.name ?? "", phone: profile.phone ?? "" },
  });

  const message = (key?: string) =>
    key && key in t.auth ? t.auth[key as keyof Copy["auth"]] : null;

  const onSubmit = handleSubmit(async (values) => {
    const result = await saveProfile(values);
    if (result.ok) {
      reset(values);
      setSaved(true);
      toast(t.profile.saved);
    }
  });

  async function handleSignOut() {
    await signOut();
    router.replace("/");
    router.refresh();
  }

  return (
    <main className="flex-1 pb-16">
      <PageHero
        title={t.pages.profile}
        plainTitle={plain.pages.profile}
        image="/scenes/crew-smoke.webp"
        imagePosition="center 40%"
        body={fill(t.auth.signedInAs, { name: profile.name || email })}
      >
        <Button
          type="button"
          variant="outline"
          onClick={handleSignOut}
          aria-label={plain.auth.signOut}
          className="rounded-full border-border bg-muted text-foreground hover:bg-muted/80"
        >
          <LogOut aria-hidden />
          {t.auth.signOut}
        </Button>
      </PageHero>
      <div className="mx-auto w-full max-w-3xl px-4 pt-8">
        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-espresso p-4 text-cream dark:bg-espresso-deep">
            <p className="text-xs font-semibold tracking-widest text-khaki uppercase">
              {t.profile.level}
            </p>
            <p className="mt-1 font-heading text-3xl tracking-tight">
              {t.levels[levelKey[profile.level]]}
            </p>
          </div>
          <div className="surface p-4">
            <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
              {t.profile.reps}
            </p>
            <p className="mt-1 font-heading text-3xl">{profile.reps}</p>
          </div>
        </div>

        <section aria-labelledby="details" className="mt-8">
          <h2 id="details" className="mb-4 text-3xl leading-none">
            {t.profile.details}
          </h2>
          <form onSubmit={onSubmit} noValidate className="space-y-4">
            <AuthField
              id="name"
              label={t.auth.name}
              autoComplete="name"
              error={message(errors.name?.message)}
              register={register("name", { onChange: () => setSaved(false) })}
            />
            <AuthField
              id="phone"
              type="tel"
              inputMode="tel"
              label={t.auth.phone}
              autoComplete="tel"
              placeholder={t.showtime.phonePlaceholder}
              error={message(errors.phone?.message)}
              register={register("phone", { onChange: () => setSaved(false) })}
            />
            <div className="flex items-center gap-3">
              <Button type="submit" disabled={isSubmitting || !isDirty}>
                {t.profile.save}
              </Button>
              {saved && (
                <p
                  role="status"
                  className="flex items-center gap-1 text-sm font-semibold text-highlight"
                >
                  <Check aria-hidden className="size-4" />
                  {t.profile.saved}
                </p>
              )}
            </div>
          </form>
        </section>

        <SavedChoreo choreo={choreo} />

        <section aria-labelledby="past" className="mt-10">
          <h2 id="past" className="text-3xl leading-none">
            {t.profile.pastPerformances}
          </h2>
          {!isPlain && (
            <p className="mt-1 text-sm text-muted-foreground">
              {plain.profile.pastPerformances}
            </p>
          )}
          {orders.length === 0 ? (
            <p className="mt-4 rounded-3xl bg-muted/60 p-6 text-center text-muted-foreground">
              {t.profile.noOrders}
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {orders.map((order, index) => (
                <Reveal
                  as="li"
                  key={order.id}
                  delay={Math.min(index, 4) * 0.05}
                  className="surface p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="font-heading text-2xl leading-none tracking-tight">
                        {order.code}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {formatDay(dayKey(new Date(order.createdAt)))}
                      </p>
                    </div>
                    <span className="rounded-md bg-accent px-2 py-0.5 text-xs font-bold text-accent-foreground">
                      {t.status[statusCopyKey[order.status]]}
                    </span>
                  </div>
                  <p className="mt-2 text-sm">
                    {order.items
                      .map((item) => `${item.quantity}× ${item.name}`)
                      .join(", ")}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="font-heading text-2xl">
                      {formatPeso(order.total)}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap items-start justify-between gap-2">
                    <RunItBackButton kind="order" id={order.id} />
                    <Link
                      href={`/track/${order.id}`}
                      className="inline-flex min-h-11 items-center rounded-lg px-2 text-sm font-semibold text-highlight underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring"
                    >
                      {t.profile.viewOrder}
                    </Link>
                  </div>
                </Reveal>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
