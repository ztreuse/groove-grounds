"use client";

import { useCopy } from "@/hooks/use-copy";

const steps = [
  { title: "step1Title", body: "step1Body" },
  { title: "step2Title", body: "step2Body" },
  { title: "step3Title", body: "step3Body" },
] as const;

export function HowItWorks() {
  const { t } = useCopy();

  return (
    <section aria-labelledby="how" className="mx-auto w-full max-w-6xl px-4">
      <h2 id="how" className="mb-4 text-4xl leading-none">
        {t.home.howTitle}
      </h2>
      <ol className="grid gap-3 sm:grid-cols-3">
        {steps.map(({ title, body }, index) => (
          <li
            key={title}
            className="relative overflow-hidden rounded-2xl border-2 bg-card p-5"
          >
            <span
              aria-hidden
              className="absolute -top-4 -right-1 font-heading text-[7rem] leading-none text-primary/15"
            >
              {index + 1}
            </span>
            <span className="font-heading text-5xl leading-none text-highlight">
              {index + 1}
            </span>
            <h3 className="mt-3 text-2xl leading-none">{t.home[title]}</h3>
            <p className="mt-2 text-muted-foreground">{t.home[body]}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
