"use client";

import { Suspense, useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CrewIcon,
  CupIcon,
  FreestyleIcon,
  StageIcon,
} from "@/components/icons/GrooveIcons";
import { useCopy } from "@/hooks/use-copy";
import type { PageKey, TermKey } from "@/lib/copy";
import type { GrooveIcon } from "@/components/icons/GrooveIcons";
import { IconTile } from "./IconTile";
import { routes } from "@/lib/routes";

// Standard icons (house, cup) so the layout stays familiar. The account
// lives on the user icon beside the cart, not in this list.
const navItems: { page: PageKey; term: TermKey; icon: GrooveIcon }[] = [
  { page: "home", term: "centerStage", icon: StageIcon },
  { page: "lineup", term: "lineup", icon: CupIcon },
  { page: "freestyle", term: "freestyle", icon: FreestyleIcon },
  { page: "crew", term: "crewOrder", icon: CrewIcon },
];

type NavListProps = {
  variant: "bar" | "sheet";
  pathname: string | null;
  onNavigate?: () => void;
};

function isActive(href: string, pathname: string | null) {
  if (!pathname) return false;
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

function NavList({ variant, pathname, onNavigate }: NavListProps) {
  const { t, plain, isPlain } = useCopy();
  // Bar only: a soft pill glides to whichever link is hovered.
  const [hovered, setHovered] = useState<PageKey | null>(null);

  return (
    <ul
      className={variant === "bar" ? "flex items-center gap-0.5" : "grid"}
      onMouseLeave={() => setHovered(null)}
    >
      {navItems.map(({ page, term, icon: Icon }) => {
        const { href } = routes[page];
        const active = isActive(href, pathname);
        return (
          <li
            key={page}
            className="relative"
            onMouseEnter={() => setHovered(page)}
          >
            {variant === "bar" && hovered === page && (
              <motion.span
                aria-hidden
                layoutId="nav-hover"
                transition={{ type: "spring", stiffness: 500, damping: 40 }}
                className="absolute inset-x-3 bottom-1 h-0.5 bg-highlight"
              />
            )}
            <Link
              href={href}
              aria-label={plain.terms[term]}
              aria-current={active ? "page" : undefined}
              onClick={onNavigate}
              className={
                variant === "bar"
                  ? `relative flex min-h-11 flex-col justify-center rounded-full px-3 py-1 whitespace-nowrap outline-none focus-visible:ring-3 focus-visible:ring-ring ${
                      active ? "text-highlight" : ""
                    }`
                  : `flex min-h-14 items-center gap-3 rounded-md px-3 py-2 transition-colors outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-3 focus-visible:ring-ring ${
                      active ? "bg-muted text-highlight" : ""
                    }`
              }
            >
              {variant === "sheet" && (
                <IconTile icon={Icon} tone={active ? "accent" : "neutral"} />
              )}
              <span>
                <span
                  className={`block font-semibold ${
                    variant === "sheet" ? "text-base" : "text-sm"
                  }`}
                >
                  {t.terms[term]}
                </span>
                {!isPlain && (
                  <span className="block text-xs text-muted-foreground">
                    {plain.terms[term]}
                  </span>
                )}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function ActiveNavList(props: Omit<NavListProps, "pathname">) {
  const pathname = usePathname();
  return <NavList {...props} pathname={pathname} />;
}

// usePathname suspends on dynamic routes under Cache Components, so the
// fallback renders the same list without the active state.
export function MainNav(props: Omit<NavListProps, "pathname">) {
  return (
    <Suspense fallback={<NavList {...props} pathname={null} />}>
      <ActiveNavList {...props} />
    </Suspense>
  );
}

// Menu only: the pages that live in the footer on wide screens (About,
// Find the Studio, Dance Dictionary), as a smaller second group.
const moreItems: PageKey[] = ["about", "studio", "dictionary"];

function MoreList({
  pathname,
  onNavigate,
}: {
  pathname: string | null;
  onNavigate?: () => void;
}) {
  const { t, plain, isPlain } = useCopy();

  return (
    <div>
      <p className="px-3 eyebrow text-muted-foreground">{t.header.more}</p>
      <ul className="mt-1 grid">
        {moreItems.map((page) => {
          const { href } = routes[page];
          const active = isActive(href, pathname);
          return (
            <li key={page}>
              <Link
                href={href}
                aria-label={plain.pages[page]}
                aria-current={active ? "page" : undefined}
                onClick={onNavigate}
                className={`flex min-h-12 flex-col justify-center rounded-md px-3 py-1.5 transition-colors outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-3 focus-visible:ring-ring ${
                  active ? "bg-muted text-highlight" : ""
                }`}
              >
                <span className="text-sm font-semibold">{t.pages[page]}</span>
                {!isPlain && plain.pages[page] !== t.pages[page] && (
                  <span className="text-xs text-muted-foreground">
                    {plain.pages[page]}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function ActiveMoreList(props: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return <MoreList {...props} pathname={pathname} />;
}

export function MoreNav(props: { onNavigate?: () => void }) {
  return (
    <Suspense fallback={<MoreList {...props} pathname={null} />}>
      <ActiveMoreList {...props} />
    </Suspense>
  );
}
