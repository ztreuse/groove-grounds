"use client";

import { StarIcon } from "@/components/icons/GrooveIcons";
import { useCopy } from "@/hooks/use-copy";
import { fill } from "@/lib/copy";
import type { DrinkProps } from "@/lib/db/props";

function Stars({ value, size = "size-5" }: { value: number; size?: string }) {
  return (
    <span aria-hidden className="flex">
      {[1, 2, 3, 4, 5].map((n) => (
        <StarIcon
          key={n}
          className={`${size} ${n <= Math.round(value) ? "text-primary" : "text-muted-foreground/30"}`}
        />
      ))}
    </span>
  );
}

// Props on a drink page: average, count and the latest comments.
export function DrinkPropsSection({ props }: { props: DrinkProps }) {
  const { t, plain, isPlain } = useCopy();
  const countLabel = (copy: typeof t) =>
    props.total === 1
      ? copy.props.countOne
      : fill(copy.props.count, { count: props.total });

  return (
    <section
      aria-labelledby="drink-props"
      className="mx-auto w-full max-w-6xl px-4 pt-6 pb-16"
    >
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-3">
        <div>
          <h2 id="drink-props" className="text-3xl leading-none">
            {t.props.title}
          </h2>
          {!isPlain && (
            <p className="mt-1 text-sm text-muted-foreground">
              {plain.props.title}
            </p>
          )}
        </div>
        {props.average !== null && (
          <div
            className="flex items-center gap-3"
            aria-label={`${fill(plain.props.average, { average: props.average.toFixed(1) })}, ${countLabel(plain)}`}
          >
            <span className="font-heading text-4xl leading-none font-black [font-stretch:70%]">
              {props.average.toFixed(1)}
            </span>
            <span>
              <Stars value={props.average} />
              <span className="text-sm text-muted-foreground">
                {countLabel(t)}
              </span>
            </span>
          </div>
        )}
      </div>

      {props.total === 0 ? (
        <p className="mt-4 text-muted-foreground">{t.props.none}</p>
      ) : (
        props.recent.length > 0 && (
          <ul className="mt-4 grid gap-3 md:grid-cols-3">
            {props.recent.map((entry) => (
              <li key={entry.id} className="surface p-4">
                <Stars value={entry.rating} size="size-4" />
                <p className="mt-2">{entry.comment}</p>
                <p className="mt-2 text-sm font-semibold text-muted-foreground">
                  {entry.name
                    ? fill(t.props.from, { name: entry.name })
                    : t.props.anonymous}
                </p>
              </li>
            ))}
          </ul>
        )
      )}
    </section>
  );
}
