"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { runItBack } from "@/app/(shop)/profile/actions";
import { Button } from "@/components/ui/button";
import { useCopy } from "@/hooks/use-copy";
import { fill } from "@/lib/copy";
import { routes } from "@/lib/routes";
import { usePlaylist } from "@/stores/playlist";

type Result = { added: number; skipped: string[] } | "failed" | null;

// One tap adds a past order or a saved choreo back to the Playlist.
export function RunItBackButton({
  kind,
  id,
}: {
  kind: "order" | "choreo";
  id: string;
}) {
  const { t, plain } = useCopy();
  const router = useRouter();
  const addItem = usePlaylist((state) => state.addItem);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Result>(null);

  async function handleClick() {
    setBusy(true);
    const response = await runItBack(kind, id).catch(() => null);
    setBusy(false);
    if (!response) {
      setResult("failed");
      return;
    }
    for (const item of response.items) addItem(item);
    if (response.items.length > 0) {
      toast(t.drink.added, {
        description: response.items.map((item) => item.name).join(", "),
        action: {
          label: t.drink.viewPlaylist,
          onClick: () => router.push(routes.playlist.href),
        },
      });
    }
    setResult({ added: response.items.length, skipped: response.skipped });
  }

  return (
    <div>
      <Button
        type="button"
        onClick={handleClick}
        disabled={busy}
        aria-label={plain.profile.runItBack}
      >
        <RotateCcw aria-hidden />
        {t.profile.runItBack}
      </Button>
      <div aria-live="polite" className="text-sm">
        {result === "failed" && (
          <p className="mt-2 text-destructive">{t.profile.runFailed}</p>
        )}
        {result && result !== "failed" && (
          <>
            {result.added > 0 && (
              <p className="mt-2 flex flex-wrap items-center gap-x-2 font-semibold">
                <Check aria-hidden className="size-4 text-highlight" />
                {t.drink.added}
                <Link
                  href={routes.playlist.href}
                  className="inline-flex min-h-11 items-center text-highlight underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring"
                >
                  {t.drink.viewPlaylist}
                </Link>
              </p>
            )}
            {result.skipped.length > 0 && (
              <p className="mt-1 text-muted-foreground">
                {fill(t.profile.skipped, { names: result.skipped.join(", ") })}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
