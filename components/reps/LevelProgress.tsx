"use client";

import { motion } from "motion/react";
import { useCopy } from "@/hooks/use-copy";
import { fill } from "@/lib/copy";
import { levelProgress } from "@/lib/reps";

// Level name, a bar through the current step, and Reps to the next level.
// Used on the Dancer Profile and the Reps page.
export function LevelProgress({ reps }: { reps: number }) {
  const { t, plain } = useCopy();
  const { current, next, needed, progress } = levelProgress(reps);

  return (
    <div>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
        aria-label={
          next
            ? fill(plain.reps.toNext, {
                count: needed,
                level: plain.levels[next.copy],
              })
            : plain.reps.topLevel
        }
        className="h-2 overflow-hidden rounded-full bg-muted"
      >
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: progress }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="h-full origin-left rounded-full bg-primary"
        />
      </div>
      <p className="mt-2 flex justify-between gap-3 text-sm">
        <span className="font-semibold">{t.levels[current.copy]}</span>
        <span className="text-muted-foreground">
          {next
            ? fill(t.reps.toNext, { count: needed, level: t.levels[next.copy] })
            : t.reps.topLevel}
        </span>
      </p>
    </div>
  );
}
