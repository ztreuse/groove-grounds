"use client";

import { useCallback, useRef } from "react";

// For horizontal scrollers styled with the `scroll-edges` utility: marks
// which edges have more content (data-more-start / data-more-end) so only
// those edges fade. Returns a ref callback.
export function useScrollEdges<T extends HTMLElement>() {
  const cleanup = useRef<(() => void) | null>(null);

  return useCallback((el: T | null) => {
    cleanup.current?.();
    cleanup.current = null;
    if (!el) return;

    const update = () => {
      const max = el.scrollWidth - el.clientWidth;
      el.toggleAttribute("data-more-start", el.scrollLeft > 4);
      el.toggleAttribute("data-more-end", el.scrollLeft < max - 4);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(el);
    cleanup.current = () => {
      el.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, []);
}
