"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { RecordIcon } from "@/components/icons/GrooveIcons";
import { AnimatePresence } from "motion/react";
import { CountIn } from "@/components/layout/CountIn";
import { IconTile } from "@/components/layout/IconTile";
import { PageHero } from "@/components/layout/PageHero";
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
    <main className="flex-1 pb-16">
      <PageHero
        title={t.pages.playlist}
        plainTitle={plain.pages.playlist}
        image="/scenes/barista.webp"
        imagePosition="center 35%"
      />
      <div className="mx-auto w-full max-w-6xl px-4 pt-8">
        {items.length === 0 ? (
          <div className="mt-10 flex flex-col items-center rounded-3xl bg-muted/60 px-6 py-12 text-center">
            <IconTile icon={RecordIcon} size="lg" />
            <h2 className="mt-4 text-3xl">{t.playlist.emptyTitle}</h2>
            <p className="mt-2 max-w-sm text-muted-foreground">
              {t.playlist.emptyBody}
            </p>
            <Button asChild size="lg" className="mt-6">
              <Link
                href={routes.lineup.href}
                aria-label={plain.playlist.browse}
              >
                {t.playlist.browse}
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
            <div>
              <p className="mt-4 text-sm font-medium text-muted-foreground">
                {count === 1
                  ? t.header.cartItem
                  : fill(t.header.cartItems, { count })}
              </p>
              <ul className="mt-3 space-y-3">
                <AnimatePresence initial={false}>
                  {items.map((item) => (
                    <PlaylistItem key={item.id} item={item} />
                  ))}
                </AnimatePresence>
              </ul>
              <Link
                href={routes.lineup.href}
                className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-sm font-semibold text-highlight outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring"
              >
                <Plus aria-hidden className="size-4" />
                {t.playlist.addMore}
              </Link>
            </div>

            {/* Order summary: sticks beside the tracks on wide screens. */}
            <div className="surface p-5 lg:sticky lg:top-24 lg:mt-12">
              <div className="flex items-baseline justify-between">
                <p className="font-semibold">{t.playlist.subtotal}</p>
                <p className="font-heading text-5xl leading-none font-black [font-stretch:70%]">
                  {formatPeso(subtotal)}
                </p>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {t.playlist.previewNote}
              </p>
              <Button
                asChild
                size="lg"
                className="mt-4 h-auto min-h-14 w-full flex-col gap-0 rounded-md py-2"
              >
                <Link
                  href={routes.showtime.href}
                  aria-label={plain.terms.showtime}
                >
                  <span className="text-base font-bold">
                    {t.terms.showtime}
                  </span>
                  {!isPlain && (
                    <span className="text-xs font-medium">
                      {plain.terms.showtime}
                    </span>
                  )}
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
