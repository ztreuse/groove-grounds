import type { GrooveIcon } from "@/components/icons/GrooveIcons";

type IconTileProps = {
  icon: GrooveIcon;
  // inherit: tinted from the text colour around it (use inside buttons).
  tone?: "accent" | "neutral" | "inherit" | "custom";
  // Tile colours for tone="custom" (e.g. a temperature from lib/temps).
  className?: string;
  // fluid: sm on phones, md from the sm breakpoint.
  size?: "sm" | "md" | "lg" | "fluid";
};

const tones = {
  accent: "bg-primary/12 text-highlight",
  neutral: "bg-muted text-foreground",
  inherit: "bg-current/15",
  custom: "",
};

const sizes = {
  sm: { tile: "size-6", icon: "size-3.5" },
  md: { tile: "size-9", icon: "size-5" },
  lg: { tile: "size-14", icon: "size-8" },
  fluid: { tile: "size-7 sm:size-9", icon: "size-4 sm:size-5" },
};

// A solid Groove glyph on a small square tinted in its own colour, like a
// brand logo chip. Decorative.
export function IconTile({
  icon: Icon,
  tone = "accent",
  className = "",
  size = "md",
}: IconTileProps) {
  return (
    <span
      aria-hidden
      className={`inline-flex shrink-0 items-center justify-center rounded-md ${sizes[size].tile} ${tones[tone]} ${className}`}
    >
      <Icon className={sizes[size].icon} />
    </span>
  );
}
