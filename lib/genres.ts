import type { TermKey } from "@/lib/copy";

// Genre slugs from the database mapped to their glossary terms in lib/copy.ts.
export const genreTerms: Record<string, TermKey> = {
  "old-school": "oldSchool",
  "new-school": "newSchool",
  mashup: "mashup",
  "off-beat": "offBeat",
  intermission: "intermission",
};

// Colour block behind each genre's drinks (theme tokens in globals.css).
export const genreBlock: Record<string, string> = {
  "old-school": "bg-genre-old",
  "new-school": "bg-genre-new",
  mashup: "bg-genre-mashup",
  "off-beat": "bg-genre-offbeat",
  intermission: "bg-genre-intermission",
};

export const genreBlockFor = (slug: string) =>
  genreBlock[slug] ?? "bg-genre-new";
