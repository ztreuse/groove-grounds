"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { DrinkVisual } from "@/components/lineup/DrinkVisual";
import { Reveal } from "@/components/motion/Reveal";
import { useCopy } from "@/hooks/use-copy";
import { fill } from "@/lib/copy";
import type { LineupDrink, LineupGenre } from "@/lib/db/queries";
import { genreBlockFor, genreTerms } from "@/lib/genres";
import { routes } from "@/lib/routes";

// Offset collage: photos of different shapes, staggered up and down on
// wide screens. Labels sit under each photo, so long Plain-mode names
// wrap freely instead of fighting the picture for space.
const tileLayout: Record<string, { cell: string; photo: string }> = {
  "old-school": { cell: "lg:col-span-4", photo: "aspect-[4/5]" },
  "new-school": { cell: "lg:col-span-5 lg:mt-28", photo: "aspect-[4/5]" },
  mashup: { cell: "lg:col-span-3", photo: "aspect-[3/4]" },
  "off-beat": { cell: "lg:col-span-5 lg:col-start-2", photo: "aspect-[4/3]" },
  intermission: {
    cell: "lg:col-span-4 lg:col-start-8 lg:-mt-24",
    photo: "aspect-[4/3]",
  },
};

type GenreTilesProps = { genres: LineupGenre[]; drinks: LineupDrink[] };

export function GenreTiles({ genres, drinks }: GenreTilesProps) {
  const { t, plain, isPlain } = useCopy();

  return (
    <section aria-labelledby="genres" className="mx-auto w-full max-w-6xl px-4">
      <SectionHeading
        id="genres"
        title={t.home.genresTitle}
        plainTitle={plain.home.genresTitle}
      />
      <ul className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-6 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-16">
        {genres.map((genre, index) => {
          const term = genreTerms[genre.slug];
          const inGenre = drinks.filter((d) => d.genreSlug === genre.slug);
          const cover = inGenre.find((d) => d.imageSrc) ?? inGenre[0];
          const layout = tileLayout[genre.slug] ?? {
            cell: "lg:col-span-4",
            photo: "aspect-[4/5]",
          };
          return (
            <Reveal
              as="li"
              key={genre.slug}
              delay={(index % 3) * 0.08}
              className={`${layout.cell} ${index === 0 ? "col-span-2 sm:col-span-1" : ""}`}
            >
              <Link
                href={`${routes.lineup.href}?genre=${genre.slug}`}
                aria-label={term ? plain.terms[term] : genre.name}
                className="group block outline-none focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
              >
                <div
                  className={`relative overflow-hidden ${layout.photo} ${genreBlockFor(genre.slug)}`}
                >
                  {cover && (
                    <div className="absolute inset-0 transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110">
                      <DrinkVisual
                        drink={cover}
                        sizes="(min-width: 1024px) 480px, 50vw"
                      />
                    </div>
                  )}
                  {/* A colour wipe rises over the photo on hover. */}
                  <span
                    aria-hidden
                    className={`absolute inset-x-0 bottom-0 h-0 opacity-70 mix-blend-multiply transition-[height] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:h-full ${genreBlockFor(genre.slug)}`}
                  />
                  <span
                    aria-hidden
                    className="absolute top-3 right-3 flex size-10 items-center justify-center rounded-full bg-background text-foreground transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  >
                    <ArrowUpRight className="size-5" />
                  </span>
                </div>
                <div className="mt-4 flex items-center gap-2 border-t border-foreground pt-3">
                  <span
                    aria-hidden
                    className={`size-2.5 shrink-0 ${genreBlockFor(genre.slug)}`}
                  />
                  <span className="eyebrow text-muted-foreground">
                    {inGenre.length === 1
                      ? t.home.drinkOne
                      : fill(t.home.drinks, { count: inGenre.length })}
                  </span>
                </div>
                <p className="mt-2 font-heading text-3xl leading-[0.9] font-black break-words uppercase [font-stretch:64%] sm:text-4xl lg:text-5xl">
                  {term ? t.terms[term] : genre.name}
                </p>
                {!isPlain && term && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {plain.terms[term]}
                  </p>
                )}
              </Link>
            </Reveal>
          );
        })}
      </ul>
    </section>
  );
}
