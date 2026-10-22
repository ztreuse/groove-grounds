"use client";

import Link from "next/link";
import { ProfileIcon } from "@/components/icons/GrooveIcons";
import { IconTile } from "@/components/layout/IconTile";
import { Button } from "@/components/ui/button";
import { useCopy } from "@/hooks/use-copy";
import { routes } from "@/lib/routes";

type StaffGateProps = {
  // signed-out: show Sign in; not-staff / not-owner: explain why not.
  reason: "signed-out" | "not-staff" | "not-owner";
  // Where to come back to after signing in.
  next: string;
};

// Shown on Backstage pages a visitor isn't allowed to use. Always offers
// the Demo Backstage queue, which anyone can try.
export function StaffGate({ reason, next }: StaffGateProps) {
  const { t, plain } = useCopy();
  const body =
    reason === "signed-out"
      ? t.staff.gateBody
      : reason === "not-staff"
        ? t.staff.notStaff
        : t.staff.ownerOnly;

  return (
    <div className="mt-8 grid gap-5 surface p-6 sm:grid-cols-[auto_1fr] sm:items-center sm:p-8">
      <IconTile icon={ProfileIcon} size="lg" />
      <div>
        <h2 className="text-3xl leading-none">{t.staff.gateTitle}</h2>
        <p className="mt-2 text-muted-foreground">{body}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {reason === "signed-out" && (
            <Button asChild size="lg">
              <Link
                href={`${routes.login.href}?next=${next}`}
                aria-label={plain.staff.gateSignIn}
              >
                {t.staff.gateSignIn}
              </Link>
            </Button>
          )}
          <Button asChild size="lg" variant="outline">
            <Link
              href={routes.backstageQueue.href}
              aria-label={plain.staff.tryDemo}
            >
              {t.staff.tryDemo}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
