"use server";

import { updateTag } from "next/cache";
import { z } from "zod";
import { getOrder } from "@/lib/db/orders";
import { getRatedDrinkIds, giveProps, PROPS_TAG } from "@/lib/db/props";

// Anyone with the order link can follow it; the id is the key.
export async function getTrackedOrder(id: string) {
  return getOrder(id);
}

// Props, after pickup. Same key: the order link.
export async function getOrderProps(orderId: string) {
  if (!z.uuid().safeParse(orderId).success) return [];
  return getRatedDrinkIds(orderId);
}

const propsSchema = z.object({
  orderId: z.uuid(),
  drinkId: z.uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z
    .string()
    .trim()
    .max(280)
    .transform((value) => value || null),
});

export async function submitProps(input: unknown) {
  const parsed = propsSchema.safeParse(input);
  if (!parsed.success) return false;
  const ok = await giveProps(parsed.data);
  if (ok) updateTag(PROPS_TAG);
  return ok;
}
