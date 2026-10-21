"use client";

import { useSearchParams } from "next/navigation";
import type { LineupDrink, LineupGenre } from "@/lib/db/queries";
import { LineupBrowser } from "./LineupBrowser";

// The page is prerendered, so ?genre= (from the home page tiles) is read on
// the client.
export function LineupFromQuery(props: {
  genres: LineupGenre[];
  drinks: LineupDrink[];
}) {
  const genre = useSearchParams().get("genre");
  return <LineupBrowser {...props} initialGenre={genre} />;
}
