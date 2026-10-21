import type { Metadata } from "next";
import { EditableFreestyleBuilder } from "@/components/freestyle/EditableFreestyleBuilder";
import { dance } from "@/lib/copy";
import { getFreestyleBases } from "@/lib/db/queries";

export const metadata: Metadata = { title: dance.pages.freestyle };

export default async function FreestylePage() {
  const bases = await getFreestyleBases();
  return <EditableFreestyleBuilder bases={bases} />;
}
