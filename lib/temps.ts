import { CupSoda, Flame, Snowflake } from "lucide-react";
import type { Temperature } from "@/lib/pricing";

// One look per temperature, shared by drink cards, the Lineup filter and the
// Remix options: an icon, its copy key and its colour. Class names are
// written out in full so Tailwind keeps them.
export const tempStyles = {
  hot: {
    icon: Flame,
    key: "warmUp",
    tile: "bg-temp-hot/15 text-temp-hot",
    solid: "bg-temp-hot text-white",
  },
  iced: {
    icon: Snowflake,
    key: "coolDown",
    tile: "bg-temp-iced/15 text-temp-iced",
    solid: "bg-temp-iced text-white",
  },
  blended: {
    icon: CupSoda,
    key: "blended",
    tile: "bg-temp-blended/15 text-temp-blended",
    solid: "bg-temp-blended text-white",
  },
} as const satisfies Record<
  Temperature,
  {
    icon: typeof Flame;
    key: "warmUp" | "coolDown" | "blended";
    // Tinted tile on light surfaces; solid tile on dark/selected ones.
    tile: string;
    solid: string;
  }
>;

export const isTemperature = (slug: string): slug is Temperature =>
  slug in tempStyles;
