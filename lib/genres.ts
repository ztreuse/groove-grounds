import type { TermKey } from "@/lib/copy";

// Genre slugs from the database mapped to their glossary terms in lib/copy.ts.
export const genreTerms: Record<string, TermKey> = {
  "old-school": "oldSchool",
  "new-school": "newSchool",
  mashup: "mashup",
  "off-beat": "offBeat",
  intermission: "intermission",
};
