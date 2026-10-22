"use client";

import Link from "next/link";
import { ProfileIcon } from "@/components/icons/GrooveIcons";
import { IconTile } from "@/components/layout/IconTile";
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
      <div className="mx-auto w-full max-w-6xl px-4 pt-10">
        <div className="grid gap-6 surface p-8 md:grid-cols-[auto_1fr_auto] md:items-center">
          <IconTile icon={ProfileIcon} size="lg" />
          <div>
            <h2 className="text-3xl leading-none">
              {t.profile.signedOutTitle}
            </h2>
            <p className="mt-2 text-muted-foreground">
              {t.profile.signedOutBody}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
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
          <p className="border-t border-border pt-4 text-sm text-muted-foreground md:col-span-3">
            {t.auth.guestNote}
          </p>
        </div>
      </div>
    </main>
  );
}
