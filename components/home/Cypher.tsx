"use client";

import { useCopy } from "@/hooks/use-copy";
import { cypherPosts } from "@/lib/cypher";

// Flyers pinned to the community board: one big, two small, each its own
// paper colour and tilt, with tape on top.
const flyerStyles = [
  "md:col-span-3 md:row-span-2 bg-cream text-espresso -rotate-1",
  "md:col-span-2 bg-lilac text-espresso rotate-2",
  "md:col-span-2 bg-espresso text-cream -rotate-2 dark:bg-espresso-deep",
];

export function Cypher() {
  const { t, plain, isPlain } = useCopy();
  const pick = (wording: { dance: string; plain: string }) =>
    isPlain ? wording.plain : wording.dance;

  return (
    <section aria-labelledby="cypher" className="mx-auto w-full max-w-6xl px-4">
      <h2 id="cypher" className="text-5xl leading-none sm:text-6xl">
        {t.terms.cypher}
      </h2>
      {!isPlain && (
        <p className="mt-1 text-muted-foreground">{plain.terms.cypher}</p>
      )}
      <p className="mt-3 max-w-prose">{t.home.cypherIntro}</p>

      <ul className="mt-8 grid gap-6 rounded-[1.75rem] bg-secondary p-6 sm:p-8 md:grid-cols-5 dark:bg-espresso-soft">
        {cypherPosts.map((post, index) => (
          <li
            key={post.id}
            className={`relative flex flex-col p-6 shadow-[0_16px_30px_-18px_rgb(43_30_23_/_0.6)] ${flyerStyles[index % flyerStyles.length]}`}
          >
            <span
              aria-hidden
              className="absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 rotate-2 bg-khaki/80"
            />
            <span className="text-xs font-bold tracking-wide uppercase opacity-80">
              {pick(post.tag)}
            </span>
            <h3
              className={`mt-3 leading-[0.95] ${index === 0 ? "text-4xl sm:text-5xl" : "text-2xl"}`}
            >
              {pick(post.title)}
            </h3>
            <p className="mt-3 flex-1">{pick(post.body)}</p>
            <p className="mt-5 text-sm font-semibold">{post.author}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
