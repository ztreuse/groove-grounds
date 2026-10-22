"use server";

import {
  advanceOrder,
  cutOrder,
  getOpenOrders,
  getOrdersByIds,
} from "@/lib/db/orders";
import { getDemoOrderIds, ownsDemoOrder } from "@/lib/demo-orders";
import { ORDER_FLOW, type OrderStatus } from "@/lib/orders";
import { getStaff } from "@/lib/staff";

// Staff (owner or barista) see and move every open order. Visitors get the
// Demo Backstage: only orders placed from their own browser.

export async function getMyQueue() {
  const staff = await getStaff();
  if (staff) return { orders: await getOpenOrders(), role: staff.role };
  return { orders: await getOrdersByIds(await getDemoOrderIds()), role: null };
}

async function mayTouch(id: string) {
  return Boolean(await getStaff()) || ownsDemoOrder(id);
}

export async function moveOrder(id: string, from: OrderStatus) {
  if (!ORDER_FLOW.includes(from as (typeof ORDER_FLOW)[number])) return null;
  if (!(await mayTouch(id))) return null;
  return advanceOrder(id, from);
}

export async function cutMyOrder(id: string) {
  if (!(await mayTouch(id))) return false;
  return cutOrder(id);
}
