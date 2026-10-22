"use client";

import Link from "next/link";
import { UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/layout/PageHero";
import { useCopy } from "@/hooks/use-copy";
import { routes } from "@/lib/routes";

export function SignedOutProfile() {
  const { t, plain } = useCopy();

  return (
    <main className="flex-1 pb-16">
      <PageHero
        title={t.pages.profile}
        plainTitle={plain.pages.profile}
        image="/scenes/crew-smoke.webp"
        imagePosition="center 40%"
      />
      <div className="mx-auto w-full max-w-xl px-4 pt-10">
        <div className="surface p-8 text-center">
          <UserRound aria-hidden className="mx-auto size-12 text-highlight" />
          <h2 className="mt-3 text-3xl leading-none">
            {t.profile.signedOutTitle}
          </h2>
          <p className="mt-2 text-muted-foreground">
            {t.profile.signedOutBody}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link href={routes.join.href} aria-label={plain.auth.join}>
                {t.auth.join}
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href={routes.login.href} aria-label={plain.auth.login}>
                {t.auth.login}
              </Link>
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            {t.auth.guestNote}
          </p>
        </div>
      </div>
    </main>
  );
}
