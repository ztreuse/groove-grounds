"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { KineticTitle } from "@/components/motion/KineticTitle";
import { useCopy } from "@/hooks/use-copy";
import { routes } from "@/lib/routes";

// Lilac card pointing portfolio visitors at the order to Backstage loop,
// with a motion-blurred dancer bleeding in from the right.
export function BackstagePromo() {
  const { t, plain } = useCopy();

  return (
    <section className="mx-2 mb-2 sm:mx-4">
      <div className="relative overflow-hidden rounded-[2rem] bg-lilac text-espresso sm:rounded-[2.5rem]">
        <div
          aria-hidden
          className="absolute inset-y-0 right-0 hidden w-1/2 md:block"
        >
          <Image
            src="/scenes/stage-blur.webp"
            alt=""
            fill
            sizes="50vw"
            className="object-cover mix-blend-multiply"
          />
          <span className="absolute inset-0 bg-gradient-to-r from-lilac to-transparent" />
        </div>
        <div className="relative mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
          <KineticTitle
            as="h2"
            text={t.home.backstageTitle}
            accentLast
            trigger="view"
            className="max-w-[12ch] text-[clamp(2.75rem,7vw,5.5rem)] leading-[0.95] [&_em]:text-purple"
          />
          <p className="mt-5 max-w-md text-lg">{t.home.backstageBody}</p>
          <Link
            href={routes.backstageQueue.href}
            aria-label={plain.tracker.demoCta}
            className="group mt-8 inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-espresso py-2 pr-2 pl-7 font-semibold whitespace-nowrap text-cream transition-transform outline-none focus-visible:ring-3 focus-visible:ring-ring active:scale-[0.97]"
          >
            {t.tracker.demoCta}
            <span className="flex size-10 items-center justify-center rounded-full bg-lilac text-espresso transition-transform duration-300 group-hover:translate-x-1">
              <ArrowRight aria-hidden className="size-4" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
