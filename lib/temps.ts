import {
  BlendedIcon,
  HotIcon,
  IcedIcon,
  type GrooveIcon,
} from "@/components/icons/GrooveIcons";
import type { Temperature } from "@/lib/pricing";

// One look per temperature, shared by drink cards, the Lineup filter and the
// Remix options: an icon, its copy key and its colour. Class names
// are written out in full so Tailwind keeps them.
export const tempStyles = {
  hot: {
    icon: HotIcon,
    key: "warmUp",
    accent: "bg-temp-hot/15 text-temp-hot",
  },
  iced: {
    icon: IcedIcon,
    key: "coolDown",
    accent: "bg-temp-iced/15 text-temp-iced",
  },
  blended: {
    icon: BlendedIcon,
    key: "blended",
    accent: "bg-temp-blended/15 text-temp-blended",
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
