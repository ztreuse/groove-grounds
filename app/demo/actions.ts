"use server";

import { forgetDemo } from "@/lib/demo-orders";

// Footer "Reset demo": this browser forgets its demo orders and Crew Order
// requests (the Playlist is cleared in the browser).
export async function resetDemo() {
  await forgetDemo();
  return true;
}
