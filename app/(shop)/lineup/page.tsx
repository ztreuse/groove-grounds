import type { Metadata } from "next";
import { LineupBrowser } from "@/components/lineup/LineupBrowser";
import { dance } from "@/lib/copy";
import { getLineup } from "@/lib/db/queries";

export const metadata: Metadata = { title: dance.pages.lineup };

export default async function LineupPage() {
  const { genres, drinks } = await getLineup();
  return <LineupBrowser genres={genres} drinks={drinks} />;
}
