import type { Metadata } from "next";
import { ShowtimeIntro } from "@/components/showtime/ShowtimeIntro";
import { ShowtimeForm } from "@/components/showtime/ShowtimeForm";
import { dance } from "@/lib/copy";
import { getScheduleRules } from "@/lib/db/schedule";

export const metadata: Metadata = { title: dance.pages.showtime };

export default async function ShowtimePage() {
  const rules = await getScheduleRules();
  return (
    <main className="flex-1 pb-16">
      <ShowtimeIntro />
      <div className="mx-auto w-full max-w-6xl px-4 pt-4">
        <ShowtimeForm rules={rules} />
      </div>
    </main>
  );
}
