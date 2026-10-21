import "server-only";
import { existsSync } from "node:fs";
import path from "node:path";

const EXTENSIONS = ["webp", "png", "jpg"];

// Product photo for a drink: an explicit image_url wins, then a file named
// after the slug in public/drinks/ (see docs/IMAGE_PROMPTS.md). Null means
// the illustrated cup is shown instead.
export function drinkImageSrc(slug: string, imageUrl?: string | null) {
  if (imageUrl) return imageUrl;
  for (const ext of EXTENSIONS) {
    const file = path.join(process.cwd(), "public", "drinks", `${slug}.${ext}`);
    if (existsSync(file)) return `/drinks/${slug}.${ext}`;
  }
  return null;
}
