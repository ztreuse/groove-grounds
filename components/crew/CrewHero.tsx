"use client";

import { PageHero } from "@/components/layout/PageHero";
import { useCopy } from "@/hooks/use-copy";

export function CrewHero() {
  const { t, plain } = useCopy();
  return (
    <PageHero
      title={t.pages.crew}
      plainTitle={plain.pages.crew}
      body={t.crew.intro}
      image="/scenes/crew-color.webp"
    />
  );
}
