"use server";

import { headers } from "next/headers";
import {
  joinSchema,
  loginSchema,
  type AuthErrorKey,
  type AuthResult,
  type JoinInput,
  type LoginInput,
} from "@/lib/auth-schema";
import { createSupabaseServer } from "@/lib/supabase/server";
import { demoDancerCredentials } from "@/lib/demo-dancer";

// Supabase Auth error codes → copy keys in `auth`.
function authError(code: string | undefined): AuthErrorKey {
  switch (code) {
    case "invalid_credentials":
      return "errorInvalidLogin";
    case "user_already_exists":
    case "email_exists":
      return "errorExists";
    case "email_not_confirmed":
      return "errorNotConfirmed";
    case "over_request_rate_limit":
    case "over_email_send_rate_limit":
      return "errorRateLimit";
    case "email_address_not_authorized":
    case "email_address_invalid":
      return "errorEmailBlocked";
    default:
      return "errorGeneric";
  }
}

export async function signIn(input: LoginInput): Promise<AuthResult> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "errorInvalidLogin" };

  const supabase = await createSupabaseServer();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  return error ? { ok: false, error: authError(error.code) } : { ok: true };
}

export async function signUp(input: JoinInput): Promise<AuthResult> {
  const parsed = joinSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "errorGeneric" };
  const { name, email, password, phone } = parsed.data;

  const origin = (await headers()).get("origin") ?? "";
  const supabase = await createSupabaseServer();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // Read by the profile-on-signup trigger.
      data: { name, phone },
      emailRedirectTo: `${origin}/auth/callback?next=/profile`,
    },
  });
  if (error) return { ok: false, error: authError(error.code) };
  // With email confirmation on, Supabase returns no session yet.
  return { ok: true, needsConfirmation: !data.session };
}

// One tap into the shared demo dancer account.
export async function signInAsDemo(): Promise<AuthResult> {
  const credentials = demoDancerCredentials();
  if (!credentials) return { ok: false, error: "errorGeneric" };
  const supabase = await createSupabaseServer();
  const { error } = await supabase.auth.signInWithPassword(credentials);
  return error ? { ok: false, error: authError(error.code) } : { ok: true };
}

export async function signOut() {
  const supabase = await createSupabaseServer();
  await supabase.auth.signOut();
}
