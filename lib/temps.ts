import {
  BlendedIcon,
  HotIcon,
  IcedIcon,
  type GrooveIcon,
} from "@/components/icons/GrooveIcons";
import type { Temperature } from "@/lib/pricing";

// One look per temperature, shared by drink cards, the Lineup filter and the
// Remix options: an icon, its copy key and its print colour. Class names
// are written out in full so Tailwind keeps them.
export const tempStyles = {
  hot: {
    icon: HotIcon,
    key: "warmUp",
    accent: "[--icon-accent:var(--color-temp-hot)]",
  },
  iced: {
    icon: IcedIcon,
    key: "coolDown",
    accent: "[--icon-accent:var(--color-temp-iced)]",
  },
  blended: {
    icon: BlendedIcon,
    key: "blended",
    accent: "[--icon-accent:var(--color-temp-blended)]",
  },
} as const satisfies Record<
  Temperature,
  {
    icon: GrooveIcon;
    key: "warmUp" | "coolDown" | "blended";
    accent: string;
  }
>;

export const isTemperature = (slug: string): slug is Temperature =>
  slug in tempStyles;
