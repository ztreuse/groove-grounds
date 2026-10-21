"use client";

import { useCopy } from "@/hooks/use-copy";
import { cypherPosts } from "@/lib/cypher";

export function Cypher() {
  const { t, plain, isPlain } = useCopy();
  const pick = (wording: { dance: string; plain: string }) =>
    isPlain ? wording.plain : wording.dance;

  return (
    <section aria-labelledby="cypher" className="mx-auto w-full max-w-6xl px-4">
      <div className="mb-4">
        <h2 id="cypher" className="text-4xl leading-none">
          {t.terms.cypher}
        </h2>
        {!isPlain && (
          <p className="mt-1 text-sm text-muted-foreground">
            {plain.terms.cypher}
          </p>
        )}
        <p className="mt-2 max-w-prose">{t.home.cypherIntro}</p>
      </div>
      <ul className="grid gap-3 md:grid-cols-3">
        {cypherPosts.map((post) => (
          <li
            key={post.id}
            className="flex flex-col rounded-2xl border-2 bg-card p-5"
          >
            <span className="-rotate-2 self-start rounded-md bg-lilac px-2.5 py-1 text-xs font-bold tracking-wider text-espresso uppercase">
              {pick(post.tag)}
            </span>
            <h3 className="mt-3 text-2xl leading-tight">{pick(post.title)}</h3>
            <p className="mt-2 flex-1 text-muted-foreground">
              {pick(post.body)}
            </p>
            <p className="mt-4 text-sm font-semibold">{post.author}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
