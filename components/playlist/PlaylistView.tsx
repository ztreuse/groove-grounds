"use client";

import Link from "next/link";
import { Disc3, Plus } from "lucide-react";
import { CountIn } from "@/components/layout/CountIn";
import { Button } from "@/components/ui/button";
import { useCopy } from "@/hooks/use-copy";
import { usePlaylistHydrated } from "@/hooks/use-playlist-hydrated";
import { fill } from "@/lib/copy";
import { formatPeso } from "@/lib/format";
import { routes } from "@/lib/routes";
import { selectItemCount, usePlaylist } from "@/stores/playlist";
import { PlaylistItem } from "./PlaylistItem";

export function PlaylistView() {
  const { t, plain, isPlain } = useCopy();
  const hydrated = usePlaylistHydrated();
  const items = usePlaylist((state) => state.items);
  const count = usePlaylist(selectItemCount);
  const subtotal = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );

  if (!hydrated) return <CountIn />;

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 pt-8 pb-16 sm:pt-12">
      <h1 className="text-5xl leading-none sm:text-7xl">{t.pages.playlist}</h1>
      {!isPlain && (
        <p className="mt-1 text-lg text-muted-foreground">
          {plain.pages.playlist}
        </p>
      )}

      {items.length === 0 ? (
        <div className="mt-10 flex flex-col items-center rounded-3xl border-2 border-dashed px-6 py-12 text-center">
          <Disc3 aria-hidden className="size-14 text-highlight" />
          <h2 className="mt-4 text-3xl">{t.playlist.emptyTitle}</h2>
          <p className="mt-2 max-w-sm text-muted-foreground">
            {t.playlist.emptyBody}
          </p>
          <Button asChild size="lg" className="mt-6">
            <Link href={routes.lineup.href} aria-label={plain.playlist.browse}>
              {t.playlist.browse}
            </Link>
          </Button>
        </div>
      ) : (
        <>
          <p className="mt-4 text-sm font-medium text-muted-foreground">
            {count === 1
              ? t.header.cartItem
              : fill(t.header.cartItems, { count })}
          </p>
          <ul className="mt-3 space-y-3">
            {items.map((item) => (
              <PlaylistItem key={item.id} item={item} />
            ))}
          </ul>
          <Link
            href={routes.lineup.href}
            className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-sm font-semibold text-highlight outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring"
          >
            <Plus aria-hidden className="size-4" />
            {t.playlist.addMore}
          </Link>

          <div className="mt-6 rounded-2xl border-2 bg-card p-4">
            <div className="flex items-baseline justify-between">
              <p className="font-semibold">{t.playlist.subtotal}</p>
              <p className="font-heading text-4xl">{formatPeso(subtotal)}</p>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {t.playlist.previewNote}
            </p>
            <Button
              asChild
              size="lg"
              className="mt-4 h-auto min-h-14 w-full flex-col gap-0 rounded-full py-2"
            >
              <Link
                href={routes.showtime.href}
                aria-label={plain.terms.showtime}
              >
                <span className="text-base font-bold">{t.terms.showtime}</span>
                {!isPlain && (
                  <span className="text-xs font-medium">
                    {plain.terms.showtime}
                  </span>
                )}
              </Link>
            </Button>
          </div>
        </>
      )}
    </main>
  );
}
