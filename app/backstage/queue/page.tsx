import type { Metadata } from "next";
import { BackstageHeader } from "@/components/backstage/BackstageHeader";
import { QueueBoard } from "@/components/backstage/QueueBoard";
import { dance } from "@/lib/copy";

export const metadata: Metadata = {
  title: dance.pages.backstageQueue,
  robots: { index: false },
};

export default function QueuePage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 pt-8 pb-16 sm:pt-12">
      <BackstageHeader page="backstageQueue" />
      <QueueBoard />
    </main>
  );
}
