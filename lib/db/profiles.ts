import "server-only";
import { eq } from "drizzle-orm";
import { db } from "./index";
import { profiles } from "./schema";

export async function getProfile(id: string) {
  const [profile] = await db
    .select({
      name: profiles.name,
      phone: profiles.phone,
      reps: profiles.reps,
      level: profiles.level,
      role: profiles.role,
    })
    .from(profiles)
    .where(eq(profiles.id, id))
    .limit(1);
  return profile ?? null;
}

export async function updateProfile(
  id: string,
  values: { name: string; phone: string },
) {
  await db
    .update(profiles)
    .set({ name: values.name, phone: values.phone || null })
    .where(eq(profiles.id, id));
}

export type Profile = NonNullable<Awaited<ReturnType<typeof getProfile>>>;
