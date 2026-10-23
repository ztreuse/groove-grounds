import type { Metadata } from "next";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { CrewRequestView } from "@/components/crew/CrewRequestView";
import { dance } from "@/lib/copy";
import { getCrewRequest } from "@/lib/db/crew";
import { ownsDemoCrewRequest } from "@/lib/demo-orders";

export const metadata: Metadata = {
  title: dance.crew.requestTitle,
  // Request pages are private links.
  robots: { index: false },
};

export default async function CrewRequestPage({
  params,
}: PageProps<"/crew/requests/[id]">) {
  // Always fresh: the status changes from Backstage.
  await connection();
  const { id } = await params;
  const request = await getCrewRequest(id);
  if (!request) notFound();
  const canDemoQuote =
    request.status === "new" && (await ownsDemoCrewRequest(id));
  return <CrewRequestView request={request} canDemoQuote={canDemoQuote} />;
}
