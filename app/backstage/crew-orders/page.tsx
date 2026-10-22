import { Suspense } from "react";
import type { Metadata } from "next";
import { BackstageHeader } from "@/components/backstage/BackstageHeader";
import { CrewInbox } from "@/components/backstage/CrewInbox";
import { StaffGate } from "@/components/backstage/StaffGate";
import { CountIn } from "@/components/layout/CountIn";
import { dance } from "@/lib/copy";
import { listCrewRequests } from "@/lib/db/crew";
import { routes } from "@/lib/routes";
import { getStaff } from "@/lib/staff";
import { getCurrentUser } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: dance.pages.backstageCrewOrders,
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
    return <StaffGate reason={reason} next={routes.backstageCrewOrders.href} />;
  }
  return <CrewInbox requests={await listCrewRequests()} />;
}

export default function CrewOrdersPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 pt-8 pb-16 sm:pt-12">
      <BackstageHeader page="backstageCrewOrders" intro="crew" />
      <Suspense fallback={<CountIn />}>
        <Content />
      </Suspense>
    </main>
  );
}
