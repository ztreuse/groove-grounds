import type { Metadata } from "next";
import { ShowtimeIntro } from "@/components/showtime/ShowtimeIntro";
import { ShowtimeForm } from "@/components/showtime/ShowtimeForm";
import { dance } from "@/lib/copy";

export const metadata: Metadata = { title: dance.pages.showtime };

export default function ShowtimePage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 pt-8 pb-16 sm:pt-12">
      <ShowtimeIntro />
      <ShowtimeForm />
    </main>
  );
}
