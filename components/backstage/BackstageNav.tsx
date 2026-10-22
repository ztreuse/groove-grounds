"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCopy } from "@/hooks/use-copy";
import { useScrollEdges } from "@/hooks/use-scroll-edges";
import type { PageKey } from "@/lib/copy";
import { routes } from "@/lib/routes";

const tabs: PageKey[] = [
  "backstageQueue",
  "backstageLineup",
  "backstageSchedule",
  "backstageCrewOrders",
  "backstage",
];

function Tabs({ pathname }: { pathname: string | null }) {
  const { t, plain } = useCopy();
  const edges = useScrollEdges<HTMLUListElement>();

  return (
    <nav
      aria-label={plain.backstageNav.label}
      className="border-b border-border"
    >
      <ul
        ref={edges}
        className="-mx-4 flex scroll-pl-4 [scrollbar-width:none] gap-1 overflow-x-auto scroll-edges px-4 md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {tabs.map((page) => {
          const { href } = routes[page];
          const active = pathname === href;
          return (
            <li key={page} className="shrink-0">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                aria-label={plain.pages[page]}
                className={`relative inline-flex min-h-12 items-center px-3 text-sm font-semibold whitespace-nowrap outline-none focus-visible:ring-3 focus-visible:ring-ring ${
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="label-display text-[15px]">
                  {t.pages[page]}
                </span>
                {active && (
                  <span
                    aria-hidden
                    className="absolute inset-x-3 -bottom-px h-0.5 bg-highlight"
                  />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function ActiveTabs() {
  return <Tabs pathname={usePathname()} />;
}

// Section tabs across every Backstage page.
export function BackstageNav() {
  return (
    <Suspense fallback={<Tabs pathname={null} />}>
      <ActiveTabs />
    </Suspense>
  );
}
