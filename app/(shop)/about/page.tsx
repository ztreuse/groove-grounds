import type { Metadata } from "next";
import { AboutView } from "@/components/about/AboutView";
import { dance, plain } from "@/lib/copy";

export const metadata: Metadata = {
  title: dance.pages.about,
  description: plain.about.intro,
};

export default function AboutPage() {
  return (
    <main className="flex-1">
      <AboutView />
    </main>
  );
}
