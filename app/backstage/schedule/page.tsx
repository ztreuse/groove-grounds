import { Suspense } from "react";
import type { Metadata } from "next";
import { BackstageHeader } from "@/components/backstage/BackstageHeader";
import { ScheduleForm } from "@/components/backstage/ScheduleForm";
import { StaffGate } from "@/components/backstage/StaffGate";
import { CountIn } from "@/components/layout/CountIn";
import { dance } from "@/lib/copy";
import { getScheduleRules } from "@/lib/db/schedule";
import { routes } from "@/lib/routes";
import { getStaff } from "@/lib/staff";
import { getCurrentUser } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: dance.pages.backstageSchedule,
  robots: { index: false },
};

// Owner only: reads the login cookie, so it renders per request.
async function Content() {
  const staff = await getStaff();
  if (staff?.role !== "owner") {
    const reason = staff
      ? "not-owner"
      : (await getCurrentUser())
        ? "not-staff"
        : "signed-out";
    return <StaffGate reason={reason} next={routes.backstageSchedule.href} />;
  }
  return <ScheduleForm rules={await getScheduleRules()} />;
}

export default function SchedulePage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 pt-8 pb-16 sm:pt-12">
      <BackstageHeader page="backstageSchedule" intro="schedule" />
      <Suspense fallback={<CountIn />}>
        <Content />
      </Suspense>
    </main>
  );
}
