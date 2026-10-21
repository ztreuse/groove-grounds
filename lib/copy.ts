// All UI labels live here. `dance` and `plain` must have the same keys.
// Step 2 adds the full glossary and the useCopy() hook.

type Widen<T> = { [K in keyof T]: T[K] extends string ? string : Widen<T[K]> };

export const dance = {
  brand: "Groove Grounds",
  tagline: "Coffee with a beat. Order for pickup, your way.",
  demoBanner: "Concept demo by ztreuse — no real orders or payments.",
  placeholder: {
    comingSoon: "This routine is still in rehearsal.",
    phase: "Phase",
    customerPages: "Customer pages",
    backstagePages: "Backstage",
  },
  phases: {
    1: "Choreo",
    2: "Full out",
    3: "Battle ready",
  },
  pages: {
    home: "Center Stage",
    lineup: "The Lineup",
    drink: "Remix",
    freestyle: "Freestyle",
    playlist: "Playlist",
    showtime: "Showtime",
    track: "Live tracker",
    crew: "Crew Order",
    profile: "Dancer Profile",
    reps: "Reps & Levels",
    about: "The Crew",
    studio: "Find the Studio",
    dictionary: "Dance Dictionary",
    join: "Join the Crew",
    login: "Sign in",
    backstage: "Backstage",
    backstageQueue: "Order queue",
    backstageLineup: "Menu manager",
    backstageSchedule: "Class schedule",
    backstageCrewOrders: "Crew Order requests",
  },
} as const;

export const plain: Widen<typeof dance> = {
  brand: "Groove Grounds",
  tagline: "Coffee with a beat. Order for pickup, your way.",
  demoBanner: "Concept demo by ztreuse — no real orders or payments.",
  placeholder: {
    comingSoon: "This page is coming soon.",
    phase: "Phase",
    customerPages: "Customer pages",
    backstagePages: "Admin pages",
  },
  phases: {
    1: "MVP",
    2: "Accounts and builder",
    3: "Loyalty and community",
  },
  pages: {
    home: "Home",
    lineup: "Menu",
    drink: "Customize a drink",
    freestyle: "Build your own drink",
    playlist: "Cart",
    showtime: "Checkout",
    track: "Order tracker",
    crew: "Group order",
    profile: "Account",
    reps: "Loyalty points & tiers",
    about: "About",
    studio: "Location & hours",
    dictionary: "Glossary",
    join: "Sign up",
    login: "Log in",
    backstage: "Admin dashboard",
    backstageQueue: "Order queue",
    backstageLineup: "Menu manager",
    backstageSchedule: "Pickup schedule",
    backstageCrewOrders: "Group order requests",
  },
};

export type Copy = Widen<typeof dance>;
export type PageKey = keyof Copy["pages"];
export type PhaseKey = keyof Copy["phases"];
