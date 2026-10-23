"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { resetDemo } from "@/app/demo/actions";
import { useCopy } from "@/hooks/use-copy";
import { usePlaylist } from "@/stores/playlist";

// Footer link: two taps clear the Playlist and this browser's demo orders,
// so the whole flow can be shown again from scratch.
export function ResetDemo() {
  const { t } = useCopy();
  const router = useRouter();
  const clear = usePlaylist((state) => state.clear);
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!confirm) return;
    const timer = setTimeout(() => setConfirm(false), 4000);
    return () => clearTimeout(timer);
  }, [confirm]);

  async function onClick() {
    if (!confirm) {
      setConfirm(true);
      return;
    }
    setBusy(true);
    await resetDemo();
    clear();
    setBusy(false);
    setConfirm(false);
    toast(t.footer.resetDone);
    router.push("/");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      className="inline-flex min-h-11 items-center rounded-md px-3 text-sm font-semibold outline-none hover:bg-cream/10 focus-visible:ring-3 focus-visible:ring-lilac disabled:opacity-60"
    >
      {confirm ? t.footer.resetConfirm : t.footer.reset}
    </button>
  );
}
