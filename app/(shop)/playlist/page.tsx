import type { Metadata } from "next";
import { PlaylistView } from "@/components/playlist/PlaylistView";
import { dance } from "@/lib/copy";

export const metadata: Metadata = { title: dance.pages.playlist };

export default function PlaylistPage() {
  return <PlaylistView />;
}
