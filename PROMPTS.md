# Groove Grounds — prompts for Claude Code in VS Code

Paste these one at a time into the Claude Code panel. Wait for each step to finish, run the site (`npm run dev`), check it, and commit before sending the next one.

Tip: start each big step in **Plan** mode (click the mode indicator under the prompt box, or type `/plan`). Claude shows its plan first; approve it, then it builds.

---

## Step 1 — Project setup

```
Read @docs/PROJECT.md and @CLAUDE.md. Set up a new Next.js App Router project in this folder with TypeScript, Tailwind CSS, shadcn/ui, Motion, Zustand, React Hook Form and Zod, ESLint and Prettier. Add the brand colors as Tailwind theme tokens with a light theme (cream background) and a dark theme (espresso background). Create the folder structure from the spec with empty placeholder pages for every route. Don't connect a database yet.
```

## Step 2 — Copy system and Plain Mode

```
Build lib/copy.ts with the `dance` and `plain` dictionaries for every term in the glossary in @docs/PROJECT.md, a useCopy() hook, and a Zustand preferences store that remembers Plain Mode in localStorage. Then build the shared layout: Header (logo, nav, Plain Mode toggle, Playlist icon with item count), Footer in plain words, and the demo banner. Every label must come from useCopy().
```

## Step 3 — Database

```
Create a Supabase project setup with Drizzle ORM using the Data model section of @docs/PROJECT.md. Write the schema, a migration, and a seed script that loads all 5 genres, all 18 drinks, the Intermission snacks, and every Remix option with its price add-on. Add .env.example with placeholder Supabase keys and tell me exactly which values I need to copy from my Supabase dashboard.
```

## Step 4 — The Lineup (menu)

```
Build /lineup: genre filter chips, search, hot/iced toggle, and drink cards styled like class flyers (dance style tag, plain description, price, "Sitting out" badge). Load drinks from the database. Make it look great at 375 px wide.
```

## Step 5 — Drink page + Remix panel

```
Build /lineup/[slug] with the Remix panel: every option group from the spec, dance labels with plain subtitles, live price, and Add to Playlist. Store the Playlist in Zustand. Put price calculation in lib/pricing.ts so the server can reuse it.
```

## Step 6 — Playlist and Showtime

```
Build /playlist (edit, remove, quantity, subtotal, empty state) and /showtime: Drop-in or Book a Class with a time-slot picker (15-minute slots, up to 7 days ahead, max 6 drinks per slot, full slots show "Class full"), name and phone, notes, and the simulated Demo pay (GCash / card / pay at pickup, ~2 second wait, no real payment). Create the order on the server, recalculating prices there.
```

## Step 7 — Live tracker and Backstage queue

```
Build /track/[orderId] showing the 5 statuses (Warm-up, On deck, Full out, Stage ready, Bow) with realtime updates from Supabase. Then build /backstage/queue as a kanban board where staff move orders forward, plus a Demo Backstage button so visitors can move their own demo order.
```

## Step 8 — Home page

```
Build the home page (Center Stage) from the spec: hero with Drop-in and Book a Class buttons, Spotlight banner, Trending Choreo carousel, "How it works in 3 counts", and The Cypher section. Add the beat-timed hover bounce and respect reduced motion.
```

## After Phase 1

Continue with Phase 2 and Phase 3 from @docs/PROJECT.md one feature per prompt, e.g.:

```
Build the Freestyle builder at /freestyle as described in @docs/PROJECT.md, including the live cup preview and Name your choreo.
```

## Handy prompts any time

- `Review the whole app against @docs/PROJECT.md and list anything missing or inconsistent with the glossary.`
- `Check every page at 375 px and fix layout issues.`
- `Run lint and build, then fix all errors.`
