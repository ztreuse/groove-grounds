import type { Metadata } from "next";
import { DictionaryView } from "@/components/dictionary/DictionaryView";
import { dance } from "@/lib/copy";
import { getLineup } from "@/lib/db/queries";

export const metadata: Metadata = {
  title: dance.pages.dictionary,
  description: "Every dance term on Groove Grounds, explained in plain words.",
};

export default async function DictionaryPage() {
  const { drinks } = await getLineup();
  // Link each dance style to the drink named after it.
  const styleDrinks = drinks.map(({ danceStyle, name, slug }) => ({
    style: danceStyle,
    name,
    slug,
  }));
  return <DictionaryView styleDrinks={styleDrinks} />;
}
