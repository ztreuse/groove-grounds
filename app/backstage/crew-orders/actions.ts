"use server";

import { quoteSchema } from "@/lib/crew";
import { declineCrewRequest, quoteCrewRequest } from "@/lib/db/crew";
import { getOwner } from "@/lib/staff";
import { z } from "zod";

// Owner-only Crew Order inbox actions.

export async function sendQuote(input: unknown) {
  if (!(await getOwner())) return false;
  const parsed = quoteSchema.safeParse(input);
  if (!parsed.success) return false;
  return quoteCrewRequest(parsed.data.id, parsed.data.amount, parsed.data.note);
}

export async function declineRequest(id: string) {
  if (!(await getOwner()) || !z.uuid().safeParse(id).success) return false;
  return declineCrewRequest(id);
}
