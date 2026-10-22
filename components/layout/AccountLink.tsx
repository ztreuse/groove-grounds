"use client";

import Link from "next/link";
import { LogIn, UserRound } from "lucide-react";
import { useCopy } from "@/hooks/use-copy";
import { useUser } from "@/hooks/use-user";
import { routes } from "@/lib/routes";

type AccountLinkProps = {
  variant: "bar" | "sheet";
  onNavigate?: () => void;
};

// "Sign in" when signed out, the Dancer Profile when signed in.
export function AccountLink({ variant, onNavigate }: AccountLinkProps) {
  const { t, plain } = useCopy();
  const user = useUser();
  if (user === undefined) return null;

  // Shown in both the header bar (icon) and the mobile menu (icon + label):
  // the nav itself no longer lists the account. Below 360px the bar has no
  // room for the icon, so it lives in the menu only.
  const signedIn = !!user;
  const Icon = signedIn ? UserRound : LogIn;
  const label = signedIn ? t.header.account : t.header.signIn;
  const ariaLabel = signedIn ? plain.header.account : plain.header.signIn;
  const href = signedIn ? routes.profile.href : routes.login.href;

  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      title={variant === "bar" ? label : undefined}
      onClick={onNavigate}
      className={
        variant === "bar"
          ? "inline-flex size-11 shrink-0 items-center justify-center rounded-full outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-3 focus-visible:ring-ring max-[359px]:hidden"
          : "flex min-h-14 items-center gap-3 rounded-xl bg-muted px-3 py-2 font-semibold outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-3 focus-visible:ring-ring"
      }
    >
      <Icon aria-hidden className="size-5 shrink-0" />
      {/* Icon only in the header bar; the full nav needs the room. */}
      {variant === "sheet" && label}
    </Link>
  );
}
