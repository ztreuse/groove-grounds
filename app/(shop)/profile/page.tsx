import { Suspense } from "react";
import type { Metadata } from "next";
import { CountIn } from "@/components/layout/CountIn";
import { ProfileView } from "@/components/profile/ProfileView";
import { SignedOutProfile } from "@/components/profile/SignedOutProfile";
import { dance } from "@/lib/copy";
import { listChoreo } from "@/lib/db/choreo";
import { getOrdersForUser } from "@/lib/db/orders";
import { getProfile } from "@/lib/db/profiles";
import { isDemoDancer } from "@/lib/demo-dancer";
import { getCurrentUser } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: dance.pages.profile,
  robots: { index: false },
};

// Reads the login cookie, so it renders per request inside Suspense.
async function ProfileContent() {
  const user = await getCurrentUser();
  if (!user) return <SignedOutProfile />;

  const [profile, orders, choreo] = await Promise.all([
    getProfile(user.id),
    getOrdersForUser(user.id),
    listChoreo(user.id),
  ]);
  if (!profile) return <SignedOutProfile />;

  return (
    <ProfileView
      email={user.email ?? ""}
      profile={profile}
      orders={orders}
      choreo={choreo}
      isDemo={isDemoDancer(user)}
    />
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<CountIn />}>
      <ProfileContent />
    </Suspense>
  );
}
