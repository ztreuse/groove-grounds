"use server";

import { profileSchema, type ProfileInput } from "@/lib/auth-schema";
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
