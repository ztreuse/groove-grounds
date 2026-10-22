import "server-only";
import { desc, eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import {
  CYPHER_ON_HOME,
  type CypherPost,
  type CypherPostValues,
} from "@/lib/cypher";
import { db } from "./index";
import { cypherPosts } from "./schema";

// Cache tag for The Cypher; Backstage edits call updateTag on it.
export const CYPHER_TAG = "cypher";

// Newest published posts for Center Stage.
export async function getCypherPosts(): Promise<CypherPost[]> {
  "use cache";
  cacheTag(CYPHER_TAG);
  cacheLife("hours");

  const rows = await db
    .select()
    .from(cypherPosts)
    .where(eq(cypherPosts.isPublished, true))
    .orderBy(desc(cypherPosts.createdAt))
    .limit(CYPHER_ON_HOME);
  return rows.map((row) => ({
    id: row.id,
    tag: { dance: row.tagDance, plain: row.tagPlain },
    title: { dance: row.titleDance, plain: row.titlePlain },
    body: { dance: row.bodyDance, plain: row.bodyPlain },
    author: row.author,
  }));
}

// Every post, newest first, for the Backstage editor.
export async function listCypherPosts() {
  const rows = await db
    .select()
    .from(cypherPosts)
    .orderBy(desc(cypherPosts.createdAt));
  return rows.map((row) => ({
    ...row,
    createdAt: row.createdAt.toISOString(),
  }));
}

export async function createCypherPost(values: CypherPostValues) {
  await db.insert(cypherPosts).values(values);
}

export async function updateCypherPost(id: string, values: CypherPostValues) {
  const rows = await db
    .update(cypherPosts)
    .set(values)
    .where(eq(cypherPosts.id, id))
    .returning({ id: cypherPosts.id });
  return rows.length > 0;
}

export async function setCypherPublished(id: string, isPublished: boolean) {
  const rows = await db
    .update(cypherPosts)
    .set({ isPublished })
    .where(eq(cypherPosts.id, id))
    .returning({ id: cypherPosts.id });
  return rows.length > 0;
}

export async function deleteCypherPost(id: string) {
  const rows = await db
    .delete(cypherPosts)
    .where(eq(cypherPosts.id, id))
    .returning({ id: cypherPosts.id });
  return rows.length > 0;
}

export type CypherAdminPost = Awaited<
  ReturnType<typeof listCypherPosts>
>[number];
