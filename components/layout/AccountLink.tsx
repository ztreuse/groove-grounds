"use client";

import Link from "next/link";
import { ProfileIcon, SignInIcon } from "@/components/icons/GrooveIcons";
import { useCopy } from "@/hooks/use-copy";
import { useUser } from "@/hooks/use-user";
import { routes } from "@/lib/routes";
import { IconTile } from "./IconTile";

type AccountLinkProps = {
  variant: "bar" | "sheet";
  onNavigate?: () => void;
};

const focus = "outline-none focus-visible:ring-3 focus-visible:ring-ring";

// Header bar (wide screens, where there is no menu): one round icon to the
// Dancer Profile or Sign in. Mobile menu: the signed-in dancer's name and a
// link to their profile, or Join the Crew + Sign in when signed out.
export function AccountLink({ variant, onNavigate }: AccountLinkProps) {
  const { t, plain, isPlain } = useCopy();
  const user = useUser();
  if (user === undefined) return null;

  if (variant === "bar") {
    const Icon = user ? ProfileIcon : SignInIcon;
    const label = user ? t.header.account : t.header.signIn;
    return (
      <Link
        href={user ? routes.profile.href : routes.login.href}
        aria-label={user ? plain.header.account : plain.header.signIn}
        title={label}
        className={`hidden size-11 shrink-0 items-center justify-center rounded-full bg-muted text-foreground transition-colors hover:bg-foreground hover:text-background xl:inline-flex ${focus}`}
      >
        <Icon className="size-5" />
      </Link>
    );
  }

  if (user) {
    const name =
      (user.user_metadata?.name as string | undefined)?.trim() ||
      user.email ||
      t.terms.dancerProfile;
    return (
      <Link
        href={routes.profile.href}
        aria-label={`${plain.terms.dancerProfile}: ${name}`}
        onClick={onNavigate}
        className={`flex min-h-16 items-center gap-3 rounded-md bg-muted px-3 py-2 hover:bg-accent hover:text-accent-foreground ${focus}`}
      >
        <IconTile icon={ProfileIcon} tone="accent" />
        <span className="min-w-0">
          <span className="block truncate font-semibold">{name}</span>
          <span className="block text-xs text-muted-foreground">
            {t.terms.dancerProfile}
            {!isPlain && ` · ${plain.terms.dancerProfile}`}
          </span>
        </span>
      </Link>
    );
  }

  return (
    <div className="grid gap-2">
      <p className="px-1 text-sm text-muted-foreground">
        {t.profile.signedOutBody}
      </p>
      <div className="grid grid-cols-2 gap-2">
        <Link
          href={routes.join.href}
          aria-label={plain.auth.join}
          onClick={onNavigate}
          className={`flex min-h-12 items-center justify-center rounded-md bg-primary px-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 ${focus}`}
        >
          {t.auth.join}
        </Link>
        <Link
          href={routes.login.href}
          aria-label={plain.auth.login}
          onClick={onNavigate}
          className={`flex min-h-12 items-center justify-center rounded-md bg-muted px-3 text-sm font-semibold ring-1 ring-border ring-inset hover:bg-accent hover:text-accent-foreground ${focus}`}
        >
          {t.auth.login}
        </Link>
      </div>
    </div>
  );
}
