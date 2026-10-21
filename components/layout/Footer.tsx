"use client";

import Link from "next/link";
import { useCopy } from "@/hooks/use-copy";
import { fill, type Copy } from "@/lib/copy";
import { formatClock } from "@/lib/format";
import { routes } from "@/lib/routes";
import { schedule } from "@/lib/schedule";

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
    <footer className="mt-auto border-t bg-secondary text-secondary-foreground">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-heading text-2xl tracking-wide uppercase">
            {t.brand}
          </p>
          <p className="mt-1 max-w-xs text-sm opacity-80">{t.tagline}</p>
          <p className="mt-3 text-sm font-semibold">
            {fill(t.footer.hours, {
              open: formatClock(schedule.openMinute),
              close: formatClock(schedule.closeMinute),
            })}
          </p>
        </div>
        <nav aria-label={plain.footer.nav}>
          <ul className="flex flex-wrap gap-x-2 gap-y-1">
            {footerLinks.map(({ key, href }) => (
              <li key={key}>
                <Link
                  href={href}
                  className="inline-flex min-h-11 items-center rounded-lg px-2 text-sm font-semibold underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring"
                >
                  {plain.footer[key]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <p className="mx-auto w-full max-w-6xl px-4 pb-8 text-xs opacity-80">
        {t.footer.rights}
      </p>
    </footer>
  );
}
