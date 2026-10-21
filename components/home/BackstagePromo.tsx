"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LogoMark } from "@/components/layout/LogoMark";
import { useCopy } from "@/hooks/use-copy";
import { routes } from "@/lib/routes";

// Lilac band pointing portfolio visitors at the order to Backstage loop.
export function BackstagePromo() {
  const { t, plain } = useCopy();

  return (
    <section className="bg-lilac text-espresso">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-8 px-4 py-14 sm:py-16 md:grid-cols-[auto_1fr_auto]">
        <LogoMark className="hidden size-24 md:block" />
        <div>
          <h2 className="text-5xl leading-none">{t.home.backstageTitle}</h2>
          <p className="mt-3 max-w-xl text-lg">{t.home.backstageBody}</p>
        </div>
        <Link
          href={routes.backstageQueue.href}
          aria-label={plain.tracker.demoCta}
          className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-espresso px-7 font-semibold whitespace-nowrap text-cream transition-transform outline-none hover:animate-beat focus-visible:ring-3 focus-visible:ring-ring active:scale-[0.98] motion-reduce:hover:animate-none"
        >
          {t.tracker.demoCta}
          <ArrowRight aria-hidden className="size-4" />
        </Link>
      </div>
    </section>
  );
}
