import "server-only";
import { getProfile } from "@/lib/db/profiles";
import { getCurrentUser } from "@/lib/supabase/server";

export type StaffRole = "owner" | "barista";
export type Staff = { id: string; role: StaffRole };

// The signed-in crew member, or null for customers and visitors. Roles live
// on profiles.role; promote an account with
//   update profiles set role = 'owner' where id = '<user id>';
export async function getStaff(): Promise<Staff | null> {
  const user = await getCurrentUser();
  if (!user) return null;
  const profile = await getProfile(user.id);
  if (!profile || profile.role === "customer") return null;
  return { id: user.id, role: profile.role };
}

export async function getOwner() {
  const staff = await getStaff();
  return staff?.role === "owner" ? staff : null;
}
