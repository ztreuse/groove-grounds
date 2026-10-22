// Seeds the demo dancer: an account visitors can sign in to with one tap
// (Sign in > Try the demo dancer) so the Dancer Profile isn't empty. Gives
// it past orders, Saved Choreo and a Reps balance. Safe to run again: the
// demo dancer's orders, choreo and Reps are replaced each time.
// Run with `npm run db:seed-demo` (needs DEMO_DANCER_EMAIL/PASSWORD).
import { randomInt } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { eq, sql } from "drizzle-orm";
import { priceRemix, defaultSelection, type PricedDrink } from "../pricing";
import { recipeFromPriced } from "../remix-form";
import { db } from "./index";
import { getDrinksBySlugs } from "./queries";
import {
  orderItems,
  orders,
  profiles,
  repsLedger,
  savedChoreo,
} from "./schema";

const email = process.env.DEMO_DANCER_EMAIL;
const password = process.env.DEMO_DANCER_PASSWORD;
if (!email || !password) {
  throw new Error("Set DEMO_DANCER_EMAIL and DEMO_DANCER_PASSWORD first.");
}

const NAME = "Demo Dancer";
const DAY = 24 * 60 * 60 * 1000;
const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const code = () =>
  "GG-" +
  Array.from({ length: 5 }, () => CODE_ALPHABET[randomInt(32)]).join("");

// Past orders: days ago, then lines of drink slug, quantity and Remix
// tweaks as group slug -> option slug(s).
type Line = { slug: string; qty?: number; tweaks?: Record<string, string[]> };
const history: { daysAgo: number; type: "drop_in" | "class"; lines: Line[] }[] =
  [
    {
      daysAgo: 2,
      type: "drop_in",
      lines: [
        { slug: "house-vanilla-latte", tweaks: { foundation: ["oat"] } },
        { slug: "toprock-croissant" },
      ],
    },
    {
      daysAgo: 6,
      type: "class",
      lines: [
        {
          slug: "lyrical-matcha",
          tweaks: { temperature: ["iced"], counts: ["count-16"] },
        },
        { slug: "krump-cold-brew" },
      ],
    },
    {
      daysAgo: 11,
      type: "drop_in",
      lines: [{ slug: "hip-hop-mocha", qty: 2 }],
    },
    {
      daysAgo: 19,
      type: "class",
      lines: [
        {
          slug: "waacking-caramel-macchiato",
          tweaks: { temperature: ["iced"] },
        },
        { slug: "8-count-cookie", qty: 2 },
      ],
    },
    {
      daysAgo: 26,
      type: "drop_in",
      lines: [
        { slug: "afro-spice-latte", tweaks: { counts: ["count-16"] } },
        { slug: "jersey-club-frappe" },
      ],
    },
  ];

// Saved Choreo comes from the Freestyle builder, so these use its bases.
const favourites: { name: string; line: Line }[] = [
  {
    name: "Rehearsal Fuel",
    line: {
      slug: "freestyle-espresso",
      tweaks: {
        temperature: ["iced"],
        shots: ["double-time"],
        counts: ["count-16"],
        foundation: ["oat"],
      },
    },
  },
  {
    name: "Cool-down Matcha",
    line: {
      slug: "freestyle-matcha",
      tweaks: { temperature: ["iced"], foundation: ["oat"] },
    },
  },
];

function priceLine(drink: PricedDrink, line: Line) {
  const selection = defaultSelection(drink);
  for (const [groupSlug, optionSlugs] of Object.entries(line.tweaks ?? {})) {
    const group = drink.groups.find((g) => g.slug === groupSlug);
    if (!group) continue;
    selection[group.id] = optionSlugs.flatMap(
      (slug) => group.options.find((o) => o.slug === slug)?.id ?? [],
    );
  }
  return priceRemix(drink, selection, "");
}

async function findOrCreateUser() {
  const [existing] = await db.execute<{ id: string }>(
    sql`select id from auth.users where email = ${email}`,
  );
  if (existing) return existing.id;
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
  const { data, error } = await supabase.auth.signUp({
    email: email!,
    password: password!,
    options: { data: { name: NAME } },
  });
  if (error || !data.user) throw error ?? new Error("Sign-up failed");
  return data.user.id;
}

async function main() {
  const userId = await findOrCreateUser();
  const slugs = [
    ...history.flatMap((order) => order.lines.map((line) => line.slug)),
    ...favourites.map((fav) => fav.line.slug),
  ];
  const drinkList = await getDrinksBySlugs([...new Set(slugs)]);
  const bySlug = new Map(drinkList.map((drink) => [drink.slug, drink]));
  const drinkFor = (slug: string) => {
    const drink = bySlug.get(slug);
    if (!drink) throw new Error(`Unknown drink ${slug}; run db:seed first.`);
    return drink;
  };

  await db.transaction(async (tx) => {
    await tx.delete(repsLedger).where(eq(repsLedger.userId, userId));
    await tx.delete(savedChoreo).where(eq(savedChoreo.userId, userId));
    await tx.delete(orders).where(eq(orders.userId, userId));

    let reps = 50;
    await tx.insert(repsLedger).values({
      userId,
      points: 50,
      reason: "Joined the crew",
      createdAt: new Date(Date.now() - 30 * DAY),
    });

    for (const past of history) {
      const createdAt = new Date(Date.now() - past.daysAgo * DAY);
      const lines = past.lines.map((line) => {
        const drink = drinkFor(line.slug);
        return { drink, priced: priceLine(drink, line), qty: line.qty ?? 1 };
      });
      const total = lines.reduce(
        (sum, { priced, qty }) => sum + priced.unitPrice * qty,
        0,
      );
      const [order] = await tx
        .insert(orders)
        .values({
          code: code(),
          userId,
          guestName: NAME,
          type: past.type,
          slotStart:
            past.type === "class"
              ? new Date(createdAt.getTime() + 2 * 60 * 60 * 1000)
              : null,
          status: "bow",
          subtotal: total,
          total,
          paymentMethod: "demo_gcash",
          paymentStatus: "paid",
          isDemo: true,
          createdAt,
        })
        .returning({ id: orders.id });
      await tx.insert(orderItems).values(
        lines.map(({ drink, priced, qty }) => ({
          orderId: order.id,
          drinkId: drink.id,
          nameSnapshot: drink.name,
          baseSnapshot: drink.basePrice,
          optionsSnapshot: {
            choices: priced.choices.map(({ group, options }) => ({
              group: group.slug,
              danceLabel: group.danceLabel,
              plainLabel: group.plainLabel,
              options: options.map((option) => ({
                slug: option.slug,
                danceLabel: option.danceLabel,
                plainLabel: option.plainLabel,
                priceDelta:
                  option.id === group.defaultOptionId ? 0 : option.priceDelta,
              })),
            })),
            notes: priced.notes,
          },
          quantity: qty,
          lineTotal: priced.unitPrice * qty,
        })),
      );
      // One Rep per ₱10 spent.
      const points = Math.floor(total / 10);
      reps += points;
      await tx.insert(repsLedger).values({
        userId,
        orderId: order.id,
        points,
        reason: "Order",
        createdAt,
      });
    }

    for (const fav of favourites) {
      const drink = drinkFor(fav.line.slug);
      await tx.insert(savedChoreo).values({
        userId,
        name: fav.name,
        base: drink.slug,
        options: recipeFromPriced(priceLine(drink, fav.line)),
      });
    }

    await tx
      .update(profiles)
      .set({
        name: NAME,
        phone: "0917 000 0000",
        role: "customer",
        reps,
        level: reps >= 200 ? "cypher_regular" : "rookie",
      })
      .where(eq(profiles.id, userId));
    console.log(
      `Demo dancer ${email}: ${history.length} orders, ${reps} Reps.`,
    );
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
