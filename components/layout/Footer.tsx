"use client";

import Link from "next/link";
import { useCopy } from "@/hooks/use-copy";
import { fill, type Copy } from "@/lib/copy";
import { formatClock } from "@/lib/format";
import { routes } from "@/lib/routes";
import { schedule } from "@/lib/schedule";
import { LogoMark } from "./LogoMark";

// The footer always uses plain words (the `footer` copy is the same in both
// dictionaries), so it reads the same in Dance and Plain mode.
const footerLinks: { key: keyof Copy["footer"]; href: string }[] = [
  { key: "home", href: routes.home.href },
  { key: "menu", href: routes.lineup.href },
  { key: "about", href: routes.about.href },
  { key: "contact", href: routes.studio.href },
  { key: "faq", href: routes.dictionary.href },
  { key: "demoBackstage", href: routes.backstageQueue.href },
];

export function Footer() {
  const { t, plain } = useCopy();

  return (
    <footer className="mt-auto overflow-hidden bg-espresso-deep text-cream">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 pt-14 pb-6 md:grid-cols-[1fr_auto]">
        <div className="flex items-start gap-4">
          <LogoMark light className="size-14 shrink-0" />
          <div>
            <p className="max-w-xs text-cream/80">{t.tagline}</p>
            <p className="mt-2 text-sm font-semibold text-khaki">
              {fill(t.footer.hours, {
                open: formatClock(schedule.openMinute),
                close: formatClock(schedule.closeMinute),
              })}
            </p>
          </div>
        </div>
        <nav aria-label={plain.footer.nav}>
          <ul className="flex flex-wrap gap-x-1 gap-y-1 md:justify-end">
            {footerLinks.map(({ key, href }) => (
              <li key={key}>
                <Link
                  href={href}
                  className="inline-flex min-h-11 items-center rounded-full px-3 text-sm font-semibold outline-none hover:bg-cream/10 focus-visible:ring-3 focus-visible:ring-lilac"
                >
                  {plain.footer[key]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <p
        aria-hidden
        className="mx-auto w-full max-w-6xl px-4 font-heading text-[18vw] leading-[0.92] text-cream/25 uppercase text-outline lg:text-[10rem] lg:whitespace-nowrap"
      >
        {t.brand}
      </p>
      <p className="mx-auto w-full max-w-6xl px-4 pt-4 pb-8 text-xs text-cream/70">
        {t.footer.rights}
      </p>
    </footer>
  );
}
