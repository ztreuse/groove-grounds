"use client";

import { useCopy } from "@/hooks/use-copy";

const counts = ["5", "6", "7", "8"];

// "5, 6, 7, 8…" loader: the count-in before the music starts.
export function CountIn() {
  const { t, plain, isPlain } = useCopy();

  return (
    <div
      role="status"
      aria-label={plain.terms.loading}
      className="flex flex-1 flex-col items-center justify-center gap-3 py-24"
    >
      {isPlain ? (
        <p className="text-lg font-semibold">{t.terms.loading}</p>
      ) : (
        <p aria-hidden className="flex gap-4 font-heading text-6xl">
          {counts.map((count, index) => (
            <span
              key={count}
              className="animate-count-in text-highlight motion-reduce:animate-none"
              style={{ animationDelay: `${index * 0.5}s` }}
            >
              {count}
            </span>
          ))}
        </p>
      )}
    </div>
  );
}
