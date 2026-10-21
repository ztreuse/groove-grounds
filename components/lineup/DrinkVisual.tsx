"use client";

import Image from "next/image";
import { CupPreview } from "@/components/remix/CupPreview";
import { useCopy } from "@/hooks/use-copy";
import { cupStateFor } from "@/lib/drink-visuals";
import { SnackArt } from "./SnackArt";

type DrinkVisualProps = {
  drink: {
    slug: string;
    name: string;
    plainDescription: string;
    imageSrc: string | null;
  };
  // Animate steam and fill (hero, drink page); off in grids of cards.
  live?: boolean;
  priority?: boolean;
  sizes?: string;
};

// The drink's product photo when it exists (public/drinks/<slug>.png), else
// its illustrated cup or snack. Fills its parent's height.
export function DrinkVisual({
  drink,
  live = false,
  priority = false,
  sizes = "(min-width: 1024px) 30vw, 80vw",
}: DrinkVisualProps) {
  const { plain } = useCopy();
  const label = `${drink.name}, ${drink.plainDescription}`;

  if (drink.imageSrc) {
    return (
      <div className="relative h-full w-full">
        <Image
          src={drink.imageSrc}
          alt={label}
          fill
          priority={priority}
          sizes={sizes}
          className="object-contain drop-shadow-[0_24px_24px_rgb(43_30_23_/_0.35)]"
        />
      </div>
    );
  }

  const cup = cupStateFor(drink.slug);
  if (cup) {
    return (
      <div className="h-full text-espresso">
        <CupPreview state={cup} label={label} still={!live} />
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label={label || plain.terms.intermission}
      className="flex h-full justify-center text-espresso"
    >
      <SnackArt slug={drink.slug} />
    </div>
  );
}
