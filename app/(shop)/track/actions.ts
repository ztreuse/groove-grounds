"use server";

import { getOrder } from "@/lib/db/orders";

// Anyone with the order link can follow it; the id is the key.
export async function getTrackedOrder(id: string) {
  return getOrder(id);
}
