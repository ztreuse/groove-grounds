import type { Copy } from "@/lib/copy";

// Order statuses in show order. "cut" (cancelled) sits outside the flow.
export const ORDER_FLOW = [
  "warm_up",
  "on_deck",
  "full_out",
  "stage_ready",
  "bow",
] as const;

export type FlowStatus = (typeof ORDER_FLOW)[number];
export type OrderStatus = FlowStatus | "cut";

export const statusCopyKey: Record<OrderStatus, keyof Copy["status"]> = {
  warm_up: "warmUp",
  on_deck: "onDeck",
  full_out: "fullOut",
  stage_ready: "stageReady",
  bow: "bow",
  cut: "cut",
};

// Where each status lands on the tracker's 8-count bar.
export const statusCount: Record<FlowStatus, number> = {
  warm_up: 2,
  on_deck: 4,
  full_out: 6,
  stage_ready: 7,
  bow: 8,
};

export function nextStatus(status: OrderStatus): FlowStatus | null {
  const index = ORDER_FLOW.indexOf(status as FlowStatus);
  return index >= 0 && index < ORDER_FLOW.length - 1
    ? ORDER_FLOW[index + 1]
    : null;
}

export const isOpen = (status: OrderStatus) =>
  status !== "bow" && status !== "cut";

// Booked classes reach the queue this long before their slot.
export const SURFACE_MINUTES = 15;

// The fictional crew from The Crew page (about.choreographers in copy.ts),
// first names only. Each order gets one, picked from its id so it stays
// stable.
const CHOREOGRAPHERS = ["Mika", "Jun"];
export function choreographerFor(orderId: string) {
  let hash = 0;
  for (const char of orderId) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return CHOREOGRAPHERS[hash % CHOREOGRAPHERS.length];
}

// Shape of order_items.options_snapshot.
export type OptionsSnapshot = {
  choices: {
    group: string;
    danceLabel: string;
    plainLabel: string;
    options: {
      slug: string;
      danceLabel: string;
      plainLabel: string;
      priceDelta: number;
    }[];
  }[];
  notes: string;
};
