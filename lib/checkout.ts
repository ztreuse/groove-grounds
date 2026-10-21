import { z } from "zod";

// Shared by the Showtime form (client) and createOrder (server).

export const PH_MOBILE = /^(?:\+?63|0)9\d{9}$/;
export const NOTES_LIMIT = 140;
export const MAX_QUANTITY = 20;
export const CHOREO_NAME_LIMIT = 40;

export const normalizePhone = (phone: string) => phone.replace(/[\s-]/g, "");

export const paymentMethods = [
  "demo_gcash",
  "demo_card",
  "pay_at_pickup",
] as const;
export type PaymentMethod = (typeof paymentMethods)[number];

// Error messages are copy keys in `showtime`, resolved in the form.
export const checkoutFormSchema = z
  .object({
    orderType: z.enum(["drop_in", "class"]),
    slotStart: z.string(),
    name: z.string().trim().min(2, "errorName").max(60, "errorName"),
    phone: z
      .string()
      .transform(normalizePhone)
      .pipe(z.string().regex(PH_MOBILE, "errorPhone")),
    notes: z.string().trim().max(NOTES_LIMIT),
    paymentMethod: z.enum(paymentMethods),
  })
  .refine((form) => form.orderType === "drop_in" || form.slotStart, {
    path: ["slotStart"],
    message: "errorSlot",
  });

export type CheckoutFormInput = z.input<typeof checkoutFormSchema>;
export type CheckoutForm = z.output<typeof checkoutFormSchema>;

export const orderItemSchema = z.object({
  drinkId: z.uuid(),
  quantity: z.number().int().min(1).max(MAX_QUANTITY),
  selection: z.record(z.uuid(), z.array(z.uuid()).max(10)),
  notes: z.string().max(NOTES_LIMIT),
  // "Name your choreo" for Freestyle drinks; ignored for menu drinks.
  name: z.string().trim().max(CHOREO_NAME_LIMIT).optional(),
});

export const orderPayloadSchema = z.object({
  form: checkoutFormSchema,
  items: z.array(orderItemSchema).min(1).max(30),
});

export type OrderPayload = z.input<typeof orderPayloadSchema>;

export type CreateOrderResult =
  | { ok: true; orderId: string; code: string }
  | {
      ok: false;
      error:
        | "errorSlotFull"
        | "errorSlot"
        | "errorSittingOut"
        | "errorEmpty"
        | "errorGeneric";
      itemName?: string;
    };
