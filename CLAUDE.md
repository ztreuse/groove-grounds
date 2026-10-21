# Groove Grounds

Dance-themed coffee ordering site (concept / portfolio demo). The full spec is in @docs/PROJECT.md — read it before starting any task.

## Stack

- Next.js App Router + TypeScript, Tailwind CSS, shadcn/ui, Motion
- Supabase (Postgres, Auth, Realtime, Storage) with Drizzle ORM
- Zustand for the Playlist (cart) and Plain Mode setting
- React Hook Form + Zod for forms
- Package manager: npm

## Rules

- Every UI label comes from `lib/copy.ts` (`dance` and `plain` dictionaries with the same keys) through the `useCopy()` hook. Never hardcode a label in a component.
- Use the exact dance terms from the glossary in docs/PROJECT.md. Do not invent new ones without asking.
- Drink names stay as dance styles in both Dance and Plain mode; show the plain description under them.
- No real payments. Checkout uses the simulated "Demo pay" flow. Never add a payment provider or accept real card numbers.
- Pickup only, one location. No delivery features.
- Recalculate prices on the server at checkout; the browser total is only a preview.
- Mobile-first. Check every page at 375 px wide.
- Colors: espresso #3B2A20, khaki #C3B091, cream #F5EFE3, purple #7B4FC9 (accent), lilac #C9B6F0. Define them as Tailwind theme tokens, not inline hex.
- Accessibility: WCAG AA contrast, `aria-label` uses the plain word, tap targets ≥ 44 px, respect reduced motion.

## Workflow

- Build in the order of the phases in docs/PROJECT.md. Finish and test one page before starting the next.
- After each task: run `npm run lint` and `npm run build`, fix errors, then summarize what changed.
- Keep secrets in `.env.local` and never commit it. Provide `.env.example` with placeholder values.
