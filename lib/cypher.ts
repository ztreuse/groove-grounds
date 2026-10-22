import { z } from "zod";

// The Cypher (community board / specials feed). Posts live in the
// cypher_posts table; each one has Dance and Plain wording. Shared by the
// Backstage editor and its server actions. Error messages are copy keys.

const text = (max: number) => z.string().trim().min(1, "required").max(max);

export const cypherPostSchema = z.object({
  tagDance: text(30),
  tagPlain: text(30),
  titleDance: text(80),
  titlePlain: text(80),
  bodyDance: text(240),
  bodyPlain: text(240),
  author: text(40),
});
export type CypherPostInput = z.input<typeof cypherPostSchema>;
export type CypherPostValues = z.output<typeof cypherPostSchema>;

type Wording = { dance: string; plain: string };

export type CypherPost = {
  id: string;
  tag: Wording;
  title: Wording;
  body: Wording;
  author: string;
};

// Posts shown on Center Stage: the newest published ones.
export const CYPHER_ON_HOME = 3;

export const EMPTY_POST: CypherPostInput = {
  tagDance: "",
  tagPlain: "",
  titleDance: "",
  titlePlain: "",
  bodyDance: "",
  bodyPlain: "",
  author: "@groovegrounds",
};
