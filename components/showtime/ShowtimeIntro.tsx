"use client";

import { PageHero } from "@/components/layout/PageHero";
import { useCopy } from "@/hooks/use-copy";

export function ShowtimeIntro() {
  const { t, plain } = useCopy();

  return (
    <PageHero
      title={t.pages.showtime}
      plainTitle={plain.pages.showtime}
      body={t.showtime.intro}
      image="/scenes/hero-spotlight.webp"
      imagePosition="center 30%"
    />
  );
}
