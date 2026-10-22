import { z } from "zod";

// Backstage class schedule form. Times are "HH:MM" in the form and minutes
// after midnight in the database. Error messages are copy keys.

export const SLOT_LENGTHS = [10, 15, 20, 30] as const;

const time = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/);
const day = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const scheduleFormSchema = z
  .object({
    opens: time,
    closes: time,
    slotMinutes: z.coerce
      .number()
      .refine((n) => (SLOT_LENGTHS as readonly number[]).includes(n)),
    slotCapacity: z.coerce.number().int().min(1).max(50),
    daysAhead: z.coerce.number().int().min(1).max(30),
    leadMinutes: z.coerce.number().int().min(0).max(240),
    blackoutDates: z.array(day).max(60),
  })
  .refine((form) => toMinutes(form.closes) > toMinutes(form.opens), {
    path: ["closes"],
    message: "closeAfterOpen",
  });

export type ScheduleFormInput = z.input<typeof scheduleFormSchema>;
export type ScheduleFormValues = z.output<typeof scheduleFormSchema>;

export function toMinutes(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export function toHHMM(minutes: number) {
  const h = Math.floor(minutes / 60);
  return `${String(h).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
}
