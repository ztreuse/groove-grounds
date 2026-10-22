import { genreBlockFor } from "@/lib/genres";

type StyleTagProps = {
  label: string;
  // Genre slug for the colour swatch.
  genre: string;
  size?: "sm" | "md";
  // Screen-reader text when the visible label is a dance term.
  srLabel?: string;
};

// Tag laid over drink photos: frosted cream chip with a hairline, a swatch
// in the genre's colour, then the dance style or genre name.
export function StyleTag({
  label,
  genre,
  size = "sm",
  srLabel,
}: StyleTagProps) {
  return (
    <span
      className={`inline-flex items-center rounded-sm bg-background/85 font-semibold text-foreground ring-1 ring-foreground/10 backdrop-blur-md ring-inset ${
        size === "sm"
          ? "gap-1.5 py-1 pr-2 pl-1 text-xs"
          : "gap-2 py-1.5 pr-3 pl-1.5 text-sm"
      }`}
    >
      <span
        aria-hidden
        className={`rounded-[3px] ring-1 ring-foreground/15 ring-inset ${genreBlockFor(genre)} ${
          size === "sm" ? "size-4" : "size-5"
        }`}
      />
      <span aria-hidden={srLabel ? true : undefined}>{label}</span>
      {srLabel && <span className="sr-only">{srLabel}</span>}
    </span>
  );
}
