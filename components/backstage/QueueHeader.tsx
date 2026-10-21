"use client";

import { useCopy } from "@/hooks/use-copy";

export function QueueHeader() {
  const { t, plain, isPlain } = useCopy();

  return (
    <header>
      <p className="text-sm font-semibold tracking-widest text-highlight uppercase">
        {t.terms.backstage}
        {!isPlain && ` · ${plain.terms.backstage}`}
      </p>
      <h1 className="mt-1 text-4xl leading-tight sm:text-5xl">
        {t.pages.backstageQueue}
      </h1>
      <p className="mt-3 max-w-prose rounded-xl bg-accent px-4 py-3 text-sm font-medium text-accent-foreground">
        {t.queue.demoNotice}
      </p>
    </header>
  );
}
