"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { KineticTitle } from "@/components/motion/KineticTitle";
import { useCopy } from "@/hooks/use-copy";
import { routes } from "@/lib/routes";

// Closing band: cream fading up into lilac, a big centred line and the
// way into Demo Backstage for portfolio visitors.
export function BackstagePromo() {
  const { t, plain } = useCopy();

  return (
    <section className="bg-gradient-to-b from-background via-lilac/60 to-lilac text-espresso">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center px-4 pt-24 pb-28 text-center sm:pt-32 sm:pb-36">
        <p className="eyebrow text-espresso/70">05</p>
        <KineticTitle
          as="h2"
          text={t.home.backstageTitle}
          accentLast
          trigger="view"
          className="mt-4 max-w-[12ch] text-[clamp(3.5rem,10vw,8rem)] leading-[0.88] font-black tracking-normal uppercase [font-stretch:64%] [&_em]:text-purple"
        />
        <p className="mt-6 max-w-md text-lg">{t.home.backstageBody}</p>
        <Link
          href={routes.backstageQueue.href}
          aria-label={plain.tracker.demoCta}
          className="group mt-9 inline-flex min-h-14 items-center justify-center gap-3 rounded-md bg-espresso px-7 font-semibold whitespace-nowrap text-cream outline-none focus-visible:ring-3 focus-visible:ring-ring active:translate-y-px"
        >
          {t.tracker.demoCta}
          <ArrowRight
            aria-hidden
            className="size-4 transition-transform duration-300 group-hover:translate-x-1"
          />
        </Link>
      </div>
    </section>
  );
}
