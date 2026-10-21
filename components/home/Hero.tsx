"use client";

import Link from "next/link";
import { CalendarClock, Zap } from "lucide-react";
import { useCopy } from "@/hooks/use-copy";
import { setOrderIntent, type OrderIntent } from "@/lib/order-intent";
import { routes } from "@/lib/routes";

const ctaClass =
  "flex min-h-16 items-center gap-3 rounded-2xl px-5 py-3 text-left outline-none hover:animate-beat focus-visible:ring-3 focus-visible:ring-lilac motion-reduce:hover:animate-none";

export function Hero() {
  const { t, plain, isPlain } = useCopy();

  const ctas = [
    {
      intent: "drop_in",
      term: "dropIn",
      icon: Zap,
      className: "bg-primary text-primary-foreground",
    },
    {
      intent: "class",
      term: "bookAClass",
      icon: CalendarClock,
      className: "bg-cream text-espresso",
    },
  ] as const satisfies {
    intent: OrderIntent;
    term: "dropIn" | "bookAClass";
    icon: typeof Zap;
    className: string;
  }[];

  return (
    <section className="relative overflow-hidden bg-espresso text-cream dark:bg-espresso-deep">
      {/* Studio lights and floor tape. */}
      <span
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,var(--color-purple)_0%,transparent_55%),radial-gradient(circle_at_95%_20%,var(--color-lilac)_0%,transparent_35%)] opacity-60"
      />
      <span
        aria-hidden
        className="absolute -right-4 bottom-0 font-heading text-[10rem] leading-none text-cream/5 select-none sm:text-[16rem]"
      >
        5678
      </span>
      <span
        aria-hidden
        className="absolute bottom-6 left-[8%] h-2 w-24 -rotate-6 bg-khaki/50"
      />
      <span
        aria-hidden
        className="absolute right-[12%] bottom-10 h-2 w-16 rotate-12 bg-khaki/40"
      />

      <div className="relative mx-auto w-full max-w-6xl px-4 py-16 sm:py-24">
        <p className="text-sm font-semibold tracking-widest text-lilac uppercase">
          {t.home.heroEyebrow}
        </p>
        <h1 className="mt-3 max-w-3xl text-6xl leading-[0.9] sm:text-8xl">
          {t.home.heroTitle}
        </h1>
        <p className="mt-5 max-w-md text-lg text-cream/90">{t.home.heroBody}</p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          {ctas.map(({ intent, term, icon: Icon, className }) => (
            <Link
              key={intent}
              href={routes.lineup.href}
              onClick={() => setOrderIntent(intent)}
              aria-label={plain.terms[term]}
              className={`${ctaClass} ${className}`}
            >
              <Icon aria-hidden className="size-6 shrink-0" />
              <span>
                <span className="block font-heading text-2xl leading-none tracking-wide uppercase">
                  {t.terms[term]}
                </span>
                {!isPlain && (
                  <span className="mt-1 block text-sm font-medium">
                    {plain.terms[term]}
                  </span>
                )}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
