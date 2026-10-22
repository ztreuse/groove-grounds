import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DrinkHero } from "@/components/lineup/DrinkHero";
import { DrinkPropsSection } from "@/components/lineup/DrinkPropsSection";
import { EditableRemixPanel } from "@/components/remix/EditableRemixPanel";
import { getDrinkProps } from "@/lib/db/props";
import { getDrinkBySlug, getDrinkSlugs } from "@/lib/db/queries";

// Every drink is prerendered; drinks added later render on first visit.
export async function generateStaticParams() {
  const slugs = await getDrinkSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/lineup/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const drink = await getDrinkBySlug(slug);
  return drink
    ? { title: drink.name, description: drink.plainDescription }
    : {};
}

export default async function DrinkPage({
  params,
}: PageProps<"/lineup/[slug]">) {
  const { slug } = await params;
  const drink = await getDrinkBySlug(slug);
  if (!drink) notFound();
  const props = await getDrinkProps(drink.id);

  return (
    <main className="flex flex-1 flex-col">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 pt-4 pb-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-12 lg:pt-8">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <DrinkHero drink={drink} />
        </div>
        <EditableRemixPanel drink={drink} />
      </div>
      <DrinkPropsSection props={props} />
    </main>
  );
}
