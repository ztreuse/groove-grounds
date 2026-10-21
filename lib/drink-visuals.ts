import type { CupState } from "@/components/remix/CupPreview";

// Illustrated cup for each menu drink, shown until its product photo is in
// public/drinks/. Colours are theme tokens from globals.css, written out in
// full so Tailwind keeps them.
type CupRecipe = Omit<CupState, "base" | "size" | "flavors"> & {
  liquid: string;
};

export const cupRecipes: Record<string, CupRecipe> = {
  "popping-shot": {
    liquid: "var(--color-brew-espresso)",
    temp: "hot",
    milk: false,
    shots: 1,
    toppings: [],
    ice: null,
  },
  "tutting-cortado": {
    liquid: "var(--color-brew-espresso)",
    temp: "hot",
    milk: true,
    shots: 0,
    toppings: [],
    ice: null,
  },
  "locking-flat-white": {
    liquid: "var(--color-brew-espresso)",
    temp: "hot",
    milk: true,
    shots: 0,
    toppings: [],
    ice: null,
  },
  "breakin-americano": {
    liquid: "var(--color-brew-cold)",
    temp: "hot",
    milk: false,
    shots: 0,
    toppings: [],
    ice: null,
  },
  "hip-hop-mocha": {
    liquid: "var(--color-brew-chocolate)",
    temp: "iced",
    milk: true,
    shots: 0,
    toppings: ["cinnamon-dust"],
    ice: "regular",
  },
  "waacking-caramel-macchiato": {
    liquid: "var(--color-brew-espresso)",
    temp: "iced",
    milk: true,
    shots: 0,
    toppings: ["caramel-drizzle"],
    ice: "regular",
  },
  "house-vanilla-latte": {
    liquid: "var(--color-brew-espresso)",
    temp: "hot",
    milk: true,
    shots: 0,
    toppings: [],
    ice: null,
  },
  "afro-spice-latte": {
    liquid: "var(--color-brew-spice)",
    temp: "hot",
    milk: true,
    shots: 0,
    toppings: ["cinnamon-dust"],
    ice: null,
  },
  "dancehall-coco-cold-brew": {
    liquid: "var(--color-brew-cold)",
    temp: "iced",
    milk: false,
    shots: 0,
    toppings: ["sea-salt-foam"],
    ice: "regular",
  },
  "amapiano-shaken-espresso": {
    liquid: "var(--color-brew-espresso)",
    temp: "iced",
    milk: true,
    shots: 0,
    toppings: [],
    ice: "regular",
  },
  "krump-cold-brew": {
    liquid: "var(--color-brew-cold)",
    temp: "iced",
    milk: false,
    shots: 2,
    toppings: [],
    ice: "extra",
  },
  "open-style": {
    liquid: "var(--color-brew-ube)",
    temp: "iced",
    milk: true,
    shots: 0,
    toppings: ["sea-salt-foam"],
    ice: "light",
  },
  "vogue-rose-latte": {
    liquid: "var(--color-brew-rose)",
    temp: "hot",
    milk: true,
    shots: 0,
    toppings: [],
    ice: null,
  },
  "jersey-club-frappe": {
    liquid: "var(--color-brew-chocolate)",
    temp: "blended",
    milk: true,
    shots: 0,
    toppings: ["whipped-cream"],
    ice: null,
  },
  "heels-strawberry-cream": {
    liquid: "var(--color-brew-strawberry)",
    temp: "blended",
    milk: false,
    shots: 0,
    toppings: ["whipped-cream"],
    ice: null,
  },
  "k-choreo-ube-latte": {
    liquid: "var(--color-brew-ube)",
    temp: "iced",
    milk: true,
    shots: 0,
    toppings: [],
    ice: "regular",
  },
  "lyrical-matcha": {
    liquid: "var(--color-brew-matcha)",
    temp: "iced",
    milk: true,
    shots: 0,
    toppings: [],
    ice: "regular",
  },
  "litefeet-lemonade": {
    liquid: "var(--color-brew-lemonade)",
    temp: "iced",
    milk: false,
    shots: 0,
    toppings: [],
    ice: "regular",
  },
};

export function cupStateFor(slug: string): CupState | null {
  const recipe = cupRecipes[slug];
  if (!recipe) return null;
  return { ...recipe, base: slug, size: "count-16", flavors: 0 };
}
