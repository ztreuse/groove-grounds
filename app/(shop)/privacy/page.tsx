import type { Metadata } from "next";
import { PrivacyView } from "@/components/privacy/PrivacyView";
import { dance } from "@/lib/copy";

export const metadata: Metadata = {
  title: dance.pages.privacy,
  description: "What Groove Grounds collects, why, and your choices.",
};

export default function PrivacyPage() {
  return (
    <main className="flex-1">
      <PrivacyView />
    </main>
  );
}
