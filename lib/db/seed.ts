// Loads the menu from docs/PROJECT.md: genres, drinks, Intermission snacks and
// every Remix option. Safe to run again: rows are upserted by slug.
// Run with `npm run db:seed`.
import { inArray, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { dance, plain } from "../copy";
import * as schema from "./schema";

const { genres, drinks, optionGroups, options, drinkOptionGroups } = schema;

type Temperature = (typeof schema.temperatureEnum.enumValues)[number];
type GroupType = (typeof schema.optionGroupTypeEnum.enumValues)[number];

// Labels shared with the UI come from lib/copy.ts.
const label = (key: keyof typeof dance.remix) => ({
  danceLabel: dance.remix[key],
  plainLabel: plain.remix[key],
});
// Plain ingredients (milks, syrups, toppings) read the same in both modes.
const same = (text: string) => ({ danceLabel: text, plainLabel: text });

const genreRows = [
  { slug: "old-school", name: dance.terms.oldSchool },
  { slug: "new-school", name: dance.terms.newSchool },
  { slug: "mashup", name: dance.terms.mashup },
  { slug: "off-beat", name: dance.terms.offBeat },
  { slug: "intermission", name: dance.terms.intermission },
  // Hidden from The Lineup: holds the Freestyle builder's bases.
  { slug: "freestyle", name: dance.terms.freestyle },
];

type GroupSeed = {
  slug: string;
  name: string;
  danceLabel: string;
  plainLabel: string;
  type: GroupType;
  required: boolean;
  maxSelect?: number;
  options: {
    slug: string;
    name: string;
    danceLabel: string;
    plainLabel: string;
    priceDelta?: number;
  }[];
};

const groupSeeds: GroupSeed[] = [
  {
    slug: "counts",
    name: "Size",
    ...label("counts"),
    type: "single",
    required: true,
    options: [
      { slug: "count-8", name: "12 oz", ...label("count8") },
      { slug: "count-16", name: "16 oz", ...label("count16"), priceDelta: 20 },
      { slug: "count-32", name: "22 oz", ...label("count32"), priceDelta: 40 },
    ],
  },
  {
    slug: "temperature",
    name: "Temperature",
    ...label("temperature"),
    type: "single",
    required: true,
    options: [
      { slug: "hot", name: "Hot", ...label("warmUp") },
      { slug: "iced", name: "Iced", ...label("coolDown") },
      { slug: "blended", name: "Blended", ...label("blended"), priceDelta: 20 },
    ],
  },
  {
    slug: "energy",
    name: "Caffeine",
    ...label("energy"),
    type: "single",
    required: true,
    options: [
      { slug: "marking", name: "Decaf", ...label("marking") },
      { slug: "half-out", name: "Half-caf", ...label("halfOut") },
      { slug: "full-out", name: "Regular", ...label("fullOut") },
    ],
  },
  {
    slug: "shots",
    name: "Extra shots",
    ...label("extraShots"),
    type: "single",
    required: false,
    options: [
      {
        slug: "double-time",
        name: "+1 shot",
        ...label("doubleTime"),
        priceDelta: 30,
      },
      {
        slug: "triple-time",
        name: "+2 shots",
        ...label("tripleTime"),
        priceDelta: 60,
      },
    ],
  },
  {
    slug: "foundation",
    name: "Milk",
    ...label("foundation"),
    type: "single",
    required: true,
    options: [
      { slug: "whole", name: "Whole", ...same("Whole milk") },
      { slug: "skim", name: "Skim", ...same("Skim milk") },
      { slug: "oat", name: "Oat", ...same("Oat milk"), priceDelta: 30 },
      {
        slug: "almond",
        name: "Almond",
        ...same("Almond milk"),
        priceDelta: 30,
      },
      { slug: "soy", name: "Soy", ...same("Soy milk"), priceDelta: 30 },
    ],
  },
  {
    slug: "flavor",
    name: "Syrups",
    ...label("flavor"),
    type: "multi",
    required: false,
    maxSelect: 3,
    options: [
      ["vanilla", "Vanilla"],
      ["caramel", "Caramel"],
      ["hazelnut", "Hazelnut"],
      ["brown-sugar", "Brown sugar"],
      ["ube", "Ube"],
      ["rose", "Rose"],
    ].map(([slug, name]) => ({ slug, name, ...same(name), priceDelta: 25 })),
  },
  {
    slug: "sweetness",
    name: "Sweetness",
    ...label("sweetLevel"),
    type: "single",
    required: true,
    options: [
      { slug: "clean", name: "25%", ...label("clean") },
      { slug: "smooth", name: "50%", ...label("smooth") },
      { slug: "full", name: "100%", ...label("full") },
      { slug: "extra", name: "125%", ...label("extra") },
    ],
  },
  {
    slug: "accents",
    name: "Toppings",
    ...label("accents"),
    type: "multi",
    required: false,
    maxSelect: 4,
    options: [
      ["whipped-cream", "Whipped cream"],
      ["caramel-drizzle", "Caramel drizzle"],
      ["sea-salt-foam", "Sea-salt foam"],
      ["cinnamon-dust", "Cinnamon dust"],
    ].map(([slug, name]) => ({ slug, name, ...same(name), priceDelta: 20 })),
  },
  {
    slug: "freeze",
    name: "Ice",
    ...label("freeze"),
    type: "single",
    required: true,
    options: [
      { slug: "light", name: "Light ice", ...label("lightFreeze") },
      { slug: "regular", name: "Regular ice", ...label("regularFreeze") },
      { slug: "extra", name: "Extra ice", ...label("extraFreeze") },
    ],
  },
  {
    slug: "notes",
    name: "Instructions",
    ...label("notes"),
    type: "text",
    required: false,
    maxSelect: 140,
    options: [],
  },
];

type ItemSeed = {
  name: string;
  slug: string;
  genre: string;
  danceStyle: string;
  blurb: string;
  plainDescription: string;
  basePrice: number;
  temps: Temperature[];
  // "optional" drinks can take extra shots but have no caffeine choice.
  coffee?: "yes" | "optional";
  milk?: "whole" | "oat";
  sweet?: boolean;
  flavor?: boolean;
  sized?: boolean;
  toppings?: boolean;
  featured?: boolean;
};

const drinkSeeds: ItemSeed[] = [
  {
    name: "Popping Shot",
    slug: "popping-shot",
    genre: "old-school",
    danceStyle: "Popping",
    blurb: "Sharp, quick hits.",
    plainDescription: "Double espresso",
    basePrice: 110,
    temps: ["hot"],
    coffee: "yes",
    flavor: false,
    sized: false,
    toppings: false,
  },
  {
    name: "Tutting Cortado",
    slug: "tutting-cortado",
    genre: "old-school",
    danceStyle: "Tutting",
    blurb: "Precise, geometric, clean lines.",
    plainDescription: "Equal espresso and steamed milk, layered",
    basePrice: 130,
    temps: ["hot"],
    coffee: "yes",
    milk: "whole",
    sized: false,
    toppings: false,
  },
  {
    name: "Locking Flat White",
    slug: "locking-flat-white",
    genre: "old-school",
    danceStyle: "Locking",
    blurb: "Funky, punchy, locks in place.",
    plainDescription: "Ristretto shots, velvety milk",
    basePrice: 150,
    temps: ["hot", "iced"],
    coffee: "yes",
    milk: "whole",
  },
  {
    name: "Breakin' Americano",
    slug: "breakin-americano",
    genre: "old-school",
    danceStyle: "Breaking",
    blurb: "Raw, strong foundation.",
    plainDescription: "Espresso and water, bold roast",
    basePrice: 120,
    temps: ["hot", "iced"],
    coffee: "yes",
  },
  {
    name: "Hip-Hop Mocha",
    slug: "hip-hop-mocha",
    genre: "old-school",
    danceStyle: "Hip-Hop",
    blurb: "The groove everything is built on.",
    plainDescription: "Espresso, chocolate, milk",
    basePrice: 160,
    temps: ["hot", "iced"],
    coffee: "yes",
    milk: "whole",
    sweet: true,
  },
  {
    name: "Waacking Caramel Macchiato",
    slug: "waacking-caramel-macchiato",
    genre: "new-school",
    danceStyle: "Waacking",
    blurb: "Dramatic arms, glamorous drizzle.",
    plainDescription: "Vanilla milk, espresso, caramel drizzle",
    basePrice: 170,
    temps: ["hot", "iced"],
    coffee: "yes",
    milk: "whole",
    sweet: true,
    featured: true,
  },
  {
    name: "House Vanilla Latte",
    slug: "house-vanilla-latte",
    genre: "new-school",
    danceStyle: "House",
    blurb: "Smooth, continuous flow.",
    plainDescription: "Espresso, vanilla, milk",
    basePrice: 160,
    temps: ["hot", "iced"],
    coffee: "yes",
    milk: "whole",
    sweet: true,
  },
  {
    name: "Afro Spice Latte",
    slug: "afro-spice-latte",
    genre: "new-school",
    danceStyle: "Afro",
    blurb: "Warm, grounded, rhythmic.",
    plainDescription: "Espresso, ginger-cinnamon-nutmeg spice, brown sugar",
    basePrice: 170,
    temps: ["hot", "iced"],
    coffee: "yes",
    milk: "whole",
    sweet: true,
  },
  {
    name: "Dancehall Coco Cold Brew",
    slug: "dancehall-coco-cold-brew",
    genre: "new-school",
    danceStyle: "Dancehall",
    blurb: "Island vibes, laid-back bounce.",
    plainDescription:
      "Cold brew, coconut cream, light rum-flavor syrup (non-alcoholic)",
    basePrice: 180,
    temps: ["iced"],
    coffee: "yes",
    sweet: true,
  },
  {
    name: "Amapiano Shaken Espresso",
    slug: "amapiano-shaken-espresso",
    genre: "new-school",
    danceStyle: "Amapiano",
    blurb: "Chill log-drum bounce.",
    plainDescription: "Brown sugar shaken espresso, oat milk",
    basePrice: 170,
    temps: ["iced"],
    coffee: "yes",
    milk: "oat",
    sweet: true,
  },
  {
    name: "Krump Cold Brew",
    slug: "krump-cold-brew",
    genre: "new-school",
    danceStyle: "Krump",
    blurb: "Raw intensity, maximum energy.",
    plainDescription: "Extra-strong cold brew, extra shot",
    basePrice: 170,
    temps: ["iced"],
    coffee: "yes",
  },
  {
    name: "Open Style",
    slug: "open-style",
    genre: "new-school",
    danceStyle: "Open Style",
    blurb: "No rules, changes every week.",
    plainDescription: "Barista's rotating special",
    basePrice: 180,
    temps: ["hot", "iced"],
    coffee: "yes",
    milk: "whole",
    sweet: true,
  },
  {
    name: "Vogue Rose Latte",
    slug: "vogue-rose-latte",
    genre: "new-school",
    danceStyle: "Vogue",
    blurb: "Elegant, runway-ready.",
    plainDescription: "Espresso, rose syrup, milk",
    basePrice: 180,
    temps: ["hot", "iced"],
    coffee: "yes",
    milk: "whole",
    sweet: true,
  },
  {
    name: "Jersey Club Frappe",
    slug: "jersey-club-frappe",
    genre: "mashup",
    danceStyle: "Jersey Club",
    blurb: "Fast, bouncy, playful.",
    plainDescription: "Blended coffee, cookies, whipped cream, sprinkles",
    basePrice: 190,
    temps: ["blended"],
    coffee: "yes",
    milk: "whole",
    sweet: true,
    featured: true,
  },
  {
    name: "Heels Strawberry Cream",
    slug: "heels-strawberry-cream",
    genre: "mashup",
    danceStyle: "Heels",
    blurb: "Bold, confident, pink.",
    plainDescription: "Blended strawberry and cream (coffee optional)",
    basePrice: 180,
    temps: ["blended"],
    coffee: "optional",
    sweet: true,
  },
  {
    name: "K-Choreo Ube Latte",
    slug: "k-choreo-ube-latte",
    genre: "off-beat",
    danceStyle: "K-Choreo",
    blurb: "Sharp, synced, crowd favorite.",
    plainDescription: "Ube, milk (espresso optional)",
    basePrice: 170,
    temps: ["hot", "iced"],
    coffee: "optional",
    milk: "whole",
    sweet: true,
    featured: true,
  },
  {
    name: "Lyrical Matcha",
    slug: "lyrical-matcha",
    genre: "off-beat",
    danceStyle: "Lyrical",
    blurb: "Soft, flowing, emotional.",
    plainDescription: "Matcha, milk, light honey",
    basePrice: 170,
    temps: ["hot", "iced"],
    milk: "whole",
    sweet: true,
  },
  {
    name: "Litefeet Lemonade",
    slug: "litefeet-lemonade",
    genre: "off-beat",
    danceStyle: "Litefeet",
    blurb: "Light, quick, refreshing.",
    plainDescription: "Lemonade with mint, sparkling option",
    basePrice: 130,
    temps: ["iced"],
    sweet: true,
    flavor: false,
    toppings: false,
  },
];

// Snack prices are placeholders; the spec doesn't list them.
const snackSeeds: ItemSeed[] = [
  {
    name: "8-Count Cookie",
    slug: "8-count-cookie",
    genre: "intermission",
    danceStyle: "8-count",
    blurb: "Eight bites, right on the beat.",
    plainDescription: "Chocolate chip cookie",
    basePrice: 90,
    temps: [],
  },
  {
    name: "Toprock Croissant",
    slug: "toprock-croissant",
    genre: "intermission",
    danceStyle: "Toprock",
    blurb: "Flaky layers, light on its feet.",
    plainDescription: "Butter croissant",
    basePrice: 110,
    temps: [],
  },
  {
    name: "Pirouette Cinnamon Roll",
    slug: "pirouette-cinnamon-roll",
    genre: "intermission",
    danceStyle: "Pirouette",
    blurb: "One perfect spin.",
    plainDescription: "Cinnamon roll with glaze",
    basePrice: 130,
    temps: [],
  },
  {
    name: "Battle Banana Bread",
    slug: "battle-banana-bread",
    genre: "intermission",
    danceStyle: "Battle",
    blurb: "Fuel for the final round.",
    plainDescription: "Banana bread slice",
    basePrice: 120,
    temps: [],
  },
];

// Freestyle bases (build your own). Prices are placeholders.
const freestyleSeeds: ItemSeed[] = [
  {
    name: "Espresso",
    slug: "freestyle-espresso",
    genre: "freestyle",
    danceStyle: "Freestyle",
    blurb: "A clean start for your own routine.",
    plainDescription: "Espresso base",
    basePrice: 120,
    temps: ["hot", "iced", "blended"],
    coffee: "yes",
    milk: "whole",
    sweet: true,
  },
  {
    name: "Cold Brew",
    slug: "freestyle-cold-brew",
    genre: "freestyle",
    danceStyle: "Freestyle",
    blurb: "Smooth and steady, ready for your moves.",
    plainDescription: "Cold brew base",
    basePrice: 140,
    temps: ["iced", "blended"],
    coffee: "yes",
    sweet: true,
  },
  {
    name: "Matcha",
    slug: "freestyle-matcha",
    genre: "freestyle",
    danceStyle: "Freestyle",
    blurb: "Soft and green, easy to build on.",
    plainDescription: "Matcha base",
    basePrice: 150,
    temps: ["hot", "iced", "blended"],
    coffee: "optional",
    milk: "whole",
    sweet: true,
  },
  {
    name: "Chocolate",
    slug: "freestyle-chocolate",
    genre: "freestyle",
    danceStyle: "Freestyle",
    blurb: "Rich and bold, a crowd-pleaser.",
    plainDescription: "Chocolate base",
    basePrice: 130,
    temps: ["hot", "iced", "blended"],
    coffee: "optional",
    milk: "whole",
    sweet: true,
  },
  {
    name: "Tea",
    slug: "freestyle-tea",
    genre: "freestyle",
    danceStyle: "Freestyle",
    blurb: "Light on its feet, any time of day.",
    plainDescription: "Black tea base",
    basePrice: 110,
    temps: ["hot", "iced"],
    sweet: true,
  },
];

// Which Remix groups each item gets, with the default choice (null = none).
function remixGroupsFor(
  item: ItemSeed,
): [group: string, option: string | null][] {
  const groups: [string, string | null][] = [];
  const isDrink = item.temps.length > 0;
  if (isDrink) {
    if (item.sized !== false) groups.push(["counts", "count-8"]);
    if (item.temps.length > 1) groups.push(["temperature", item.temps[0]]);
    if (item.coffee === "yes") groups.push(["energy", "full-out"]);
    if (item.coffee) groups.push(["shots", null]);
    if (item.milk) groups.push(["foundation", item.milk]);
    if (item.flavor !== false) groups.push(["flavor", null]);
    if (item.sweet) groups.push(["sweetness", "full"]);
    if (item.toppings !== false) groups.push(["accents", null]);
    if (item.temps.some((temp) => temp !== "hot"))
      groups.push(["freeze", "regular"]);
  }
  groups.push(["notes", null]);
  return groups;
}

async function main() {
  const url = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
  if (!url) throw new Error("Set DIRECT_URL in .env.local first.");

  const client = postgres(url, { max: 1 });
  const db = drizzle(client, { schema });

  await db.transaction(async (tx) => {
    const genreIds = new Map<string, string>();
    for (const [index, genre] of genreRows.entries()) {
      const [row] = await tx
        .insert(genres)
        .values({ ...genre, sortOrder: index })
        .onConflictDoUpdate({
          target: genres.slug,
          set: { name: genre.name, sortOrder: index },
        })
        .returning({ id: genres.id });
      genreIds.set(genre.slug, row.id);
    }

    const groupIds = new Map<string, string>();
    const optionIds = new Map<string, string>();
    for (const [
      index,
      { options: groupOptions, ...group },
    ] of groupSeeds.entries()) {
      const values = {
        ...group,
        maxSelect: group.maxSelect ?? null,
        sortOrder: index,
      };
      const [row] = await tx
        .insert(optionGroups)
        .values(values)
        .onConflictDoUpdate({ target: optionGroups.slug, set: values })
        .returning({ id: optionGroups.id });
      groupIds.set(group.slug, row.id);

      for (const [optionIndex, option] of groupOptions.entries()) {
        const optionValues = {
          ...option,
          groupId: row.id,
          priceDelta: option.priceDelta ?? 0,
          sortOrder: optionIndex,
        };
        const [optionRow] = await tx
          .insert(options)
          .values(optionValues)
          .onConflictDoUpdate({
            target: [options.groupId, options.slug],
            set: optionValues,
          })
          .returning({ id: options.id });
        optionIds.set(`${group.slug}:${option.slug}`, optionRow.id);
      }
    }

    const items = [...drinkSeeds, ...snackSeeds, ...freestyleSeeds];
    const drinkIds: string[] = [];
    for (const [index, item] of items.entries()) {
      const values = {
        genreId: genreIds.get(item.genre)!,
        name: item.name,
        slug: item.slug,
        danceStyle: item.danceStyle,
        blurb: item.blurb,
        plainDescription: item.plainDescription,
        basePrice: item.basePrice,
        tempsAllowed: item.temps,
        isFeatured: item.featured ?? false,
        sortOrder: index,
      };
      // Leave is_available alone on re-runs so Sitting out toggles survive.
      const [row] = await tx
        .insert(drinks)
        .values(values)
        .onConflictDoUpdate({ target: drinks.slug, set: values })
        .returning({ id: drinks.id });
      drinkIds.push(row.id);
    }

    // Rebuild the drink ↔ Remix group links from scratch.
    await tx
      .delete(drinkOptionGroups)
      .where(inArray(drinkOptionGroups.drinkId, drinkIds));
    await tx.insert(drinkOptionGroups).values(
      items.flatMap((item, index) =>
        remixGroupsFor(item).map(([group, option]) => ({
          drinkId: drinkIds[index],
          groupId: groupIds.get(group)!,
          defaultOptionId: option ? optionIds.get(`${group}:${option}`)! : null,
        })),
      ),
    );
  });

  const [counts] = await db.execute<{
    genres: number;
    drinks: number;
    groups: number;
    options: number;
    links: number;
  }>(sql`
    select
      (select count(*)::int from genres) as genres,
      (select count(*)::int from drinks) as drinks,
      (select count(*)::int from option_groups) as groups,
      (select count(*)::int from options) as options,
      (select count(*)::int from drink_option_groups) as links
  `);
  console.log("Seeded:", counts);

  await client.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
