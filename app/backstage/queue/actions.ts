"use server";

import { advanceOrder, cutOrder, getOrdersByIds } from "@/lib/db/orders";
import { getDemoOrderIds, ownsDemoOrder } from "@/lib/demo-orders";
import { ORDER_FLOW, type OrderStatus } from "@/lib/orders";

// Demo Backstage: visitors only see and move orders placed from their own
// browser. The full staff queue arrives with accounts in Phase 2.

export async function getMyQueue() {
  return getOrdersByIds(await getDemoOrderIds());
}

export async function moveOrder(id: string, from: OrderStatus) {
  if (!ORDER_FLOW.includes(from as (typeof ORDER_FLOW)[number])) return null;
  if (!(await ownsDemoOrder(id))) return null;
  return advanceOrder(id, from);
}

export async function cutMyOrder(id: string) {
  if (!(await ownsDemoOrder(id))) return false;
  return cutOrder(id);
}
