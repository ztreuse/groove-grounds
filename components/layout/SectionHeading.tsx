"use client";

import { KineticTitle } from "@/components/motion/KineticTitle";
import { useCopy } from "@/hooks/use-copy";

type SectionHeadingProps = {
  id: string;
  title: string;
  // Plain meaning, shown in Dance mode after the section number.
  plainTitle?: string;
  // Two-digit section number, e.g. "01".
  index?: string;
  body?: React.ReactNode;
  align?: "center" | "start";
  children?: React.ReactNode;
};

// Section opener: "01 — plain meaning" in mono, a poster-caps title that
// types itself in as it scrolls into view (last word in the italic
// accent), an optional line of body copy and actions underneath.
export function SectionHeading({
  id,
  title,
  plainTitle,
  index,
  body,
  align = "center",
  children,
}: SectionHeadingProps) {
  const { isPlain } = useCopy();
  const plainLine = !isPlain && plainTitle ? plainTitle : null;
  const center = align === "center";

  return (
    <div
      className={`mb-10 flex flex-col gap-4 sm:mb-14 ${
        center ? "items-center text-center" : "items-start"
      }`}
    >
      {(index || plainLine) && (
        <p className="eyebrow text-muted-foreground">
          {index && <span className="text-highlight">{index}</span>}
          {index && plainLine && " — "}
          {plainLine}
        </p>
      )}
      <KineticTitle
        as="h2"
        id={id}
        text={title}
        accentLast
        trigger="view"
        className="max-w-[16ch] text-[clamp(3rem,8vw,6.5rem)] leading-[0.88] font-black tracking-normal uppercase [font-stretch:64%]"
      />
      {body && (
        <div
          className={`max-w-md text-muted-foreground ${center ? "mx-auto" : ""}`}
        >
          {body}
        </div>
      )}
      {children}
    </div>
  );
}
