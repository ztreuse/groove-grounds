"use client";

import { KineticTitle } from "@/components/motion/KineticTitle";
import { useCopy } from "@/hooks/use-copy";

type SectionHeadingProps = {
  id: string;
  title: string;
  // Plain meaning, shown under the title in Dance mode.
  plainTitle?: string;
  body?: React.ReactNode;
  align?: "center" | "start";
  children?: React.ReactNode;
};

// Section opener: a poster-caps title that types itself in as it scrolls
// into view, the plain meaning under it, then optional body and actions.
export function SectionHeading({
  id,
  title,
  plainTitle,
  body,
  align = "center",
  children,
}: SectionHeadingProps) {
  const { isPlain } = useCopy();
  const center = align === "center";

  return (
    <div
      className={`mb-10 flex flex-col gap-3 sm:mb-14 ${
        center ? "items-center text-center" : "items-start"
      }`}
    >
      <KineticTitle
        as="h2"
        id={id}
        text={title}
        trigger="view"
        className="max-w-[16ch] text-[clamp(3rem,8vw,6.5rem)] leading-[0.88] font-black tracking-normal uppercase [font-stretch:64%]"
      />
      {!isPlain && plainTitle && (
        <p className="text-sm font-medium text-muted-foreground">
          {plainTitle}
        </p>
      )}
      {body && (
        <div
          className={`mt-1 max-w-md text-muted-foreground ${center ? "mx-auto" : ""}`}
        >
          {body}
        </div>
      )}
      {children}
    </div>
  );
}
