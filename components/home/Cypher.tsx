"use client";

import Image from "next/image";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { useCopy } from "@/hooks/use-copy";
import { cypherPosts } from "@/lib/cypher";

// Community board: one featured post on a dance photo, two smaller flyers.
const flyerStyles = [
  "theme-dark grain md:col-span-3 md:row-span-2 md:min-h-[28rem] bg-background",
  "md:col-span-2 bg-lilac text-espresso",
  "md:col-span-2 bg-espresso text-cream dark:bg-espresso-soft",
];

export function Cypher() {
  const { t, plain, isPlain } = useCopy();
  const pick = (wording: { dance: string; plain: string }) =>
    isPlain ? wording.plain : wording.dance;

  return (
    <section aria-labelledby="cypher" className="mx-auto w-full max-w-6xl px-4">
      <SectionHeading
        id="cypher"
        index="04"
        title={t.terms.cypher}
        plainTitle={plain.terms.cypher}
      >
        <p className="max-w-xs text-muted-foreground">{t.home.cypherIntro}</p>
      </SectionHeading>

      <ul className="grid gap-4 md:grid-cols-5">
        {cypherPosts.map((post, index) => (
          <Reveal
            as="li"
            delay={index * 0.08}
            key={post.id}
            className={`group relative flex min-h-60 flex-col overflow-hidden rounded-[1.75rem] p-7 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 ${flyerStyles[index % flyerStyles.length]}`}
          >
            {index === 0 && (
              <>
                <Image
                  src="/scenes/bboy.webp"
                  alt=""
                  fill
                  sizes="(min-width: 768px) 60vw, 100vw"
                  className="object-cover object-[70%_center] opacity-60 transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                />
                <span
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-espresso-deep via-espresso-deep/70 to-espresso-deep/10"
                />
              </>
            )}
            <span className="relative eyebrow opacity-80">
              {pick(post.tag)}
            </span>
            <h3
              className={`relative leading-[0.95] ${
                index === 0
                  ? "mt-auto pt-16 text-4xl sm:text-5xl"
                  : "mt-4 text-2xl"
              }`}
            >
              {pick(post.title)}
            </h3>
            <p
              className={`relative mt-3 ${index === 0 ? "max-w-md text-foreground/80" : "flex-1"}`}
            >
              {pick(post.body)}
            </p>
            <p className="relative mt-6 eyebrow opacity-80">{post.author}</p>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
