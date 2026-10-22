import { BackstagePromo } from "@/components/home/BackstagePromo";
import { Cypher } from "@/components/home/Cypher";
import { GenreTiles } from "@/components/home/GenreTiles";
import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { TrendingCarousel } from "@/components/home/TrendingCarousel";
import { Ticker } from "@/components/motion/Ticker";
import { getLineup, getTrendingDrinkIds } from "@/lib/db/queries";

const TRENDING_COUNT = 8;

export default async function Home() {
  const [{ genres, drinks }, trendingIds] = await Promise.all([
    getLineup(),
    getTrendingDrinkIds(),
  ]);

  // Drinks only (no snacks), and nothing that's Sitting out.
  const onStage = drinks.filter(
    (drink) => drink.tempsAllowed.length > 0 && drink.isAvailable,
  );
  const spotlight = onStage.find((drink) => drink.isFeatured) ?? onStage[0];

  // Most ordered first, then featured, then menu order to fill the row.
  const byId = new Map(onStage.map((drink) => [drink.id, drink]));
  const ranked = [
    ...trendingIds.flatMap((id) => byId.get(id) ?? []),
    ...onStage.filter((drink) => drink.isFeatured),
    ...onStage,
  ];
  const trending = [...new Map(ranked.map((d) => [d.id, d])).values()]
    .filter((drink) => drink.id !== spotlight?.id)
    .slice(0, TRENDING_COUNT);

  return (
    <main className="flex flex-1 flex-col">
      <Hero spotlight={spotlight} />
      <Ticker
        items={onStage.map((drink) => drink.danceStyle)}
        className="py-6 font-heading text-5xl font-black uppercase [font-stretch:64%] sm:py-8 sm:text-7xl"
      />
      <div className="flex flex-col gap-24 pt-12 pb-24 sm:gap-32 sm:pt-16 sm:pb-32">
        <GenreTiles genres={genres} drinks={drinks} />
        <TrendingCarousel drinks={trending} />
      </div>
      <HowItWorks />
      <div className="py-24 sm:py-32">
        <Cypher />
      </div>
      <BackstagePromo />
    </main>
  );
}
