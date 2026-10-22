"use client";

import { Suspense, useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Coffee, House, Sparkles, User, Users } from "lucide-react";
import { useCopy } from "@/hooks/use-copy";
import type { PageKey, TermKey } from "@/lib/copy";
import { routes } from "@/lib/routes";

// Standard icons (house, cup, user) so the layout stays familiar.
const navItems: { page: PageKey; term: TermKey; icon: typeof House }[] = [
  { page: "home", term: "centerStage", icon: House },
  { page: "lineup", term: "lineup", icon: Coffee },
  { page: "freestyle", term: "freestyle", icon: Sparkles },
  { page: "crew", term: "crewOrder", icon: Users },
  { page: "profile", term: "dancerProfile", icon: User },
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
                className="absolute inset-0 rounded-full bg-muted"
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
                  : `flex min-h-14 items-center gap-3 rounded-xl px-3 py-2 transition-colors outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-3 focus-visible:ring-ring ${
                      active ? "bg-muted text-highlight" : ""
                    }`
              }
            >
              {variant === "sheet" && (
                <Icon aria-hidden className="size-5 shrink-0" />
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
