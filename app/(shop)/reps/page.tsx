import { Suspense } from "react";
import type { Metadata } from "next";
import { RepsHero } from "@/components/reps/RepsHero";
import { RepsView } from "@/components/reps/RepsView";
import { dance } from "@/lib/copy";
import { getProfile } from "@/lib/db/profiles";
import { getRepsHistory } from "@/lib/db/reps";
import { getCurrentUser } from "@/lib/supabase/server";

export const metadata: Metadata = { title: dance.pages.reps };

// The balance and history read the login cookie, so they stream in; the
// guide renders straight away as the fallback.
async function MemberReps() {
  const user = await getCurrentUser();
  if (!user) return <RepsView member={null} />;
  const [profile, history] = await Promise.all([
    getProfile(user.id),
    getRepsHistory(user.id),
  ]);
  if (!profile) return <RepsView member={null} />;
  return <RepsView member={{ reps: profile.reps, history }} />;
}

export default function RepsPage() {
  return (
    <main className="flex-1">
      <RepsHero />
      <Suspense fallback={<RepsView member={null} />}>
        <MemberReps />
      </Suspense>
    </main>
  );
}
