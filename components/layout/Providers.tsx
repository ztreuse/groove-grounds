"use client";

import { useEffect } from "react";
import { MotionConfig } from "motion/react";
import { usePlaylist } from "@/stores/playlist";
import { usePreferences } from "@/stores/preferences";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    usePreferences.persist.rehydrate();
    usePlaylist.persist.rehydrate();
  }, []);

  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
