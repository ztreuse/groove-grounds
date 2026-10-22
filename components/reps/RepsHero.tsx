"use client";

import { PageHero } from "@/components/layout/PageHero";
import { useCopy } from "@/hooks/use-copy";

export function RepsHero() {
  const { t, plain } = useCopy();
  return (
    <PageHero
      title={t.pages.reps}
      plainTitle={plain.pages.reps}
      body={t.reps.intro}
      image="/scenes/bboy.webp"
      imagePosition="70% center"
    />
  );
}
