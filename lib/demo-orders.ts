import "server-only";
import { cookies } from "next/headers";
import { z } from "zod";

// Orders placed from this browser, so Demo Backstage only shows (and lets the
// visitor move) their own orders. httpOnly: page scripts can't read it.
const COOKIE = "gg_demo_orders";
const MAX_ORDERS = 20;

export async function getDemoOrderIds() {
  const store = await cookies();
  return (store.get(COOKIE)?.value ?? "")
    .split(".")
    .filter((id) => z.uuid().safeParse(id).success);
}

export async function rememberDemoOrder(id: string) {
  const ids = await getDemoOrderIds();
  const store = await cookies();
  store.set(
    COOKIE,
    [id, ...ids.filter((i) => i !== id)].slice(0, MAX_ORDERS).join("."),
    {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    },
  );
}

export async function ownsDemoOrder(id: string) {
  return (await getDemoOrderIds()).includes(id);
}
