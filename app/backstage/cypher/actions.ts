"use server";

import { updateTag } from "next/cache";
import { z } from "zod";
import { cypherPostSchema } from "@/lib/cypher";
import {
  createCypherPost,
  CYPHER_TAG,
  deleteCypherPost,
  setCypherPublished,
  updateCypherPost,
} from "@/lib/db/cypher";
import { getOwner } from "@/lib/staff";

const id = z.uuid();

// Owner-only edits to The Cypher. Each one refreshes Center Stage.
export async function saveCypherPost(postId: string | null, input: unknown) {
  if (!(await getOwner())) return false;
  const parsed = cypherPostSchema.safeParse(input);
  if (!parsed.success) return false;
  if (postId === null) {
    await createCypherPost(parsed.data);
  } else {
    if (!id.safeParse(postId).success) return false;
    if (!(await updateCypherPost(postId, parsed.data))) return false;
  }
  updateTag(CYPHER_TAG);
  return true;
}

export async function publishCypherPost(postId: string, published: boolean) {
  if (!(await getOwner()) || !id.safeParse(postId).success) return false;
  const ok = await setCypherPublished(postId, published === true);
  if (ok) updateTag(CYPHER_TAG);
  return ok;
}

export async function removeCypherPost(postId: string) {
  if (!(await getOwner()) || !id.safeParse(postId).success) return false;
  const ok = await deleteCypherPost(postId);
  if (ok) updateTag(CYPHER_TAG);
  return ok;
}
