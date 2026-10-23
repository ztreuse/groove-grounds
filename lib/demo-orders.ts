import "server-only";
import { cookies } from "next/headers";
import { z } from "zod";

// Things made from this browser, remembered in an httpOnly cookie (page
// scripts can't read it): orders, so Demo Backstage only shows (and lets the
// visitor move) their own; Crew Order requests, so a visitor can send a demo
// quote only to their own.
function demoList(cookie: string, max: number) {
  async function ids() {
    const store = await cookies();
    return (store.get(cookie)?.value ?? "")
      .split(".")
      .filter((id) => z.uuid().safeParse(id).success);
  }
  async function remember(id: string) {
    const current = await ids();
    const store = await cookies();
    store.set(
      cookie,
      [id, ...current.filter((i) => i !== id)].slice(0, max).join("."),
      {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      },
    );
  }
  async function owns(id: string) {
    return (await ids()).includes(id);
  }
  return { ids, remember, owns };
}

const orders = demoList("gg_demo_orders", 20);
export const getDemoOrderIds = orders.ids;
export const rememberDemoOrder = orders.remember;
export const ownsDemoOrder = orders.owns;

const crew = demoList("gg_demo_crew", 10);
export const rememberDemoCrewRequest = crew.remember;
export const ownsDemoCrewRequest = crew.owns;

// Reset demo: forget everything this browser made (the orders themselves
// stay in the database).
export async function forgetDemo() {
  const store = await cookies();
  store.delete("gg_demo_orders");
  store.delete("gg_demo_crew");
}
