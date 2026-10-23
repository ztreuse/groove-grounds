"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { useCopy } from "@/hooks/use-copy";
import type { CypherPost } from "@/lib/cypher";

// Photos from the floor, drifting sideways as the page scrolls.
const floor = [
  { src: "/scenes/bboy.webp", position: "70% center" },
  { src: "/scenes/barista.webp", position: "center" },
  { src: "/scenes/crew-color.webp", position: "center" },
  { src: "/scenes/barista-pour.webp", position: "center" },
  { src: "/scenes/crew-smoke.webp", position: "40% center" },
  { src: "/scenes/sneakers.webp", position: "center" },
];

// Community board: a scroll-drifting strip of photos, then the posts as
// columns split by hairlines, each signed like a flyer.
export function Cypher({ posts }: { posts: CypherPost[] }) {
  const { t, plain, isPlain } = useCopy();
  const strip = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: strip,
    offset: ["start end", "end start"],
  });
  // Drifts the whole time it's on screen; it starts a little to the right,
  // so the first photo is still fully in view when the strip is centred.
  const x = useTransform(scrollYProgress, [0, 1], ["3%", "-12%"]);
  const pick = (wording: { dance: string; plain: string }) =>
    isPlain ? wording.plain : wording.dance;

  return (
    <section aria-labelledby="cypher">
      <div className="mx-auto w-full max-w-6xl px-4">
        <SectionHeading
          id="cypher"
          title={t.terms.cypher}
          plainTitle={plain.terms.cypher}
          body={t.home.cypherIntro}
        />
      </div>

      <div ref={strip} aria-hidden className="overflow-hidden">
        <motion.div
          style={{ x }}
          className="flex w-max gap-4 pl-[max(1rem,calc((100vw-72rem)/2+1rem))] sm:gap-6"
        >
          {floor.map((photo, index) => (
            <div
              key={photo.src}
              className={`relative w-48 shrink-0 overflow-hidden sm:w-72 ${
                index % 2 ? "mt-10 aspect-[3/4]" : "aspect-[4/5]"
              }`}
            >
              <Image
                src={photo.src}
                alt=""
                fill
                sizes="288px"
                className="object-cover"
                style={{ objectPosition: photo.position }}
              />
            </div>
          ))}
        </motion.div>
      </div>

      {posts.length > 0 && (
        <ul className="mx-auto mt-16 grid w-full max-w-6xl gap-10 px-4 md:grid-cols-3 md:gap-0">
          {posts.map((post, index) => (
            <Reveal
              as="li"
              delay={index * 0.08}
              key={post.id}
              className="flex flex-col border-border md:border-l md:px-8 md:first:border-l-0 md:first:pl-0"
            >
              <span className="eyebrow text-highlight">{pick(post.tag)}</span>
              <h3 className="mt-3 text-2xl leading-tight">
                {pick(post.title)}
              </h3>
              <p className="mt-3 flex-1 text-muted-foreground">
                {pick(post.body)}
              </p>
              <p className="mt-6 flex items-center gap-3 text-sm font-semibold">
                <span
                  aria-hidden
                  className="flex size-9 items-center justify-center rounded-full bg-lilac font-heading text-xs font-black text-espresso uppercase"
                >
                  {post.author.replace("@", "").slice(0, 2)}
                </span>
                {post.author}
              </p>
            </Reveal>
          ))}
        </ul>
      )}
    </section>
  );
}
