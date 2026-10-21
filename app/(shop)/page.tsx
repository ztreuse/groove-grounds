import Link from "next/link";
import { dance, plain, type PageKey } from "@/lib/copy";
import { routes } from "@/lib/routes";

// Placeholder Center Stage: a map of every route until Step 8 builds the
// real home page.
const pageKeys = (Object.keys(routes) as PageKey[]).filter(
  (key) => key !== "home",
);

function RouteGrid({ area }: { area: "shop" | "backstage" }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {pageKeys
        .filter((key) => routes[key].area === area)
        .map((key) => {
          const { href, phase } = routes[key];
          return (
            <li key={key}>
              <Link
                href={href}
                aria-label={plain.pages[key]}
                className="flex min-h-16 items-center justify-between gap-3 rounded-xl border-2 bg-card px-4 py-3 transition-colors outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-3 focus-visible:ring-ring"
              >
                <span>
                  <span className="block font-heading text-xl tracking-wide uppercase">
                    {dance.pages[key]}
                  </span>
                  <span className="block text-sm text-muted-foreground">
                    {plain.pages[key]}
                  </span>
                </span>
                {phase && (
                  <span className="shrink-0 rounded-md bg-secondary px-2 py-0.5 text-xs font-semibold text-secondary-foreground">
                    {dance.placeholder.phase} {phase}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
    </ul>
  );
}

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-12 sm:py-20">
      <header className="mb-12">
        <p className="text-sm font-semibold tracking-widest text-highlight uppercase">
          {dance.pages.home} · {plain.pages.home}
        </p>
        <h1 className="mt-2 text-6xl leading-[0.9] sm:text-8xl">
          {dance.brand}
        </h1>
        <p className="mt-4 max-w-md text-lg text-muted-foreground">
          {dance.tagline}
        </p>
      </header>

      <section className="mb-10">
        <h2 className="mb-4 text-2xl">{dance.placeholder.customerPages}</h2>
        <RouteGrid area="shop" />
      </section>

      <section>
        <h2 className="mb-4 text-2xl">{dance.placeholder.backstagePages}</h2>
        <RouteGrid area="backstage" />
      </section>
    </main>
  );
}
