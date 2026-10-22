import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { connection } from "next/server";

// Supabase client for server actions and server components. The session
// lives in cookies shared with the browser client.
export async function createSupabaseServer() {
  const store = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => store.getAll(),
        setAll: (cookiesToSet) => {
          try {
            for (const { name, value, options } of cookiesToSet) {
              store.set(name, value, options);
            }
          } catch {
            // Server components can't set cookies; server actions can, and
            // the browser client refreshes the session anyway.
          }
        },
      },
    },
  );
}

// The signed-in user, verified with Supabase Auth, or null.
export async function getCurrentUser() {
  // Supabase checks the session expiry with Date.now(); render per request.
  await connection();
  const supabase = await createSupabaseServer();
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}
