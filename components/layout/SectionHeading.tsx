"use client";

import { KineticTitle } from "@/components/motion/KineticTitle";
import { useCopy } from "@/hooks/use-copy";

type SectionHeadingProps = {
  id: string;
  title: string;
  // Plain meaning, shown in Dance mode beside the section number.
  plainTitle?: string;
  // Two-digit section number, e.g. "01".
  index?: string;
  children?: React.ReactNode;
};

// Section opener: a mono index line, a big title that types itself in as
// it scrolls into view (last word in the italic accent), and an optional
// action on the right, all sitting on a hairline.
export function SectionHeading({
  id,
  title,
  plainTitle,
  index,
  children,
}: SectionHeadingProps) {
  const { isPlain } = useCopy();
  const plainLine = !isPlain && plainTitle ? plainTitle : null;

  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-x-6 gap-y-4 border-b border-border pb-5">
      <div className="min-w-0">
        {(index || plainLine) && (
          <p className="mb-3 eyebrow text-muted-foreground">
            {index && <span className="text-highlight">({index})</span>}
            {index && plainLine && " "}
            {plainLine}
          </p>
        )}
        <KineticTitle
          as="h2"
          id={id}
          text={title}
          accentLast
          trigger="view"
          className="text-[clamp(2.5rem,7vw,4.75rem)] leading-[0.95]"
        />
      </div>
      {children}
    </div>
  );
}
