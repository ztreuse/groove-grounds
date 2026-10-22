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
    <footer className="theme-dark grain relative mt-auto overflow-hidden bg-background">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 pt-14 pb-6 md:grid-cols-[1fr_auto]">
        <div className="flex items-start gap-4">
          <LogoMark light className="size-14 shrink-0" />
          <div>
            <p className="max-w-xs text-foreground/80">{t.tagline}</p>
            <p className="mt-3 eyebrow text-khaki">
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
        className="mx-auto w-full max-w-6xl bg-gradient-to-b from-cream/30 to-cream/5 bg-clip-text px-4 font-heading text-[24vw] leading-[0.82] font-black text-transparent uppercase [font-stretch:62%] lg:text-[11.5rem] lg:whitespace-nowrap"
      >
        {t.brand}
      </p>
      <p className="relative mx-auto w-full max-w-6xl border-t border-border px-4 pt-5 pb-8 text-xs text-foreground/60">
        {t.footer.rights}
      </p>
    </footer>
  );
}
