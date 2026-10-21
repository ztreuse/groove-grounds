import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OrderTracker } from "@/components/tracker/OrderTracker";
import { dance } from "@/lib/copy";
import { getOrder } from "@/lib/db/orders";

export const metadata: Metadata = {
  title: dance.pages.track,
  // Order pages are private links.
  robots: { index: false },
};

export default async function TrackPage({
  params,
}: PageProps<"/track/[orderId]">) {
  const { orderId } = await params;
  const order = await getOrder(orderId);
  if (!order) notFound();
  return <OrderTracker initialOrder={order} />;
}
