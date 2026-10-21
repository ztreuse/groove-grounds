// Remembers which home button was tapped (Drop-in or Book a Class) so
// Showtime can preselect it. Per tab, and safe when storage is blocked.

const KEY = "gg-order-intent";

export type OrderIntent = "drop_in" | "class";

export function setOrderIntent(intent: OrderIntent) {
  try {
    sessionStorage.setItem(KEY, intent);
  } catch {}
}

export function getOrderIntent(): OrderIntent | null {
  try {
    const value = sessionStorage.getItem(KEY);
    return value === "drop_in" || value === "class" ? value : null;
  } catch {
    return null;
  }
}
