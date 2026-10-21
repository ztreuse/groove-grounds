"use server";

import { profileSchema, type ProfileInput } from "@/lib/auth-schema";
import {
  choreoPlaylistItems,
  deleteChoreo,
  orderPlaylistItems,
} from "@/lib/db/choreo";
import { updateProfile } from "@/lib/db/profiles";
import { getCurrentUser } from "@/lib/supabase/server";

export async function saveProfile(input: ProfileInput) {
  const user = await getCurrentUser();
  if (!user) return { ok: false as const };
  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const };
  await updateProfile(user.id, parsed.data);
  return { ok: true as const };
}

// Run it back: the browser adds the returned items to its Playlist. Items
// are re-priced from today's menu; anything Sitting out is skipped.
export async function runItBack(kind: "order" | "choreo", id: string) {
  const user = await getCurrentUser();
  if (!user) return null;
  return kind === "order"
    ? orderPlaylistItems(user.id, id)
    : choreoPlaylistItems(user.id, id);
}

export async function removeChoreo(id: string) {
  const user = await getCurrentUser();
  if (!user) return;
  await deleteChoreo(user.id, id);
}
