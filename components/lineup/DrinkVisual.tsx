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
  // Animate steam and fill on the illustration (hero, drink page).
  live?: boolean;
  priority?: boolean;
  sizes?: string;
};

// The drink's product photo (public/drinks/<slug>.jpg), filling its frame.
// Drinks without a photo fall back to an illustrated cup or snack.
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
      <Image
        src={drink.imageSrc}
        alt={label}
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover"
      />
    );
  }

  const cup = cupStateFor(drink.slug);
  return (
    <div className="absolute inset-[10%] text-espresso">
      {cup ? (
        <CupPreview state={cup} label={label} still={!live} />
      ) : (
        <div
          role="img"
          aria-label={label || plain.terms.intermission}
          className="flex h-full justify-center"
        >
          <SnackArt slug={drink.slug} />
        </div>
      )}
    </div>
  );
}
