"use client";

import { useEffect, useEffectEvent, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase/client";

// Calls onUpdate when the database broadcasts on `topic` (see the
// order_broadcasts migration), and every `pollMs` as a fallback in case
// Realtime is unavailable. Returns whether the Realtime channel is connected.
export function useLiveUpdates(
  topic: string,
  event: string,
  onUpdate: () => void,
  { pollMs, enabled = true }: { pollMs: number; enabled?: boolean },
) {
  const [live, setLive] = useState(false);
  const update = useEffectEvent(onUpdate);

  useEffect(() => {
    if (!enabled) return;
    const supabase = getSupabaseBrowser();
    const channel = supabase
      .channel(topic)
      .on("broadcast", { event }, () => update())
      .subscribe((status) => setLive(status === "SUBSCRIBED"));
    return () => {
      setLive(false);
      supabase.removeChannel(channel);
    };
  }, [topic, event, enabled]);

  useEffect(() => {
    if (!enabled) return;
    const timer = setInterval(() => update(), pollMs);
    return () => clearInterval(timer);
  }, [pollMs, enabled]);

  return live;
}
