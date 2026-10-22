"use client";

import Link from "next/link";
import { IconTile } from "./IconTile";
import { PlaylistIcon } from "@/components/icons/GrooveIcons";
import { motion } from "motion/react";
import { useCopy } from "@/hooks/use-copy";
import { fill } from "@/lib/copy";
import { routes } from "@/lib/routes";
import { selectItemCount, usePlaylist } from "@/stores/playlist";

export function PlaylistButton() {
  const { plain } = useCopy();
  const count = usePlaylist(selectItemCount);
  const countLabel =
    count === 1
      ? plain.header.cartItem
      : fill(plain.header.cartItems, { count });

  return (
    <Link
      href={routes.playlist.href}
      aria-label={`${plain.terms.playlist}, ${countLabel}`}
      className="relative inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-muted text-foreground transition-colors outline-none hover:bg-foreground hover:text-background focus-visible:ring-3 focus-visible:ring-ring"
    >
      <IconTile icon={PlaylistIcon} tone="accent" />
      {count > 0 && (
        <motion.span
          key={count}
          aria-hidden
          initial={{ scale: 1.5 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 15 }}
          className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-primary text-[0.7rem] font-bold text-primary-foreground ring-2 ring-background"
        >
          {count > 99 ? "99+" : count}
        </motion.span>
      )}
    </Link>
  );
}
