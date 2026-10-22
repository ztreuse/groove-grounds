import type { Metadata } from "next";
import { CrewForm } from "@/components/crew/CrewForm";
import { CrewHero } from "@/components/crew/CrewHero";
import { dance } from "@/lib/copy";
import { getScheduleRules } from "@/lib/db/schedule";

export const metadata: Metadata = { title: dance.pages.crew };

export default async function CrewPage() {
  const rules = await getScheduleRules();
  return (
    <main className="flex-1 pb-16">
      <CrewHero />
      <div className="mx-auto w-full max-w-3xl px-4 pt-10">
        <CrewForm
          openMinute={rules.openMinute}
          closeMinute={rules.closeMinute}
        />
      </div>
    </main>
  );
}
