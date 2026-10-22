import type { LucideIcon } from "lucide-react";

type IconTileProps = {
  icon: LucideIcon;
  // inherit: tints with the text colour around it (use inside buttons).
  tone?: "accent" | "neutral" | "inherit" | "custom";
  // Tile colours for tone="custom" (e.g. a temperature from lib/temps).
  className?: string;
  size?: "sm" | "md" | "lg";
};

const tones = {
  accent: "bg-primary/12 text-highlight",
  neutral: "bg-muted text-foreground",
  inherit: "bg-current/12",
  custom: "",
};

const sizes = {
  sm: { tile: "size-6", icon: "size-3.5" },
  md: { tile: "size-9", icon: "size-5" },
  lg: { tile: "size-14", icon: "size-7" },
};

// An icon sitting on a small tinted square, so icons beside labels read as
// a deliberate mark rather than a bare line drawing. Decorative.
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
      <Icon className={sizes[size].icon} strokeWidth={2} />
    </span>
  );
}
