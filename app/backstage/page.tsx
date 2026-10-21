import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/layout/PagePlaceholder";
import { dance } from "@/lib/copy";

export const metadata: Metadata = { title: dance.pages.backstage };

export default function Page() {
  return <PagePlaceholder page="backstage" />;
}
