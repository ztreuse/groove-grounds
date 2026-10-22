import "server-only";
import type { User } from "@supabase/supabase-js";

// The shared demo dancer account (Sign in > Try the demo dancer). Visitors
// can browse it and Run it back, but not change its details or choreo.
export function isDemoDancer(user: Pick<User, "email"> | null) {
  const email = process.env.DEMO_DANCER_EMAIL;
  return Boolean(email && user?.email?.toLowerCase() === email.toLowerCase());
}

export function demoDancerCredentials() {
  const email = process.env.DEMO_DANCER_EMAIL;
  const password = process.env.DEMO_DANCER_PASSWORD;
  return email && password ? { email, password } : null;
}
