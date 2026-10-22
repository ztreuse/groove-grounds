import { z } from "zod";
import { normalizePhone, PH_MOBILE } from "@/lib/checkout";

// Crew Order request: shared by the /crew form and its server action.
// Error messages are copy keys in `crew`.

export const CREW_LEAD_DAYS = 2;
export const CREW_MAX_DAYS = 60;
export const CREW_MIN_HEADCOUNT = 10;
export const CREW_MAX_HEADCOUNT = 200;
export const CREW_TEXT_LIMIT = 500;

// Blank stays null. The form sends parsed values, so null is valid input too.
const optionalPesos = z
  .union([
    z.literal(""),
    z.null(),
    z.coerce.number().int().min(0).max(1_000_000),
  ])
  .transform((value) => (value === "" || value === null ? null : value));

export const crewFormSchema = z.object({
  name: z.string().trim().min(2, "errorName").max(60, "errorName"),
  phone: z
    .string()
    .transform(normalizePhone)
    .pipe(z.string().regex(PH_MOBILE, "errorPhone")),
  email: z
    .union([z.literal(""), z.null(), z.email("errorEmail")])
    .transform((value) => value || null),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "errorDate"),
  time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "errorTime"),
  headcount: z.coerce
    .number({ error: "errorHeadcount" })
    .int("errorHeadcount")
    .min(CREW_MIN_HEADCOUNT, "errorHeadcount")
    .max(CREW_MAX_HEADCOUNT, "errorHeadcount"),
  drinkMix: z
    .string()
    .trim()
    .min(5, "errorDrinkMix")
    .max(CREW_TEXT_LIMIT, "errorDrinkMix"),
  budget: optionalPesos,
  details: z.string().trim().max(CREW_TEXT_LIMIT),
});

export type CrewFormInput = z.input<typeof crewFormSchema>;
export type CrewForm = z.output<typeof crewFormSchema>;

// Date + time in Manila (UTC+8, no daylight saving) as a Date.
export const manilaDateTime = (date: string, time: string) =>
  new Date(`${date}T${time}:00+08:00`);

export const quoteSchema = z.object({
  id: z.uuid(),
  amount: z.coerce.number().int().min(1).max(1_000_000),
  note: z.string().trim().max(CREW_TEXT_LIMIT),
});
