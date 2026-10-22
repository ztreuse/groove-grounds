import type { Metadata } from "next";
import { StudioView } from "@/components/studio/StudioView";
import { dance, plain } from "@/lib/copy";
import { getScheduleRules } from "@/lib/db/schedule";

export const metadata: Metadata = {
  title: dance.pages.studio,
  description: plain.studio.intro,
};

export default async function StudioPage() {
  const rules = await getScheduleRules();
  return (
    <main className="flex-1">
      <StudioView rules={rules} />
    </main>
  );
}
