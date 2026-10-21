"use client";

import { Reveal } from "@/components/motion/Reveal";
import { useCopy } from "@/hooks/use-copy";

const steps = [
  { title: "step1Title", body: "step1Body" },
  { title: "step2Title", body: "step2Body" },
  { title: "step3Title", body: "step3Body" },
] as const;

// Three steps on a soft lilac wash: big numbers, short copy, a hairline
// connecting them on wide screens.
export function HowItWorks() {
  const { t } = useCopy();

  return (
    <section
      aria-labelledby="how"
      className="bg-gradient-to-b from-background via-accent/40 to-background"
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:py-28">
        <Reveal>
          <h2 id="how" className="max-w-xl text-4xl leading-tight sm:text-5xl">
            {t.home.howTitle}
          </h2>
        </Reveal>
        <ol className="relative mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
          <span
            aria-hidden
            className="absolute top-8 right-[16%] left-[16%] hidden h-px bg-border md:block"
          />
          {steps.map(({ title, body }, index) => (
            <Reveal
              as="li"
              key={title}
              delay={index * 0.08}
              className="relative"
            >
              <span
                aria-hidden
                className="relative flex size-16 items-center justify-center rounded-full bg-card font-heading text-2xl font-bold text-highlight shadow-[0_12px_30px_-16px_rgb(59_42_32_/_0.5)]"
              >
                {index + 1}
              </span>
              <h3 className="mt-5 text-2xl leading-tight">{t.home[title]}</h3>
              <p className="mt-2 max-w-xs text-muted-foreground">
                {t.home[body]}
              </p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
