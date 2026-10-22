# Groove Grounds — design system

The look: **an editorial club-night poster.** Condensed poster caps, warm cream and espresso grounds, real photos of drinks and dancers, square full-bleed sections with hairline dividers, one loud purple accent. It should read like a printed flyer for a dance night, not like a template.

Everything below is a rule, not a suggestion. If something is missing, add it here first, then build it. This file describes what is built today; when the look changes on purpose, update this file in the same change.

---

## 1. Color tokens

Defined once in `app/globals.css` (`@theme`). Never write hex anywhere else.

| Token | Hex | Use |
| --- | --- | --- |
| `espresso` | #3B2A20 | Primary text on light; dark fills (selected chips, buttons on lilac) |
| `espresso-deep` | #2B1E17 | Dark section backgrounds (hero, page headers, Freestyle, footer) |
| `espresso-soft` | #4D3A2D | Raised surfaces on dark |
| `roast` | #6E5747 | Secondary text on light (`muted-foreground`) |
| `khaki` | #C3B091 | Hairlines and borders (mixed), secondary text on dark |
| `cream` | #F5EFE3 | Light page background; primary text on dark |
| `cream-soft` | #FBF8F1 | Cards and popovers on cream |
| `purple` | #7B4FC9 | THE accent: primary buttons, active states, progress, prices |
| `lilac` | #C9B6F0 | Accent on dark (text, fills); the closing band; badges |

Temperature colours (icon tiles only, never text or large fills): `temp-hot` #D2581F (Warm-up / hot), `temp-iced` #3B82C4 (Cool-down / iced), `temp-blended` #C2477F (Mashup / blended). Use them through `lib/temps.ts`: the icon at full colour on a `/15` tint of the same colour.

Genre colours (photo backdrops and small genre swatches only): `genre-old`, `genre-new`, `genre-mashup`, `genre-offbeat`, `genre-intermission`. Drink colours for the cup illustration: `brew-*`, `milk`, `whip`, `caramel`, `ice`.

Components use the **semantic tokens**, not the raw palette, so they work on light and dark: `background`, `foreground`, `card`, `muted`, `muted-foreground`, `border`, `primary`, `highlight` (accent text that passes AA: purple on light, lilac on dark), `ring`, `destructive`.

**Dark sections:** add the `theme-dark` class to a section. It re-points the semantic tokens (background espresso-deep, foreground cream, highlight lilac, translucent card/muted), so every component inside turns dark without its own dark styles. The device dark mode (`prefers-color-scheme`) uses the same mapping site-wide.

**Allowed text/background pairs (WCAG AA). Use no others.**

| Text | On |
| --- | --- |
| `foreground`, `muted-foreground`, `highlight` | `background`, `card`, `muted` (both themes) |
| `cream`, `khaki`, `lilac` | `espresso`, `espresso-deep` |
| `espresso`, `roast`, `purple` | `cream`, `cream-soft` |
| `espresso` | `lilac`, `khaki`, genre colours |
| `cream-soft` | `purple` |

Never: `purple` text on espresso (use `lilac`), `lilac` or `khaki` text on cream.

Accent discipline: one primary (purple) action per view. Purple is for actions, selection and prices, not decoration.

## 2. Page structure

- **Header** (sticky, full-width glass bar on a hairline) → page content → **Footer** (dark). The demo banner sits above the header on every page.
- Most pages open with a **`PageHero`**: a dark full-bleed band with a background photo (parallax), the page title in poster caps, the plain meaning under it, optional body and actions. Content below it sits on cream.
- **Home:** full-bleed photo hero (dancers rehearsing in a dark studio) ending on a clean edge → genre collage → Popular drinks row → How it works (full-bleed photo with a lilac steps strip) → The Cypher → lilac closing band → footer.
- **Freestyle** is a full dark "stage" page (`theme-dark` form). **Auth** is a split: photo panel left, form right.
- Sections are full-bleed and square. Never wrap a section in a rounded, inset card.

## 3. Typography

Loaded with `next/font/google` in `app/layout.tsx`:

- **Anybody** (variable width + italic) → `font-heading`. Display only.
- **Geist** → `font-sans` (default, body and UI).
- **Geist Mono** → `font-mono`. Only for code-like values (route paths). Not for labels.

| Role | Recipe |
| --- | --- |
| Hero headline | `KineticTitle`, `text-[clamp(4.25rem,9vw,8.5rem)]`; h1 base = weight 900, `font-stretch: 64%`, uppercase, `leading-[0.88]` |
| Page title (PageHero) | `KineticTitle`, `text-[clamp(3.25rem,11vw,7.5rem)]` (`lg` size: `clamp(3.75rem,13vw,10rem)`) |
| Section title | `SectionHeading`: `text-[clamp(3rem,8vw,6.5rem)] font-black uppercase [font-stretch:64%] leading-[0.88]` |
| Sub-section (h2 base) | Anybody 800, `font-stretch: 108%`, mixed case, `tracking: -0.035em` (e.g. "Remix", option group names at `text-2xl`) |
| Card / drink name | `font-heading text-2xl sm:text-3xl font-black uppercase [font-stretch:64%] leading-[0.95]` |
| Price | `font-heading font-black [font-stretch:70%]`; `₱` via `formatPeso`, no decimals |
| Body | `font-sans`, 16px, `text-muted-foreground` for secondary, max ~60ch |
| Label (`eyebrow` utility) | Geist 13px semibold, sentence case. Tags, counts, captions |
| Control label (`label-display` utility) | Anybody 700, `font-stretch: 96%`: filter chips, search text, dropdown items. Plain sub-labels under them stay in Geist |

Emphasis: the italic accent (`accentLast`, last word italic in `highlight`) is used **only** on the home hero ("Coffee with a *beat.*"). Section titles are plain caps.

## 4. Spacing, radius, layout

- **Container:** `mx-auto w-full max-w-6xl px-4` for header, page content and footer alike, so every left edge lines up. Full-bleed sections put their content in the same container. Elements pinned to the screen edge align with it via `calc((100vw-72rem)/2+1rem)`.
- Wide pages use the width: Profile, Playlist and the tracker are two columns on `lg` (summary/sidebar sticky at `top-24`).
- Section rhythm on home: `gap-28 sm:gap-40` between sections, `py-24 sm:py-32` for standalone sections.
- **Shape rule:** sections, photos and cards are **square**. Buttons, inputs and tags use a small corner (`rounded-md` / `rounded-sm`, `--radius: 0.3rem`). Only icon-only buttons and status dots are round (`rounded-full`).
- Cards: flat, hairline edge (`surface` utility = `card` background + 1px `border` ring). No drop shadows on cards; a soft shadow is allowed only on floating elements (Spotlight card, toasts).
- No horizontal page scroll at any width. Rows of chips or cards scroll inside their own box with `scroll-edges` (fades only on the side that has more).
- Sticky bars fade the content they cover: `fade-below` under sticky top bars, `fade-above` over sticky bottom bars.

## 5. Components (reuse these; don't restyle per page)

| Component | Where | Spec |
| --- | --- | --- |
| `PageHero` | layout | Dark full-bleed header: optional photo (`/public/scenes`), title, plain title, body, children (actions). Sizes `md` / `lg`. |
| `SectionHeading` | layout | Centred (or `align="start"`) poster-caps title that types in on scroll, plain meaning under it, optional body and children. No numbers. |
| `KineticTitle` | motion | Letters rise in per word mask (`trigger="mount"` or `"view"`); keyed by text so Plain/Dance switches replay; letters hop and tilt on hover without changing layout. |
| `Reveal` | motion | Fade + 24px rise when scrolled into view, once. `as="div" \| "section" \| "li"`, `delay` for small staggers. |
| `SpinBadge` | motion | Lilac round sticker with text on a circle; rotates with scroll only (never on its own). Home hero only. |
| `DrinkCard` | lineup | Editorial card: 4:5 photo on its genre colour, dance-style tag, hairline, temps + price, name in poster caps, plain description. A drink is always a `DrinkCard` (Lineup grid and Popular drinks row). |
| `DrinkVisual` | lineup | The drink's photo (`public/drinks/<slug>.jpg`), falling back to the `CupPreview` / `SnackArt` illustration. |
| `IconTile` | layout | A solid Groove glyph on a small `rounded-md` square tinted in its own colour, like a brand logo chip. Tones: `accent` (purple glyph on a purple tint), `neutral` (muted), `inherit` (tint from the surrounding text colour, inside buttons), `custom` (e.g. a temperature). Sizes `sm` / `md` / `lg` (lg for empty and status states). |
| `TempBadge` | lineup | Temperature on drink cards: the temperature glyph (mug, iced glass, frappe) in its colour on a tint of that colour, plus the dance label. The Lineup filter and the Remix temperature chips use the same `lib/temps.ts` styles. |
| `StyleTag` | lineup | Tag over drink photos: frosted cream chip with a hairline, a swatch in the genre colour, then the dance style or genre. Card (`sm`) and drink page (`md`). |
| `GenreFilter` / `TempToggle` | lineup | Lineup filters in the logo-chip style: hairline chips with a genre swatch tile, label and count (selected fills `foreground`, sliding); Search is a 48px framed field holding, at 36px with equal 6px padding: the icon tile, the input, the live result count (md+), clear, and the temperature dropdown (Any / Warm-up / Cool-down with their tiles and plain meanings). |
| `OptionGroup` | remix | Remix and Freestyle options. Chips fill with `foreground` when selected; one fill glides between single choices (`layoutId`), multi choices each pop in with a check. |
| `Button` | ui | shadcn base re-themed: `rounded-md`, purple primary, ghost/outline variants; icon sizes round. Money/time buttons show the dance word and the plain word. |
| `PlainModeToggle` | layout | Two-segment "Dance terms / Plain words" switch in the header. |
| `Toaster` | layout | Sonner toasts (bottom centre, espresso, lilac action). Used for added to Playlist, saved, Run it back. |
| `CountIn` | layout | Loader: "5, 6, 7, 8…". Errors: "You missed a count". Empty Playlist: "The floor's empty". |
| `Header` / `MainNav` | layout | Logo, nav (Center Stage, The Lineup, Freestyle, Crew Order) with a thin underline that slides on hover, Plain toggle, account icon, Playlist icon. Account: a round icon in the bar on wide screens; on smaller screens it lives only in the menu (signed-in name, or Join the Crew + Sign in). |
| `Footer` | layout | Plain words always; hours; giant fading wordmark with a drink photo blended in front. |
| `BackstageNav` / `BackstageHeader` | backstage | Section tabs under the header on every Backstage page (underline on the active tab, scrolls on phones); title block with the Backstage label and poster-caps page title. |
| `StaffGate` | backstage | Shown when a visitor may not use a Backstage page: sign in (signed out), not on the crew list, or owner only; always offers the Demo Backstage queue. |
| `Switch` | backstage | Labelled on/off switch, 44px tap target, purple track when on. Spotlight and Sitting out in the menu manager. |
| `MenuManager` | backstage | Owner-only editor: items by genre with Spotlight / On the floor switches and an inline `DrinkForm`; Remix options with add-on prices and availability. |
| `ScheduleForm` | backstage | Owner-only class schedule: hours (time fields), slot length (chips), max drinks per slot, booking window, minimum notice, blackout dates as removable chips, and a live "N classes a day" preview. |
| `LevelProgress` | reps | Level name, a purple bar through the current step, and Reps to the next level. Dancer Profile and the Reps page. |
| `RepsView` | reps | Reps page body: sticky balance card with recent Reps (or a join prompt), how you earn, the level ladder (current level on lilac) and rewards (affordable ones ringed). Rules live in `lib/reps.ts`. |
| `CrewForm` / `CrewRequestView` | crew | Crew Order request form (lead-time notice on lilac, three fieldsets with heading-style legends) and the request page: status steps, quote with Accept / Decline, sticky summary. |
| `CrewInbox` | backstage | Owner inbox grouped by status; new requests take a quote (amount + note) or a two-tap decline. |

Inputs use the `field` utility (filled `muted`, small corner, purple focus ring). Focus ring for everything: `focus-visible:ring-3 ring-ring`.

### Icons

- **Groove icon set** (`components/icons/GrooveIcons.tsx`): our own SVG glyphs drawn like small logos. Solid shapes filled with `currentColor`, details cut out with even-odd (cart slats, cup sleeve, ice cubes), 24×24 grid. Not outlines, not sketches.
- Motifs carry the theme: Playlist = shopping cart (kept literal so it reads as the cart), Center Stage = spotlight on a stage, The Lineup = takeaway cup, Freestyle = dance line with a spark, Crew = two dancers, Dance terms = sneaker, Plain words = cup on a saucer, Book a Class = calendar with a clock, empty Playlist = vinyl record. Genres (`lib/genres.ts` genreIcon): Old School = espresso shot glass, New School = latte with heart art, Mashup = frappe, Off-Beat = leaf, Intermission = cookie, All = takeaway cup; shown in espresso on the genre colour.
- Every icon that stands for a thing or a place uses the Groove set, through `IconTile` or directly. Add new ones to that file in the same style; don't mix in a stock icon for these.
- Real brand marks only where a real service is named (the GCash payment option, `public/brands/`), at their own colours, credited in `docs/PHOTO_CREDITS.md`. Never restyle or redraw a brand mark.
- Small utility marks (arrows, chevrons, check, plus/minus, close inside dialogs, search, edit, delete) use `lucide-react`, stroke 2.
- Beside a label, a glyph sits on an `IconTile` (logo-chip style). Inside round header buttons and the Plain toggle the glyph is bare. Header icon buttons (account, Playlist, menu) are round, `bg-muted`, and fill with `foreground` on hover; the Playlist count badge sits on the corner with a ring in the page colour.
- Temperature is always colour-coded (warm orange, cool blue, blended pink): glyph in the colour on a tint of it.
- No emoji.

## 6. Imagery

- **Real photos only** for drinks and scenes: `public/drinks/*.jpg` (one per menu item and Freestyle base), `public/scenes/*.webp` (dance and café backgrounds). All from Pexels; every file is credited in `docs/PHOTO_CREDITS.md`. Add the credit when you add a photo.
- Photos sit square, `object-cover`, and zoom gently on hover (`scale-110`, 700–1000ms).
- Dark photo sections fade into the page with masks/gradients rather than ending on a hard edge.
- The illustrated cup (`CupPreview`) is for the Freestyle live preview and as a fallback when a photo is missing.
- Decorative images and SVGs get `alt=""` / `aria-hidden`.

## 7. Motion

- Library: Motion (`motion/react`). `MotionConfig reducedMotion="user"` in `Providers`; CSS animations are cut by the global reduced-motion rule.
- Page entrance: `app/(shop)/template.tsx` fades each page up 14px.
- Section entrance: `KineticTitle` (`trigger="view"`) and `Reveal`. Once only.
- Photos: scroll-linked parallax on hero/feature photos; the Cypher photo strip drifts sideways with scroll. Scroll-linked only — nothing loops on its own.
- Micro: option fill glides (`layoutId`), cart badge bumps on change, Freestyle steps slide in by direction, prices roll when they change, toasts confirm actions.
- Ease: `[0.16, 1, 0.3, 1]` for entrances; springs for layout.

## 8. Copy & labels in the UI

- Every label comes from `lib/copy.ts` (`dance` + `plain`, same keys) through `useCopy()`.
- Pattern: dance term as the main label, plain meaning under it (sub-label, or the line under a title). Plain Mode swaps the main label and hides the sub-label.
- Buttons that commit money or time (Showtime, Book a Class, Drop-in, Demo pay) always show both words.
- Display text is uppercased by CSS, never typed in caps in `copy.ts`.
- Layouts must survive both modes: plain labels are often longer, so titles and tile labels wrap instead of sitting over photos.

## 9. Don'ts (things that make it look generic or AI-made)

- No pulsing/"live" dots, no spaced-out monospace uppercase labels, no "01 —" section numbers.
- No glow blobs, blurred colour orbs, film grain, glassmorphism on content cards, or gradient text (the footer wordmark fade is the one exception).
- No italic coloured accent word on section titles (hero only).
- No marquees or tickers, no tilted sticker tags, no arrows that spin 45° on hover.
- No rounded inset section panels; no drop shadows on cards.
- No new colours, fonts or hex values outside `globals.css`. No emoji. Icons: the Groove set for things and places, `lucide-react` only for utility marks.
- No default shadcn look left un-themed (grey borders, slate text, blue rings).
- Don't create a second card style for the same thing on another page.

## 10. Visual reference

The current site is the reference. Screenshots and links pasted into a prompt guide structure (the TARAQ coffee shot was the reference for the editorial layout); keep these tokens, fonts and components when matching them, and say when an image uses something outside the system.
