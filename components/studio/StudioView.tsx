"use client";

import { useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ClockIcon,
  CrewIcon,
  MailIcon,
  PhoneIcon,
  PinIcon,
  ShopIcon,
  type GrooveIcon,
} from "@/components/icons/GrooveIcons";
import { IconTile } from "@/components/layout/IconTile";
import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";
import { useCopy } from "@/hooks/use-copy";
import { fill } from "@/lib/copy";
import { formatClock, formatDay } from "@/lib/format";
import { routes } from "@/lib/routes";
import { dayKey, type ScheduleRules } from "@/lib/schedule";
import { studio } from "@/lib/studio";

const noopSubscribe = () => () => {};

function Row({
  icon,
  label,
  children,
}: {
  icon: GrooveIcon;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4 border-b border-border py-5">
      <IconTile icon={icon} tone="accent" size="md" />
      <div className="min-w-0 flex-1">
        <dt className="eyebrow text-muted-foreground">{label}</dt>
        <dd className="mt-1 text-lg break-words">{children}</dd>
      </div>
    </div>
  );
}

// Find the Studio: address, hours (from the class schedule), pickup and
// contact details, and the map.
export function StudioView({ rules }: { rules: ScheduleRules }) {
  const { t, plain } = useCopy();
  // Upcoming closed days read the clock, so only in the browser.
  const mounted = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
  const today = mounted ? dayKey(new Date()) : null;
  const closedDays = today
    ? rules.blackoutDates.filter((day) => day >= today).slice(0, 4)
    : [];

  return (
    <>
      <PageHero
        title={t.pages.studio}
        plainTitle={plain.pages.studio}
        body={t.studio.intro}
        image="/scenes/studio-floor.webp"
      />

      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-16 sm:py-24 lg:grid-cols-2 lg:gap-16">
        <div>
          <dl className="border-t border-border">
            <Row icon={PinIcon} label={t.studio.address}>
              {studio.address}
            </Row>
            <Row icon={ClockIcon} label={t.studio.hours}>
              {fill(t.footer.hours, {
                open: formatClock(rules.openMinute),
                close: formatClock(rules.closeMinute),
              })}
              {closedDays.length > 0 && (
                <span className="mt-1 block text-base text-muted-foreground">
                  {t.studio.closed} {closedDays.map(formatDay).join(", ")}
                </span>
              )}
            </Row>
            <Row icon={ShopIcon} label={t.studio.pickup}>
              <span className="text-base text-muted-foreground">
                {t.studio.pickupBody}
              </span>
            </Row>
            <Row icon={PhoneIcon} label={t.studio.phone}>
              {studio.phone}
            </Row>
            <Row icon={MailIcon} label={t.studio.email}>
              {studio.email}
            </Row>
            <Row icon={CrewIcon} label={t.studio.socials}>
              {studio.socials}
            </Row>
          </dl>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link
                href={routes.lineup.href}
                aria-label={plain.about.lineupCta}
              >
                {t.about.lineupCta}
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href={routes.crew.href} aria-label={plain.terms.crewOrder}>
                {t.terms.crewOrder}
              </Link>
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            {t.studio.crewNote}
          </p>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          {studio.mapEmbedUrl ? (
            <iframe
              src={studio.mapEmbedUrl}
              title={fill(plain.studio.mapTitle, { address: studio.address })}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="aspect-square w-full border-0"
            />
          ) : (
            <div className="theme-dark relative flex aspect-square flex-col items-center justify-center overflow-hidden bg-background p-8 text-center text-foreground">
              <Image
                src="/scenes/stage-lights.webp"
                alt=""
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover opacity-35"
              />
              <div className="relative flex flex-col items-center">
                <IconTile icon={PinIcon} tone="accent" size="lg" />
                <p className="mt-5 label-display text-2xl">{studio.address}</p>
                <p className="mt-2 max-w-xs text-foreground/80">
                  {t.studio.mapPending}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
