import type { PageKey, PhaseKey } from "@/lib/copy";

type RouteInfo = {
  href: string;
  area: "shop" | "backstage";
  // Build phase from docs/PROJECT.md; null when the spec doesn't assign one.
  phase: PhaseKey | null;
};

export const routes: Record<PageKey, RouteInfo> = {
  home: { href: "/", area: "shop", phase: 1 },
  lineup: { href: "/lineup", area: "shop", phase: 1 },
  drink: { href: "/lineup/house-vanilla-latte", area: "shop", phase: 1 },
  playlist: { href: "/playlist", area: "shop", phase: 1 },
  showtime: { href: "/showtime", area: "shop", phase: 1 },
  track: { href: "/track/demo", area: "shop", phase: 1 },
  freestyle: { href: "/freestyle", area: "shop", phase: 2 },
  profile: { href: "/profile", area: "shop", phase: 2 },
  dictionary: { href: "/dictionary", area: "shop", phase: 2 },
  join: { href: "/join", area: "shop", phase: 2 },
  login: { href: "/login", area: "shop", phase: 2 },
  crew: { href: "/crew", area: "shop", phase: 3 },
  reps: { href: "/reps", area: "shop", phase: 3 },
  about: { href: "/about", area: "shop", phase: null },
  studio: { href: "/studio", area: "shop", phase: null },
  backstageQueue: { href: "/backstage/queue", area: "backstage", phase: 1 },
  backstageLineup: { href: "/backstage/lineup", area: "backstage", phase: 1 },
  backstageSchedule: {
    href: "/backstage/schedule",
    area: "backstage",
    phase: 2,
  },
  backstage: { href: "/backstage", area: "backstage", phase: 3 },
  backstageCypher: { href: "/backstage/cypher", area: "backstage", phase: 3 },
  backstageCrewOrders: {
    href: "/backstage/crew-orders",
    area: "backstage",
    phase: 3,
  },
};
