import type { GrooveIcon } from "@/components/icons/GrooveIcons";

type IconTileProps = {
  icon: GrooveIcon;
  // Colour of the off-register print behind the outline.
  tone?: "accent" | "neutral" | "inherit" | "custom";
  // Accent for tone="custom", e.g. a temperature from lib/temps.
  className?: string;
  size?: "sm" | "md" | "lg";
};

const tones = {
  accent: "[--icon-accent:var(--color-lilac)]",
  neutral: "[--icon-accent:var(--color-khaki)]",
  // Inside coloured buttons: a translucent print of the text colour.
  inherit: "[--icon-accent:color-mix(in_oklch,currentColor_30%,transparent)]",
  custom: "",
};

const sizes = { sm: "size-5", md: "size-6", lg: "size-14" };

// A Groove Grounds icon at a set size and print colour. Decorative.
export function IconTile({
  icon: Icon,
  tone = "accent",
  className = "",
  size = "md",
}: IconTileProps) {
  return (
    <span
      aria-hidden
      className={`inline-flex shrink-0 ${tones[tone]} ${className}`}
    >
      <Icon className={sizes[size]} />
    </span>
  );
}
