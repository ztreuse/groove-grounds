import { z } from "zod";
import { normalizePhone, PH_MOBILE } from "@/lib/checkout";

// Shared by the Join / Sign in forms (client) and the auth actions (server).
// Error messages are copy keys in `auth`.

export const loginSchema = z.object({
  email: z.email("errorEmail").trim().toLowerCase(),
  password: z.string().min(1, "errorPassword").max(72, "errorPassword"),
});

export const joinSchema = z.object({
  name: z.string().trim().min(2, "errorName").max(60, "errorName"),
  email: z.email("errorEmail").trim().toLowerCase(),
  password: z.string().min(8, "errorPassword").max(72, "errorPassword"),
  phone: z
    .string()
    .transform(normalizePhone)
    .pipe(z.union([z.literal(""), z.string().regex(PH_MOBILE, "errorPhone")])),
});

export const profileSchema = joinSchema.pick({ name: true, phone: true });

// Sign in uses the same form fields as Join; name and phone are ignored.
export const loginFormSchema = loginSchema.extend({
  name: z.string(),
  phone: z.string(),
});

export type LoginInput = z.input<typeof loginSchema>;
export type JoinInput = z.input<typeof joinSchema>;
export type ProfileInput = z.input<typeof profileSchema>;

export type AuthErrorKey =
  | "errorInvalidLogin"
  | "errorExists"
  | "errorNotConfirmed"
  | "errorRateLimit"
  | "errorEmailBlocked"
  | "errorLink"
  | "errorGeneric";

export type AuthResult =
  | { ok: true; needsConfirmation?: boolean }
  | { ok: false; error: AuthErrorKey };

// Only same-site paths, never "//other-site".
export function safeNext(next: string | null | undefined, fallback: string) {
  return next && next.startsWith("/") && !next.startsWith("//")
    ? next
    : fallback;
}
