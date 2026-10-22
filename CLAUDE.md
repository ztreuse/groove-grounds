# Groove Grounds — instructions for Claude

Dance-themed coffee ordering site. Concept / portfolio demo: one shop, pickup only, no real payments.
Every drink is a dance style and every UI label uses dance-community language, with a Plain Mode switch for standard words.

Source of truth, in this order:
1. **@docs/DESIGN.md** — how every screen looks (tokens, type, components, layouts, don'ts). Follow it exactly.
2. **@docs/PROJECT.md** — what the site does (pages, flows, glossary, menu, data model).
3. This file — how to work.

If a request conflicts with these files, say so and ask before building. Never silently invent a new color, font, term, spacing value or component style. When the user approves a deliberate change to the look, update DESIGN.md in the same change.

---

## Stack (do not swap or add libraries without asking)

- Next.js 16 App Router + TypeScript (strict), React Server Components by default, `"use client"` only where needed. `cacheComponents` is on: request-time data goes inside `<Suspense>`; no `Date.now()` / `new Date()` during prerender
- Tailwind CSS v4 (tokens in `app/globals.css`), shadcn/ui primitives, the Groove icon set (`components/icons`) plus `lucide-react` for utility marks, Motion (`motion/react`), Sonner toasts
- Supabase (Postgres, Auth, Realtime, Storage) with Drizzle ORM
- Zustand: `stores/playlist.ts` (cart) and `stores/preferences.ts` (Plain Mode), persisted to localStorage
- React Hook Form + Zod for every form
- npm

## Project map (put things where they belong)

```
app/(shop)/…          customer pages (template.tsx = page entrance)
app/(auth)/…          join, login
app/backstage/…       admin pages
components/layout/    Header, MainNav, Footer, DemoBanner, PageHero, SectionHeading, PlainModeToggle, Toaster, CountIn …
components/motion/    KineticTitle, Reveal, SpinBadge
components/lineup/    DrinkCard, DrinkVisual, DrinkHero, GenreFilter, LineupBrowser …
components/remix/     RemixPanel, OptionGroup, CupPreview, QuantityStepper
components/<feature>/ home, freestyle, playlist, showtime, tracker, profile, auth, dictionary, backstage
components/ui/        shadcn primitives (re-themed; prefer the components above in pages)
hooks/                useCopy, useScrollEdges, useUser …
lib/copy.ts           every label: `dance` + `plain` dictionaries, same keys
lib/pricing.ts        price math (shared by client preview and server)
lib/db/               Drizzle schema, queries, seed
public/drinks, public/scenes   photos (credited in docs/PHOTO_CREDITS.md)
stores/               Zustand stores
```

## Hard rules

**UI consistency**
- Reuse the components listed in DESIGN.md §5 (PageHero, SectionHeading, KineticTitle, Reveal, DrinkCard, OptionGroup, Button …). If a page needs something new, build it as a reusable component and add it to DESIGN.md.
- Colors only through theme tokens (`bg-background`, `text-highlight`, `bg-espresso-deep`, `theme-dark` …). No hex outside `app/globals.css`.
- Arbitrary values only for the recipes written in DESIGN.md (display sizes, container alignment). Don't invent new ones.
- Fonts come only from `app/layout.tsx`: Anybody (`font-heading`), Geist (`font-sans`), Geist Mono (`font-mono`, code-like values only).
- Shape rule: square sections, photos and cards; small corners on buttons, inputs and tags; round only for icon buttons and dots.
- Same container everywhere: `max-w-6xl px-4`.
- Check DESIGN.md §9 (Don'ts) before shipping any UI.

**Copy**
- Every label comes from `lib/copy.ts` through `useCopy()`. Never hardcode UI text in a component.
- Use only the glossary terms in PROJECT.md. Drink names stay as dance styles in both modes; the plain description shows under them.
- `aria-label` uses the plain word.
- Placeholders for unknown facts look like `[YOUR HOURS]`. No lorem ipsum, no invented stats or reviews.

**Product**
- No real payments: checkout uses the simulated Demo pay. Never add a payment provider or real card fields.
- Pickup only, one location. No delivery.
- Prices are recalculated on the server at checkout with `lib/pricing.ts`; the browser total is a preview.
- Order statuses are exactly: `warm_up → on_deck → full_out → stage_ready → bow` (or `cut`).

**Quality**
- Mobile-first: build at 375 px, then enhance at `md` (768) and `lg` (1024).
- WCAG AA contrast (pairs in DESIGN.md only), tap targets ≥ 44 px, visible focus ring, real `<button>` / `<a>` / `<label>`, respect `prefers-reduced-motion`.
- Secrets live in `.env.local` (never committed); keep `.env.example` updated.

## How to work on every task

1. Read the relevant sections of DESIGN.md and PROJECT.md before writing code. For UI work, look at the existing components first.
2. For anything bigger than a small fix, give a short plan first: files you will touch, components you will reuse or add.
3. Build. Reuse before you create. Keep changes scoped to the task; don't restyle unrelated pages.
4. Run `npm run lint`, `npx tsc --noEmit` and `npm run build`; fix all errors.
5. Check the page in a real browser at 375 px and 1280 px, in both Dance and Plain mode.
6. Check the **Definition of done**, then reply with: what changed, files touched, and anything left open.

## Definition of done (check before saying a task is finished)

- [ ] Uses the shared components and theme tokens; no hex, no new fonts, no off-recipe arbitrary values
- [ ] Every label is in `lib/copy.ts` with both `dance` and `plain` versions, and Plain Mode switches it without breaking the layout
- [ ] Header, footer and demo banner present; sections follow the square, full-bleed layout and the shared container
- [ ] Looks right at 375 px and 1280 px: nothing overflows, nothing is cut off, no horizontal scroll
- [ ] Buttons and links ≥ 44 px, keyboard focus visible, contrast pairs from DESIGN.md only
- [ ] Loading ("5, 6, 7, 8…"), empty and error ("You missed a count") states exist where data loads
- [ ] Nothing from DESIGN.md §9 (Don'ts)
- [ ] Lint, type-check and build pass

## When the user pastes a screenshot or mockup

Match its layout and hierarchy, but keep DESIGN.md's tokens, fonts and components. If the image uses a color or style outside the system, use the nearest token and say so.
