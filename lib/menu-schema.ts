import { z } from "zod";

// Shared by the Backstage menu manager form and its server actions.
// Error messages are copy keys (menu.required, menu.priceInvalid).

const text = (max: number) => z.string().trim().min(1, "required").max(max);
const pesos = z.coerce
  .number({ error: "priceInvalid" })
  .int("priceInvalid")
  .min(0, "priceInvalid")
  .max(5000, "priceInvalid");

export const TEMPS = ["hot", "iced", "blended"] as const;

export const drinkFormSchema = z.object({
  name: text(60),
  danceStyle: text(40),
  plainDescription: text(140),
  blurb: text(280),
  basePrice: pesos,
  tempsAllowed: z.array(z.enum(TEMPS)),
});
export type DrinkFormInput = z.input<typeof drinkFormSchema>;
export type DrinkFormValues = z.output<typeof drinkFormSchema>;

export const newDrinkSchema = drinkFormSchema.extend({
  genreId: z.uuid(),
});
export type NewDrinkInput = z.input<typeof newDrinkSchema>;

export const optionUpdateSchema = z.object({
  id: z.uuid(),
  priceDelta: pesos,
  isAvailable: z.boolean(),
});
