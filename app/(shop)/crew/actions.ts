"use server";

import {
  CREW_LEAD_DAYS,
  CREW_MAX_DAYS,
  crewFormSchema,
  manilaDateTime,
} from "@/lib/crew";
import { dance } from "@/lib/copy";
import {
  createCrewRequest,
  getCrewRequest,
  quoteCrewRequest,
  respondToCrewQuote,
} from "@/lib/db/crew";
import { getProfile } from "@/lib/db/profiles";
import {
  ownsDemoCrewRequest,
  rememberDemoCrewRequest,
  rememberDemoOrder,
} from "@/lib/demo-orders";
import { getScheduleRules } from "@/lib/db/schedule";
import { getCurrentUser } from "@/lib/supabase/server";

const DAY = 24 * 60 * 60 * 1000;
// A typical drink on The Lineup, for demo quotes without a budget.
const DEMO_PRICE_PER_HEAD = 170;

type SubmitResult =
  | { ok: true; id: string }
  | { ok: false; error: "errorDate" | "errorTime" | "errorGeneric" };

export async function submitCrewRequest(input: unknown): Promise<SubmitResult> {
  const parsed = crewFormSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "errorGeneric" };
  const form = parsed.data;

  // Lead time and opening hours, checked on the server.
  const pickup = manilaDateTime(form.date, form.time);
  const now = Date.now();
  if (
    Number.isNaN(pickup.getTime()) ||
    pickup.getTime() < now + CREW_LEAD_DAYS * DAY ||
    pickup.getTime() > now + CREW_MAX_DAYS * DAY
  ) {
    return { ok: false, error: "errorDate" };
  }
  const rules = await getScheduleRules();
  const [h, m] = form.time.split(":").map(Number);
  const minute = h * 60 + m;
  if (minute < rules.openMinute || minute >= rules.closeMinute) {
    return { ok: false, error: "errorTime" };
  }

  const user = await getCurrentUser();
  const id = await createCrewRequest({
    userId: user ? ((await getProfile(user.id)) ? user.id : null) : null,
    name: form.name,
    phone: form.phone,
    contact: form.email,
    eventDate: pickup,
    headcount: form.headcount,
    drinkMix: form.drinkMix,
    budget: form.budget,
    details: form.details || null,
  });
  await rememberDemoCrewRequest(id);
  return { ok: true, id };
}

// Accepting creates the scheduled order; it's remembered as this
// visitor's demo order, so they can move it along in Demo Backstage too.
export async function respondToQuote(id: string, accept: boolean) {
  const result = await respondToCrewQuote(id, accept === true);
  if (typeof result === "string") await rememberDemoOrder(result);
  return Boolean(result);
}

// Concept demo: nobody's on shift to quote, so a visitor can quote their
// own request (from this browser) to try the rest of the flow. The amount
// is their budget, or a typical drink price per head.
export async function sendDemoQuote(id: string) {
  if (!(await ownsDemoCrewRequest(id))) return false;
  const request = await getCrewRequest(id);
  if (!request || request.status !== "new") return false;
  const amount = request.budget ?? request.headcount * DEMO_PRICE_PER_HEAD;
  return quoteCrewRequest(id, amount, dance.crew.demoQuoteNote);
}
