"use client";

import { useCopy } from "@/hooks/use-copy";

type MissedCountProps = {
  // Big poster numbers on top, e.g. 4-0-4 or 5-6-7-(8).
  display: React.ReactNode;
  // Heading in the current mode, and its plain meaning for under it.
  title: string;
  plainTitle: string;
  body: string;
  // Buttons under the message.
  children?: React.ReactNode;
};

// "You missed a count": the shared layout for the 404 and error pages.
export function MissedCount({
  display,
  title,
  plainTitle,
  body,
  children,
}: MissedCountProps) {
  const { isPlain } = useCopy();

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-start justify-center px-4 py-16">
      <p
        aria-hidden
        className="font-heading text-[clamp(8rem,30vw,16rem)] leading-[0.8] font-black text-highlight [font-stretch:62%]"
      >
        {display}
      </p>
      <h1 className="mt-6 text-5xl sm:text-7xl">{title}</h1>
      {!isPlain && plainTitle !== title && (
        <p className="mt-3 eyebrow text-muted-foreground">{plainTitle}</p>
      )}
      <p className="mt-6 max-w-prose text-lg">{body}</p>
      {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
    </main>
  );
}

// A faded, outlined numeral inside the display (the "missed" count).
export function Missed({ children }: { children: React.ReactNode }) {
  return <span className="text-foreground/40 text-outline">{children}</span>;
}
