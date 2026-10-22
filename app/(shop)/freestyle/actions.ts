"use server";

import { z } from "zod";
import { CHOREO_NAME_LIMIT, NOTES_LIMIT } from "@/lib/checkout";
import { insertChoreo } from "@/lib/db/choreo";
import { getDrinksForCheckout } from "@/lib/db/queries";
import { priceRemix } from "@/lib/pricing";
import { recipeFromPriced } from "@/lib/remix-form";
import { isDemoDancer } from "@/lib/demo-dancer";
import { getCurrentUser } from "@/lib/supabase/server";

const saveChoreoSchema = z.object({
  drinkId: z.uuid(),
  name: z.string().trim().min(1).max(CHOREO_NAME_LIMIT),
  selection: z.record(z.uuid(), z.array(z.uuid()).max(10)),
  notes: z.string().max(NOTES_LIMIT),
});

// "Name your choreo": saves a Freestyle drink to the member's profile.
export async function saveChoreo(input: z.input<typeof saveChoreoSchema>) {
  const user = await getCurrentUser();
  if (!user || isDemoDancer(user)) return { ok: false as const };
  const parsed = saveChoreoSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const };

  const [drink] = await getDrinksForCheckout([parsed.data.drinkId]);
  if (!drink) return { ok: false as const };
  // Store the cleaned-up choices by slug.
  const result = priceRemix(drink, parsed.data.selection, parsed.data.notes);
  const saved = await insertChoreo(user.id, {
    name: parsed.data.name,
    base: drink.slug,
    recipe: recipeFromPriced(result),
  });
  return { ok: saved };
}
