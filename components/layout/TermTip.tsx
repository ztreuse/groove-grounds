"use client";

import Link from "next/link";
import { CircleHelp } from "lucide-react";
import { Popover } from "radix-ui";
import { useCopy } from "@/hooks/use-copy";
import { fill } from "@/lib/copy";
import { whyFor } from "@/lib/dictionary";
import { routes } from "@/lib/routes";

type TermTipProps = {
  // The dance term as shown, and its plain meaning.
  term: string;
  plain: string;
};

// "?" beside a dance term: tap for its plain meaning and why it fits, with
// a link to the Dance Dictionary. Dance mode only (Plain mode already shows
// the plain word). Renders nothing for terms the glossary doesn't cover.
export function TermTip({ term, plain: plainWord }: TermTipProps) {
  const { t, plain, isPlain } = useCopy();
  const why = whyFor(term);
  if (isPlain || !why) return null;

  return (
    <Popover.Root>
      <Popover.Trigger
        aria-label={fill(plain.termTip.label, { term })}
        className="relative inline-flex size-6 shrink-0 items-center justify-center rounded-full align-middle text-muted-foreground outline-none after:absolute after:-inset-2.5 after:content-[''] hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring data-[state=open]:text-highlight"
      >
        <CircleHelp aria-hidden className="size-4.5" />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          side="top"
          align="start"
          sideOffset={8}
          collisionPadding={16}
          className="z-50 max-w-72 rounded-md bg-espresso p-4 text-sm text-cream shadow-lg outline-none data-[state=open]:animate-in data-[state=open]:zoom-in-95 data-[state=open]:fade-in"
        >
          <p className="font-semibold">
            {term} <span className="font-medium text-khaki">· {plainWord}</span>
          </p>
          <p className="mt-1.5">{why}</p>
          <Popover.Close asChild>
            <Link
              href={routes.dictionary.href}
              className="mt-3 inline-flex min-h-11 items-center font-semibold text-lilac underline underline-offset-4 outline-none focus-visible:ring-3 focus-visible:ring-lilac"
            >
              {t.termTip.more}
            </Link>
          </Popover.Close>
          <Popover.Arrow className="fill-espresso" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
