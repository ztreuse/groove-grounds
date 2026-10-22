"use server";

import { eq } from "drizzle-orm";
import { updateTag } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { templateGroupsFor } from "@/lib/db/menu-admin";
import { MENU_TAG } from "@/lib/db/queries";
import { drinkOptionGroups, drinks, options } from "@/lib/db/schema";
import {
  drinkFormSchema,
  newDrinkSchema,
  optionUpdateSchema,
} from "@/lib/menu-schema";
import { getOwner } from "@/lib/staff";

// Owner-only menu edits. Every action re-checks the role on the server and
// refreshes the cached menu so changes show up on the site right away.

type Result = { ok: true } | { ok: false };

export async function updateDrink(id: string, input: unknown): Promise<Result> {
  if (!(await getOwner()) || !z.uuid().safeParse(id).success) {
    return { ok: false };
  }
  const parsed = drinkFormSchema.safeParse(input);
  if (!parsed.success) return { ok: false };
  await db.update(drinks).set(parsed.data).where(eq(drinks.id, id));
  updateTag(MENU_TAG);
  return { ok: true };
}

const flagSchema = z.object({
  id: z.uuid(),
  field: z.enum(["isAvailable", "isFeatured"]),
  value: z.boolean(),
});

export async function setDrinkFlag(input: unknown): Promise<Result> {
  if (!(await getOwner())) return { ok: false };
  const parsed = flagSchema.safeParse(input);
  if (!parsed.success) return { ok: false };
  const { id, field, value } = parsed.data;
  await db
    .update(drinks)
    .set({ [field]: value })
    .where(eq(drinks.id, id));
  updateTag(MENU_TAG);
  return { ok: true };
}

export async function updateOption(input: unknown): Promise<Result> {
  if (!(await getOwner())) return { ok: false };
  const parsed = optionUpdateSchema.safeParse(input);
  if (!parsed.success) return { ok: false };
  const { id, ...values } = parsed.data;
  await db.update(options).set(values).where(eq(options.id, id));
  updateTag(MENU_TAG);
  return { ok: true };
}

const slugify = (name: string) =>
  name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "item";

export async function createDrink(
  input: unknown,
): Promise<{ ok: true; slug: string } | { ok: false }> {
  if (!(await getOwner())) return { ok: false };
  const parsed = newDrinkSchema.safeParse(input);
  if (!parsed.success) return { ok: false };
  const { genreId, ...values } = parsed.data;

  const base = slugify(values.name);
  let slug = base;
  for (let n = 2; ; n++) {
    const [taken] = await db
      .select({ id: drinks.id })
      .from(drinks)
      .where(eq(drinks.slug, slug))
      .limit(1);
    if (!taken) break;
    slug = `${base}-${n}`;
  }

  // New items go to the end of their genre and inherit its Remix groups.
  const groups = await templateGroupsFor(
    genreId,
    values.tempsAllowed.length === 0,
  );
  await db.transaction(async (tx) => {
    const [drink] = await tx
      .insert(drinks)
      .values({ ...values, genreId, slug, sortOrder: 999 })
      .returning({ id: drinks.id });
    if (groups.length > 0) {
      await tx
        .insert(drinkOptionGroups)
        .values(groups.map((group) => ({ ...group, drinkId: drink.id })));
    }
  });
  updateTag(MENU_TAG);
  return { ok: true, slug };
}
