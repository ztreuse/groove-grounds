"use client";

import { Suspense, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MailIcon, SneakerIcon } from "@/components/icons/GrooveIcons";
import {
  sendMagicLink,
  signIn,
  signUp,
  signInAsDemo,
} from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { useCopy } from "@/hooks/use-copy";
import {
  joinSchema,
  loginFormSchema,
  safeNext,
  type AuthErrorKey,
  type JoinInput,
} from "@/lib/auth-schema";
import { fill, type Copy } from "@/lib/copy";
import { routes } from "@/lib/routes";
import { IconTile } from "@/components/layout/IconTile";
import { AuthField } from "./AuthField";

type Mode = "join" | "login";

function Form({ mode, next }: { mode: Mode; next: string }) {
  const { t, plain, isPlain } = useCopy();
  const router = useRouter();
  const [serverError, setServerError] = useState<AuthErrorKey | null>(null);
  const [confirmEmail, setConfirmEmail] = useState<string | null>(null);
  const [demoBusy, setDemoBusy] = useState(false);
  // Set once a sign-in link was sent; shows the magic-link wording.
  const [magicSent, setMagicSent] = useState(false);
  const [magicBusy, setMagicBusy] = useState(false);
  const isJoin = mode === "join";

  const {
    register,
    handleSubmit,
    getValues,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<JoinInput>({
    resolver: zodResolver(isJoin ? joinSchema : loginFormSchema),
    defaultValues: { name: "", email: "", password: "", phone: "" },
  });

  const message = (key?: string) =>
    key && key in t.auth ? t.auth[key as keyof Copy["auth"]] : null;

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    const result = isJoin
      ? await signUp(values)
      : await signIn({ email: values.email, password: values.password });
    if (!result.ok) {
      setServerError(result.error);
      return;
    }
    if (result.needsConfirmation) {
      setConfirmEmail(values.email);
      return;
    }
    router.replace(next);
    router.refresh();
  });

  async function emailLink() {
    setServerError(null);
    if (!(await trigger("email"))) return;
    setMagicBusy(true);
    const email = getValues("email");
    const result = await sendMagicLink(email, next);
    setMagicBusy(false);
    if (!result.ok) {
      setServerError(result.error);
      return;
    }
    setMagicSent(true);
    setConfirmEmail(email);
  }

  async function tryDemo() {
    setServerError(null);
    setDemoBusy(true);
    const result = await signInAsDemo();
    setDemoBusy(false);
    if (!result.ok) {
      setServerError(result.error);
      return;
    }
    // The demo dancer is a customer: land on their Dancer Profile.
    router.replace(next.startsWith("/backstage") ? routes.profile.href : next);
    router.refresh();
  }

  if (confirmEmail) {
    return (
      <div role="status" className="mt-8 surface p-6">
        <IconTile icon={MailIcon} size="lg" />
        <h2 className="mt-3 text-3xl leading-none">{t.auth.checkEmail}</h2>
        <p className="mt-2 text-muted-foreground">
          {fill(magicSent ? t.auth.magicSentBody : t.auth.checkEmailBody, {
            email: confirmEmail,
          })}
        </p>
      </div>
    );
  }

  const title = isJoin ? t.auth.join : t.auth.login;
  const titlePlain = isJoin ? plain.auth.join : plain.auth.login;

  return (
    <>
      <h1 className="text-6xl sm:text-7xl">{title}</h1>
      {!isPlain && (
        <p className="mt-3 eyebrow text-muted-foreground">{titlePlain}</p>
      )}
      <p className="mt-3">{isJoin ? t.auth.joinIntro : t.auth.loginIntro}</p>

      <form onSubmit={onSubmit} noValidate className="mt-6 space-y-4">
        {isJoin && (
          <AuthField
            id="name"
            label={t.auth.name}
            autoComplete="name"
            error={message(errors.name?.message)}
            register={register("name")}
          />
        )}
        <AuthField
          id="email"
          type="email"
          label={t.auth.email}
          autoComplete="email"
          inputMode="email"
          error={message(errors.email?.message)}
          register={register("email")}
        />
        <AuthField
          id="password"
          type="password"
          label={t.auth.password}
          autoComplete={isJoin ? "new-password" : "current-password"}
          hint={isJoin ? t.auth.passwordHint : undefined}
          error={message(errors.password?.message)}
          register={register("password")}
        />
        {isJoin && (
          <AuthField
            id="phone"
            type="tel"
            inputMode="tel"
            label={t.auth.phone}
            autoComplete="tel"
            placeholder={t.showtime.phonePlaceholder}
            error={message(errors.phone?.message)}
            register={register("phone")}
          />
        )}

        {serverError && (
          <p
            role="alert"
            className="rounded-2xl bg-destructive/10 p-3 text-sm text-destructive"
          >
            {t.auth[serverError]}
          </p>
        )}

        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          aria-label={titlePlain}
          className="h-auto min-h-14 w-full rounded-md text-base font-bold"
        >
          {isSubmitting ? t.auth.working : title}
        </Button>
        {!isJoin && (
          <button
            type="button"
            onClick={emailLink}
            disabled={magicBusy}
            aria-label={plain.auth.magicLink}
            className="mx-auto flex min-h-11 items-center gap-2 rounded-md px-3 text-sm font-semibold text-highlight outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring disabled:opacity-60"
          >
            <MailIcon aria-hidden className="size-4" />
            {magicBusy ? t.auth.working : t.auth.magicLink}
          </button>
        )}
      </form>

      {/* One tap into the shared demo dancer, for portfolio visitors. */}
      <div className="mt-6 flex items-center gap-3 text-xs font-medium text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        {t.auth.or}
        <span className="h-px flex-1 bg-border" />
      </div>
      <Button
        type="button"
        variant="outline"
        size="lg"
        onClick={tryDemo}
        disabled={demoBusy}
        aria-label={plain.auth.tryDemo}
        className="mt-4 h-auto min-h-14 w-full gap-3 rounded-md"
      >
        <IconTile icon={SneakerIcon} size="sm" />
        {demoBusy ? t.auth.working : t.auth.tryDemo}
      </Button>
      <p className="mt-2 text-center text-xs text-muted-foreground">
        {t.auth.tryDemoHint}
      </p>

      <p className="mt-6 text-sm">
        {isJoin ? t.auth.haveAccount : t.auth.noAccount}{" "}
        <Link
          href={`${isJoin ? routes.login.href : routes.join.href}${next === "/profile" ? "" : `?next=${encodeURIComponent(next)}`}`}
          className="inline-flex min-h-11 items-center font-semibold text-highlight underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring"
        >
          {isJoin ? t.auth.login : t.auth.join}
        </Link>
      </p>
      <p className="text-sm text-muted-foreground">{t.auth.guestNote}</p>
    </>
  );
}

function FormFromQuery({ mode }: { mode: Mode }) {
  const next = safeNext(useSearchParams().get("next"), routes.profile.href);
  return <Form mode={mode} next={next} />;
}

// Photo panel beside the form on wide screens: the crew, the tagline.
function AuthPanel() {
  const { t } = useCopy();
  return (
    <div className="theme-dark relative hidden overflow-hidden bg-background lg:block">
      <Image
        src="/scenes/crew-color.webp"
        alt=""
        fill
        priority
        sizes="50vw"
        className="object-cover opacity-80"
      />
      <span
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-espresso-deep via-espresso-deep/30 to-transparent"
      />
      <p className="absolute inset-x-8 bottom-8 max-w-sm font-heading text-5xl leading-[0.9] font-black uppercase [font-stretch:64%]">
        {t.tagline}
      </p>
    </div>
  );
}

// The page is prerendered, so ?next= is read on the client.
export function AuthForm({ mode }: { mode: Mode }) {
  return (
    <main className="grid flex-1 gap-6 pb-16 lg:min-h-[calc(100dvh-6rem)] lg:grid-cols-2 lg:gap-0 lg:pb-0">
      <AuthPanel />
      <div className="mx-auto w-full max-w-md self-center px-2 pt-8 sm:pt-12 lg:py-12">
        <Suspense fallback={<Form mode={mode} next={routes.profile.href} />}>
          <FormFromQuery mode={mode} />
        </Suspense>
      </div>
    </main>
  );
}
