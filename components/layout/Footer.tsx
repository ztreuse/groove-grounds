"use client";

import Image from "next/image";
import Link from "next/link";
import { useCopy } from "@/hooks/use-copy";
import { fill, type Copy } from "@/lib/copy";
import { formatClock } from "@/lib/format";
import { routes } from "@/lib/routes";
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

type FooterProps = { openMinute: number; closeMinute: number };

export function Footer({ openMinute, closeMinute }: FooterProps) {
  const { t, plain } = useCopy();

  return (
    <footer className="theme-dark relative mt-auto overflow-hidden border-t border-border bg-background">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 pt-14 pb-6 md:grid-cols-[1fr_auto]">
        <div className="flex items-start gap-4">
          <LogoMark light className="size-14 shrink-0" />
          <div>
            <p className="max-w-xs text-foreground/80">{t.tagline}</p>
            <p className="mt-3 eyebrow text-khaki">
              {fill(t.footer.hours, {
                open: formatClock(openMinute),
                close: formatClock(closeMinute),
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
                  className="inline-flex min-h-11 items-center rounded-md px-3 text-sm font-semibold outline-none hover:bg-cream/10 focus-visible:ring-3 focus-visible:ring-lilac"
                >
                  {plain.footer[key]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <p className="relative mx-auto w-full max-w-6xl border-t border-border px-4 pt-5 text-xs text-foreground/60">
        {t.footer.rights}
      </p>
      {/* Giant wordmark fading into the floor, a drink standing in front
          of it (lighten blend lets the photo’s black backdrop disappear). */}
      <div aria-hidden className="relative mx-auto w-full max-w-6xl px-4 pt-6">
        <p className="bg-gradient-to-b from-cream/90 via-cream/40 to-cream/0 bg-clip-text font-heading text-[24vw] leading-[0.82] font-black text-transparent uppercase [font-stretch:62%] lg:text-[11.5rem] lg:whitespace-nowrap">
          {t.brand}
        </p>
        <div className="pointer-events-none absolute bottom-0 left-1/2 aspect-[3/4] w-[34%] max-w-72 -translate-x-1/2 [mask-image:radial-gradient(closest-side,black_55%,transparent)] mix-blend-lighten">
          <Image
            src="/drinks/waacking-caramel-macchiato.jpg"
            alt=""
            fill
            sizes="288px"
            className="object-cover"
          />
        </div>
      </div>
    </footer>
  );
}
