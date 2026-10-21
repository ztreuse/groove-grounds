"use client";

import { dance, plain, type Copy } from "@/lib/copy";
import { usePreferences } from "@/stores/preferences";

// `t` follows the Plain Mode setting. `plain` is always available for
// aria-labels and for the small subtitles shown in Dance mode.
export function useCopy(): { t: Copy; plain: Copy; isPlain: boolean } {
  const isPlain = usePreferences((state) => state.plainMode);
  return { t: isPlain ? plain : dance, plain, isPlain };
}
