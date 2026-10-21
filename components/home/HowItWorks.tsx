"use client";

import { useCopy } from "@/hooks/use-copy";

const steps = [
  { title: "step1Title", body: "step1Body" },
  { title: "step2Title", body: "step2Body" },
  { title: "step3Title", body: "step3Body" },
] as const;

// Purple band with three big outlined counts on a dashed floor line.
export function HowItWorks() {
  const { t } = useCopy();

  return (
    <section
      aria-labelledby="how"
      className="bg-primary text-primary-foreground"
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:py-20">
        <h2 id="how" className="max-w-xl text-5xl leading-none sm:text-6xl">
          {t.home.howTitle}
        </h2>
        <ol className="relative mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
          <span
            aria-hidden
            className="absolute top-14 right-0 left-0 hidden border-t-2 border-dashed border-primary-foreground/40 md:block"
          />
          {steps.map(({ title, body }, index) => (
            <li key={title} className="relative">
              <span
                aria-hidden
                className="block bg-primary pr-4 font-heading text-[7rem] leading-[0.8] text-outline md:inline-block"
              >
                {index + 1}
              </span>
              <h3 className="mt-4 text-3xl leading-none">{t.home[title]}</h3>
              <p className="mt-2 max-w-xs text-primary-foreground/85">
                {t.home[body]}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
