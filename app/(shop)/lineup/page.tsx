import { Suspense } from "react";
import type { Metadata } from "next";
import { LineupBrowser } from "@/components/lineup/LineupBrowser";
import { LineupFromQuery } from "@/components/lineup/LineupFromQuery";
import { dance } from "@/lib/copy";
import { getLineup } from "@/lib/db/queries";

export const metadata: Metadata = { title: dance.pages.lineup };

export default async function LineupPage() {
  const { genres, drinks } = await getLineup();
  return (
    <Suspense fallback={<LineupBrowser genres={genres} drinks={drinks} />}>
      <LineupFromQuery genres={genres} drinks={drinks} />
    </Suspense>
  );
}
