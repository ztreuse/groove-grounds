"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { motion } from "motion/react";
import { useCopy } from "@/hooks/use-copy";
import { fill } from "@/lib/copy";
import { routes } from "@/lib/routes";
import { selectItemCount, usePlaylist } from "@/stores/playlist";

export function PlaylistButton() {
  const { t, plain } = useCopy();
  const count = usePlaylist(selectItemCount);
  const countLabel =
    count === 1
      ? plain.header.cartItem
      : fill(plain.header.cartItems, { count });

  return (
    <Link
      href={routes.playlist.href}
      aria-label={`${plain.terms.playlist}, ${countLabel}`}
      className="relative inline-flex h-11 min-w-11 shrink-0 items-center justify-center gap-2 rounded-full px-2.5 transition-colors outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-3 focus-visible:ring-ring"
    >
      <ShoppingCart aria-hidden className="size-5" />
      <span className="hidden text-sm font-semibold lg:inline xl:hidden">
        {t.terms.playlist}
      </span>
      {count > 0 && (
        <motion.span
          key={count}
          aria-hidden
          initial={{ scale: 1.5 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 15 }}
          className="absolute -top-0.5 -right-0.5 flex size-5 items-center justify-center rounded-full bg-primary text-[0.7rem] font-bold text-primary-foreground lg:static lg:size-6"
        >
          {count > 99 ? "99+" : count}
        </motion.span>
      )}
    </Link>
  );
}
