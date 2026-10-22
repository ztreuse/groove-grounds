"use client";

import Image from "next/image";
import Link from "next/link";
import { IconTile } from "@/components/layout/IconTile";
import { PageHero } from "@/components/layout/PageHero";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/button";
import { useCopy } from "@/hooks/use-copy";
import { dance } from "@/lib/copy";
import { genreBlock, genreIcon, genreTerms } from "@/lib/genres";
import { routes } from "@/lib/routes";

// The three ideas the site is built on, each a glossary term.
const hooks = ["lineup", "playlist", "showtime"] as const;

// Placeholder choreographers until real names and photos are in.
const choreographers = [
  { photo: "/scenes/barista.webp", position: "center" },
  { photo: "/scenes/barista-pour.webp", position: "center" },
];

// Genre names stay as dance terms in both modes (like drink names): the
// band explains them.

// The Crew (About): the story, the choreographers, and why everything is
// named after dance.
export function AboutView() {
  const { t, plain, isPlain } = useCopy();

  return (
    <>
      <PageHero
        size="lg"
        title={t.pages.about}
        plainTitle={plain.pages.about}
        body={t.about.intro}
        image="/scenes/studio-rehearsal.webp"
      />

      <section
        aria-labelledby="about-story"
        className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-24 sm:py-32 lg:grid-cols-2 lg:gap-16"
      >
        <div>
          <SectionHeading
            id="about-story"
            align="start"
            title={t.about.storyTitle}
            plainTitle={plain.about.storyTitle}
          />
          <p className="max-w-prose text-lg">{t.about.storyBody}</p>
          <p className="mt-4 max-w-prose text-muted-foreground">
            {t.about.storyOrigin}
          </p>
        </div>
        <div className="lg:pt-4">
          <ul className="border-t border-border">
            {hooks.map((key, index) => (
              <Reveal
                as="li"
                key={key}
                delay={index * 0.08}
                className="grid gap-1 border-b border-border py-5 sm:grid-cols-3 sm:gap-6"
              >
                <div>
                  <p className="label-display text-xl leading-tight">
                    {t.terms[key]}
                  </p>
                  {!isPlain && (
                    <p className="text-sm text-muted-foreground">
                      {plain.terms[key]}
                    </p>
                  )}
                </div>
                <p className="text-muted-foreground sm:col-span-2">
                  {t.about.hooks[key]}
                </p>
              </Reveal>
            ))}
          </ul>
          <p className="mt-5 text-sm font-semibold">{t.about.plainSwitch}</p>
        </div>
      </section>

      <section aria-labelledby="about-crew" className="pb-24 sm:pb-32">
        <div className="mx-auto w-full max-w-6xl px-4">
          <SectionHeading
            id="about-crew"
            title={t.terms.choreographers}
            plainTitle={plain.terms.choreographers}
            body={t.about.crewBody}
          />
          <ul className="grid gap-6 sm:grid-cols-2">
            {choreographers.map((person, index) => (
              <Reveal as="li" key={person.photo} delay={index * 0.08}>
                <div className="group relative aspect-[4/5] overflow-hidden bg-muted">
                  <Image
                    src={person.photo}
                    alt=""
                    fill
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    style={{ objectPosition: person.position }}
                  />
                </div>
                <div className="border-b border-border py-4">
                  <span className="eyebrow text-highlight">
                    {t.about.baristaRole}
                  </span>
                  <h3 className="mt-1 font-heading text-2xl leading-[0.95] font-black uppercase [font-stretch:64%] sm:text-3xl">
                    {t.about.baristaName}
                  </h3>
                  <p className="mt-2 text-muted-foreground">
                    {t.about.baristaNote}
                  </p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section
        aria-labelledby="about-inspiration"
        className="theme-dark bg-background py-24 text-foreground sm:py-32"
      >
        <div className="mx-auto w-full max-w-6xl px-4">
          <SectionHeading
            id="about-inspiration"
            title={t.about.inspirationTitle}
            plainTitle={plain.about.inspirationTitle}
            body={t.about.inspirationBody}
          />
          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-0">
            {Object.entries(genreTerms).map(([slug, term], index) => (
              <Reveal
                as="li"
                key={slug}
                delay={index * 0.06}
                className="border-border lg:border-l lg:px-6 lg:first:border-l-0 lg:first:pl-0"
              >
                <IconTile
                  icon={genreIcon[slug]}
                  tone="custom"
                  size="md"
                  className={`${genreBlock[slug]} text-espresso`}
                />
                <h3 className="mt-4 label-display text-xl leading-tight">
                  {dance.terms[term]}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {plain.terms[term]}
                </p>
                <p className="mt-3 text-muted-foreground">
                  {t.about.genreWhy[term as keyof typeof t.about.genreWhy]}
                </p>
              </Reveal>
            ))}
          </ul>
          <div className="mt-14 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link
                href={routes.lineup.href}
                aria-label={plain.about.lineupCta}
              >
                {t.about.lineupCta}
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link
                href={routes.dictionary.href}
                aria-label={plain.about.dictionaryCta}
              >
                {t.about.dictionaryCta}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
