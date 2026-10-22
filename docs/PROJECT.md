# Groove Grounds — Project Spec

Groove Grounds is a dance-themed coffee ordering website (concept / portfolio project). Every drink is named after a dance style and every UI action uses dance-community language. Customers can order for pickup now (Drop-in), schedule a pickup (Book a Class), or build their own drink (Freestyle).

## Project decisions

- **Name:** Groove Grounds
- **Type:** concept / portfolio project with a fully working demo. No real money moves (see Demo mode).
- **Locations:** one shop only
- **Fulfilment:** pickup only, no delivery
- **Colors:** coffee brown, khaki, cream, with purple as the accent
- **Navigation:** dance terms by default, with a Plain Mode switch for anyone who wants standard words
- **Time slots:** 15-minute slots, bookable up to 7 days ahead, max 6 drinks per slot (configurable in Backstage)
- **Currency:** Philippine peso (₱); prices are placeholders

## Concept & tone

- **Who it's for:** dancers, dance students, studio crews, and anyone who likes the energy. Non-dancers must still be able to order without confusion.
- **The hook:** the menu reads like a class schedule, the cart is your Playlist, and checkout is Showtime.
- **Tone:** hype but readable. Short, confident copy with a wink to people who dance.
- **Golden rule for copy:** the dance term is the label; the plain meaning sits right under it or in a tooltip. Example: a button reads **Book a Class** with the subtitle _Schedule a pickup time_.

## Demo mode (no real payments)

The whole order flow works end to end, but payment is simulated.

- Checkout shows GCash, card and Pay-at-pickup options styled like the real thing. Tapping **Demo pay** waits about 2 seconds, then marks the order paid.
- A slim banner on every page: _Concept demo by [your name] — no real orders or payments._
- No payment provider. The card form is pre-filled with obvious fake data (4242 …) and read-only. Never accept real card numbers.
- A **Demo Backstage** button (or demo login) lets visitors open the staff queue and move their own order through the statuses, so the full loop can be shown in one sitting.
- Seed data: a few fake past orders and a demo dancer profile with Reps, so profile and history pages are not empty.
- Optional **Reset demo** link in the footer that clears the visitor's Playlist and demo orders.

## Dance terminology glossary

Every UI label uses the dance term, with the plain meaning as a subtitle or tooltip. All labels live in `lib/copy.ts` — never hardcode a label in a component.

| Site term                     | Plain meaning                       | Why it fits                                           | Where it shows             |
| ----------------------------- | ----------------------------------- | ----------------------------------------------------- | -------------------------- |
| Center Stage                  | Home                                | The main spot everyone faces                          | Nav, logo link             |
| The Lineup                    | Menu                                | The list of who's performing, here the list of drinks | Nav, menu page             |
| Genres                        | Menu categories                     | Styles grouped into families                          | Menu filters               |
| Old School / New School       | Classic espresso / signature drinks | Foundational styles vs. modern ones                   | Menu genres                |
| Mashup                        | Blended drinks and frappes          | A mashup blends songs together                        | Menu genre, Remix          |
| Off-Beat                      | Non-coffee drinks                   | Off the coffee beat                                   | Menu genre                 |
| Intermission                  | Pastries and snacks                 | What you grab at a show's intermission                | Menu genre                 |
| Drop-in                       | Order now, pick up ASAP             | A drop-in class: just show up, no booking             | Checkout, home             |
| Book a Class                  | Scheduled pickup                    | Reserve your spot at a set time                       | Checkout, home             |
| Crew Order                    | Group / event order                 | A crew is a group that moves together                 | Nav, crew page             |
| Freestyle                     | Build-your-own drink                | No set routine; you make it up                        | Nav, builder page          |
| Remix                         | Customize a drink                   | Same track, your own twist                            | Drink page button          |
| Choreo                        | Saved custom recipe                 | A set routine you repeat exactly                      | Profile, reorder           |
| Playlist                      | Cart                                | The tracks you've lined up before the set             | Header icon, cart page     |
| Showtime                      | Checkout                            | The moment you step on stage                          | Cart button, checkout page |
| 8 / 16 / 32-count             | Small / medium / large              | A longer count means more                             | Remix panel                |
| Warm-up / Cool-down           | Hot / iced                          | A warm-up heats you up; a cool-down cools you off     | Remix panel                |
| Marking / Half-out / Full out | Decaf / half-caf / regular caffeine | Low, half and full energy                             | Remix panel                |
| Double time / Triple time     | +1 / +2 espresso shots              | Twice or three times the energy                       | Remix panel                |
| Foundation                    | Milk base                           | Foundations are the base every style builds on        | Remix panel                |
| Flavor                        | Syrups and flavors                  | Dancers "add flavor" to a move                        | Remix panel                |
| Clean / Smooth / Full / Extra | Sweetness 25 / 50 / 100 / 125%      | Clean is minimal, Extra is over the top               | Remix panel                |
| Accents                       | Toppings                            | An accent is the highlight on top of the beat         | Remix panel                |
| Freeze                        | Ice level                           | A freeze is a frozen pose                             | Remix panel                |
| Notes to the choreographer    | Special instructions                | Telling the choreographer what you need               | Remix panel, checkout      |
| Choreographers                | Baristas                            | They create what you perform, here what you drink     | About, order tracker       |
| Dancer Profile                | Account page                        | Your profile as a dancer                              | Nav                        |
| Past Performances             | Order history                       | Every past order is a past show                       | Profile                    |
| Reps                          | Loyalty points                      | Earned by coming back again and again                 | Profile, rewards           |
| Levels                        | Loyalty tiers                       | Class levels, beginner to advanced                    | Rewards page               |
| Props                         | Ratings / reviews                   | Giving props means giving credit                      | Drink page, after pickup   |
| Spotlight                     | Featured drink / weekly promo       | The light on the featured performer                   | Home banner                |
| The Cypher                    | Community board / specials feed     | The circle where everyone gathers and shares          | Home section               |
| Backstage                     | Admin dashboard                     | Where the crew works out of sight                     | Admin only                 |
| Sitting out                   | Sold out / unavailable              | Not dancing this round                                | Drink cards                |
| Cut from the set              | Cancelled order                     | Removed from the lineup                               | Order tracker              |
| Dance Dictionary              | Glossary / help page                | Where every term is explained                         | Footer, "?" tooltips       |
| You missed a count            | 404 / error page                    | You fell off the beat                                 | Error states               |
| 5, 6, 7, 8…                   | Loading                             | The count-in before you start                         | Loading states             |

**Order status names (live tracker):**

1. **Warm-up** — order received
2. **On deck** — queued, you're next up
3. **Full out** — being made now
4. **Stage ready** — ready for pickup
5. **Bow** — picked up, order complete
   (Cancelled = **Cut from the set**)

**Loyalty levels (Reps):** Rookie → Cypher Regular → Battler → Judge → Legend.

## Easy navigation for non-dancers

The dance vocabulary stays, but nobody should get lost.

1. **Plain Mode toggle (main fix).** A switch in the header labelled **Dance terms / Plain words** (icon: a sneaker vs. a coffee cup). Plain Mode turns "The Lineup" into "Menu", "Playlist" into "Cart", "Showtime" into "Checkout", "Full out" into "Regular caffeine", and so on. The choice is remembered on the device. Drink names stay as dance styles in both modes because they are the brand; each card still shows its plain description ("vanilla latte").
2. **Dual labels everywhere.** In Dance mode every label carries a small plain subtitle (_Book a Class — schedule pickup_). Buttons that move money or time (Showtime, Book a Class, Demo pay) always show both words.
3. **Familiar structure.** The nav sits where people expect it, with standard icons (house, cup, cart, user). The footer always uses plain words (Home, Menu, About, Contact, FAQ). Only the flavor changes, not the layout.
4. **"?" tooltips + Dance Dictionary.** Any dance term can be tapped for a one-line meaning, and `/dictionary` lists the full glossary with a short note on each style.
5. **First-visit welcome.** A short 3-step overlay ("Learn the moves") on the first visit: here is the menu, here is your cart, switch to Plain words anytime. Skippable, shown once.

**How to build it:** keep two dictionaries in `lib/copy.ts` (`dance` and `plain`) with the same keys, read them through a `useCopy()` hook backed by a small Zustand store, and never hardcode a label in a component. Screen readers always get the plain word via `aria-label`.

## Menu (The Lineup)

18 signature drinks across five genres, each flavor chosen to match the feel of its dance style.

**Genres:**

- **Old School** — espresso classics, named after foundational street styles
- **New School** — signature lattes and specials
- **Mashup** — blended drinks and frappes
- **Off-Beat** — non-coffee: matcha, ube, refreshers
- **Intermission** — pastries and snacks

| Drink                      | Genre      | Why it fits the style             | What's in it                                                     | Hot / Iced | Base price (₱) |
| -------------------------- | ---------- | --------------------------------- | ---------------------------------------------------------------- | ---------- | -------------- |
| Popping Shot               | Old School | Sharp, quick hits                 | Double espresso                                                  | Hot        | 110            |
| Tutting Cortado            | Old School | Precise, geometric, clean lines   | Equal espresso and steamed milk, layered                         | Hot        | 130            |
| Locking Flat White         | Old School | Funky, punchy, locks in place     | Ristretto shots, velvety milk                                    | Hot / Iced | 150            |
| Breakin' Americano         | Old School | Raw, strong foundation            | Espresso and water, bold roast                                   | Hot / Iced | 120            |
| Hip-Hop Mocha              | Old School | The groove everything is built on | Espresso, chocolate, milk                                        | Hot / Iced | 160            |
| Waacking Caramel Macchiato | New School | Dramatic arms, glamorous drizzle  | Vanilla milk, espresso, caramel drizzle                          | Hot / Iced | 170            |
| House Vanilla Latte        | New School | Smooth, continuous flow           | Espresso, vanilla, milk                                          | Hot / Iced | 160            |
| Afro Spice Latte           | New School | Warm, grounded, rhythmic          | Espresso, ginger-cinnamon-nutmeg spice, brown sugar              | Hot / Iced | 170            |
| Dancehall Coco Cold Brew   | New School | Island vibes, laid-back bounce    | Cold brew, coconut cream, light rum-flavor syrup (non-alcoholic) | Iced       | 180            |
| Amapiano Shaken Espresso   | New School | Chill log-drum bounce             | Brown sugar shaken espresso, oat milk                            | Iced       | 170            |
| Krump Cold Brew            | New School | Raw intensity, maximum energy     | Extra-strong cold brew, extra shot                               | Iced       | 170            |
| Open Style                 | New School | No rules, changes every week      | Barista's rotating special                                       | Varies     | 180            |
| Vogue Rose Latte           | New School | Elegant, runway-ready             | Espresso, rose syrup, milk                                       | Hot / Iced | 180            |
| Jersey Club Frappe         | Mashup     | Fast, bouncy, playful             | Blended coffee, cookies, whipped cream, sprinkles                | Blended    | 190            |
| Heels Strawberry Cream     | Mashup     | Bold, confident, pink             | Blended strawberry and cream (coffee optional)                   | Blended    | 180            |
| K-Choreo Ube Latte         | Off-Beat   | Sharp, synced, crowd favorite     | Ube, milk (espresso optional)                                    | Hot / Iced | 170            |
| Lyrical Matcha             | Off-Beat   | Soft, flowing, emotional          | Matcha, milk, light honey                                        | Hot / Iced | 170            |
| Litefeet Lemonade          | Off-Beat   | Light, quick, refreshing          | Lemonade with mint, sparkling option                             | Iced       | 130            |

**Intermission snacks:** 8-Count Cookie, Toprock Croissant, Pirouette Cinnamon Roll, Battle Banana Bread.

### Remix options (customization)

Every drink opens a Remix panel. Options and price add-ons are stored in the database, not hardcoded.

| Option       | Dance label                  | Choices                                                      | Add-on (₱)      |
| ------------ | ---------------------------- | ------------------------------------------------------------ | --------------- |
| Size         | Counts                       | 8-count (12 oz), 16-count (16 oz), 32-count (22 oz)          | 0 / +20 / +40   |
| Temperature  | Warm-up / Cool-down / Mashup | Hot, iced, blended                                           | Mashup +20      |
| Caffeine     | Energy                       | Marking (decaf), Half-out (half-caf), Full out (regular)     | 0               |
| Extra shots  | Double time / Triple time    | +1 shot, +2 shots                                            | +30 per shot    |
| Milk         | Foundation                   | Whole, skim, oat, almond, soy                                | Plant milks +30 |
| Syrups       | Flavor                       | Vanilla, caramel, hazelnut, brown sugar, ube, rose           | +25 each        |
| Sweetness    | Sweet level                  | Clean (25%), Smooth (50%), Full (100%), Extra (125%)         | 0               |
| Toppings     | Accents                      | Whipped cream, caramel drizzle, sea-salt foam, cinnamon dust | +20 each        |
| Ice          | Freeze                       | Light freeze, regular, extra freeze                          | 0               |
| Instructions | Notes to the choreographer   | Free text, 140 characters max                                | 0               |

### Freestyle (build your own)

Freestyle starts from a base instead of a menu drink: espresso, cold brew, matcha, chocolate or tea. The customer walks through the same Remix steps, sees a live cup preview and running price, and can **Name your choreo** to save it to their profile.

## Sitemap & pages

14 customer pages and 6 admin pages, using the Next.js App Router.

### Customer pages

| Route              | Page name               | What's on it                                                                                                                                                                                                                    |
| ------------------ | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`                | Center Stage (Home)     | Hero with tagline and two big CTAs (Drop-in, Book a Class); Spotlight banner; Trending Choreo carousel (top drinks); "How it works in 3 counts" strip; The Cypher (specials and community posts); footer with hours and socials |
| `/lineup`          | The Lineup (Menu)       | Genre filter chips, search, hot/iced toggle; drink cards with style tag, price, "Sitting out" badge                                                                                                                             |
| `/lineup/[slug]`   | Drink page              | Photo, short blurb about the dance style, Remix panel, live price, Props (ratings), Add to Playlist                                                                                                                             |
| `/freestyle`       | Freestyle Cypher        | Step-by-step builder, live cup preview, running price, Name your choreo, Add to Playlist                                                                                                                                        |
| `/playlist`        | Playlist (Cart)         | Items with remix summary, edit / remove, quantity, subtotal, Showtime button; empty state "The floor's empty"                                                                                                                   |
| `/showtime`        | Showtime (Checkout)     | Order type (Drop-in or Book a Class + time slot picker), name and phone, notes, Demo pay, order summary                                                                                                                         |
| `/track/[orderId]` | Live tracker            | Status steps Warm-up → Bow, pickup time, order code, choreographer name, realtime updates                                                                                                                                       |
| `/crew`            | Crew Orders             | Group and event orders: headcount, date and time, drink mix, budget; request form; lead-time notice                                                                                                                             |
| `/profile`         | Dancer Profile          | Details, Saved Choreo, Past Performances with one-tap reorder ("Run it back"), Reps balance and Level                                                                                                                           |
| `/reps`            | Reps & Levels           | How points are earned, tiers and perks, redeemable rewards                                                                                                                                                                      |
| `/about`           | The Crew                | Story of the café, meet the choreographers, the dance inspiration                                                                                                                                                               |
| `/studio`          | Find the Studio         | Address, map, opening hours, contact                                                                                                                                                                                            |
| `/dictionary`      | Dance Dictionary        | Full glossary with plain meanings and a short note on each dance style                                                                                                                                                          |
| `/join`, `/login`  | Join the Crew / Sign in | Sign up and log in; guest checkout stays allowed                                                                                                                                                                                |

Every page shares a header (logo, main nav, Plain Mode switch, Playlist icon) and a footer in plain words (Home, Menu, About, Contact, FAQ) plus the demo banner.

### Admin pages (Backstage)

| Route                    | Page name           | What's on it                                                                     |
| ------------------------ | ------------------- | -------------------------------------------------------------------------------- |
| `/backstage`             | Dashboard           | Today's orders, revenue, top drinks, upcoming booked slots                       |
| `/backstage/queue`       | Order queue         | Kanban board by status; tap to move an order forward; sound alert for new orders |
| `/backstage/lineup`      | Menu manager        | Add / edit drinks, genres, Remix options and prices; toggle Sitting out          |
| `/backstage/schedule`    | Class schedule      | Opening hours, time-slot length, max drinks per slot, blackout dates             |
| `/backstage/crew-orders` | Crew Order requests | Review, quote, accept or decline group orders                                    |
| `/backstage/cypher`      | The Cypher          | Add, edit, hide or delete community board posts (Dance and Plain wording); the newest 3 live posts show on Center Stage. Spotlight is the Menu manager switch |

## User flows

Two ways into an order (pick from the Lineup, or Freestyle) and two ways to receive it (Drop-in or Book a Class); both end on the same live tracker.

```
The Lineup ──► Remix ──► Playlist ──► Showtime ──┬─ now ───────► Drop-in ─────┐
     │                      ▲                    └─ scheduled ─► Book a Class ┤
     └─ or Freestyle ───────┘                                                  ▼
                                                     Live tracker ◄── Demo pay
                                                          │
                     Warm-up → On deck → Full out → Stage ready → Bow
                     (Backstage moves each step; the customer sees it live)
```

### Drop-in (order now)

1. Home → tap **Drop-in** or go to The Lineup.
2. Pick a drink → Remix it → **Add to Playlist**.
3. Open Playlist → **Showtime**.
4. Choose Drop-in, enter name and phone (or log in), tap **Demo pay** (no real money).
5. Land on the tracker with an order code; get a "Stage ready" alert when done.

### Book a Class (scheduled pickup)

1. Same as above until Showtime.
2. Choose **Book a Class** → pick a date and a time slot (full slots show "Class full").
3. Demo pay → confirmation with slot time; the order enters the Backstage queue 15 minutes before the slot.

### Freestyle (custom drink)

1. Nav → **Freestyle** → pick a base.
2. Step through Counts, temp, Energy, Foundation, Flavor, Sweet level, Accents, Freeze with a live cup preview.
3. Optional: **Name your choreo** to save it (requires an account).
4. Add to Playlist → continue as a normal order.

### Reorder (logged-in)

Profile → Past Performances or Saved Choreo → **Run it back** (one tap adds it to the Playlist).

### Crew Order (group / event order)

1. Nav → **Crew Orders** → fill in date, headcount, drink mix, contact.
2. Backstage reviews and sends a quote.
3. Customer confirms → it becomes a scheduled order with its own pickup time.

## Admin / barista side (Backstage)

- **Roles:** Owner (everything), Choreographer / barista (queue only).
- **Live queue:** new orders appear instantly with a sound; staff move cards Warm-up → On deck → Full out → Stage ready → Bow. Each move updates the customer's tracker in real time.
- **Booked orders:** scheduled pickups surface in the queue 15 minutes before their slot (configurable) so drinks are fresh.
- **Slot capacity:** each time slot has a max drink count; when full, the slot greys out on checkout as "Class full".
- **Sitting out:** one toggle hides a drink or an option (e.g. oat milk) when stock runs out.
- **Crew Orders:** group requests land in an inbox; staff send a quote and confirm.
- **Basic reports:** daily orders, revenue, top drinks, busiest slots.

## Tech stack

| Layer              | Pick                                             | Why                                                               |
| ------------------ | ------------------------------------------------ | ----------------------------------------------------------------- |
| Framework          | Next.js (App Router, latest stable) + TypeScript | Server components, server actions, file-based routes              |
| Styling            | Tailwind CSS                                     | Fast to theme; easy to keep a bold design consistent              |
| UI components      | shadcn/ui                                        | Accessible buttons, dialogs, sheets, tabs you own and restyle     |
| Animation          | Motion (Framer Motion)                           | Beat-synced hovers, page transitions, cup-fill preview            |
| Database           | PostgreSQL on Supabase                           | Relational data fits menus, options and orders                    |
| ORM                | Drizzle ORM                                      | Type-safe queries and migrations                                  |
| Auth               | Supabase Auth                                    | Email, Google, magic link; guest checkout still possible          |
| Realtime           | Supabase Realtime                                | Live tracker and Backstage queue without a separate socket server |
| Images             | Supabase Storage + `next/image`                  | Drink photos, optimized automatically                             |
| Client state       | Zustand (persisted to localStorage)              | Playlist (cart) and the Plain Mode setting                        |
| Forms + validation | React Hook Form + Zod                            | Remix panel, checkout, crew order form                            |
| Payments           | None: simulated Demo pay screen                  | Concept project, so no real money moves                           |
| Email              | Resend + React Email (optional)                  | Order confirmations, crew order quotes                            |
| Hosting            | Vercel                                           | Built for Next.js; preview deploys per branch                     |
| Code quality       | ESLint, Prettier                                 | Consistent code from day one                                      |

**Folder structure (suggested):**

```
app/
  (shop)/            customer pages: page.tsx, lineup/, freestyle/, playlist/, showtime/, track/, crew/, profile/, reps/, about/, studio/, dictionary/
  (auth)/            join/, login/
  backstage/         admin pages, protected by role
components/
  ui/                shadcn components
  layout/            Header, Footer, DemoBanner, PlainModeToggle
  lineup/            DrinkCard, GenreFilter
  remix/             RemixPanel, OptionGroup, CupPreview
  playlist/          PlaylistItem, PlaylistSheet
  tracker/           StatusSteps
lib/
  copy.ts            all labels: `dance` and `plain` dictionaries with the same keys
  db/                Drizzle schema, queries, seed
  pricing.ts         price calculation (server-side)
stores/
  playlist.ts        Zustand cart store
  preferences.ts     Plain Mode setting
```

Prices are always recalculated on the server at checkout; the browser total is only a preview.

## Data model

Remix choices are stored on each order item as a snapshot so old orders stay accurate when prices change.

| Table                 | Key fields                                                                                                                                                                                                                                            | Notes                                                            |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `profiles`            | id, name, phone, role (customer / barista / owner), reps, level                                                                                                                                                                                       | Linked to Supabase Auth user                                     |
| `genres`              | id, name, slug, sort_order                                                                                                                                                                                                                            | Old School, New School, Mashup, Off-Beat, Intermission           |
| `drinks`              | id, genre_id, name, slug, dance_style, blurb, plain_description, base_price, image_url, temps_allowed, is_available, is_featured                                                                                                                      | `is_available` = Sitting out toggle                              |
| `option_groups`       | id, name, dance_label, plain_label, type (single / multi / text), required, max_select                                                                                                                                                                | Counts, Energy, Foundation, Flavor, Freeze …                     |
| `options`             | id, group_id, name, dance_label, plain_label, price_delta, is_available                                                                                                                                                                               | 16-count +20, Oat +30 …                                          |
| `drink_option_groups` | drink_id, group_id, default_option_id                                                                                                                                                                                                                 | Which Remix groups apply to which drink                          |
| `orders`              | id, code, user_id (nullable for guests), guest_name, guest_phone, type (drop_in / class / crew), slot_start, status, subtotal, total, payment_method (demo_gcash / demo_card / pay_at_pickup), payment_status (simulated), is_demo, notes, created_at | Status: warm_up → on_deck → full_out → stage_ready → bow, or cut |
| `order_items`         | id, order_id, drink_id (nullable for Freestyle), name_snapshot, base_snapshot, options_snapshot (JSON), quantity, line_total                                                                                                                          | Snapshot keeps history correct                                   |
| `time_slots`          | id, starts_at, capacity, booked_count                                                                                                                                                                                                                 | Or generated from opening hours + rules                          |
| `saved_choreo`        | id, user_id, name, base, options (JSON)                                                                                                                                                                                                               | Favorites and Freestyle recipes                                  |
| `reps_ledger`         | id, user_id, order_id, points, reason                                                                                                                                                                                                                 | Earned and redeemed points                                       |
| `crew_requests`       | id, user_id, contact, event_date, headcount, details, status, quote_amount                                                                                                                                                                            | Group / event orders                                             |
| `props`               | id, order_id, drink_id, user_id, name, rating, comment | One per drink per order, after pickup |
| `cypher_posts`        | id, tag_dance, tag_plain, title_dance, title_plain, body_dance, body_plain, author, is_published | The Cypher on Center Stage |

## Design direction

"Dance studio after dark meets coffee bar": warm and rhythmic, with purple as the one loud accent. Mobile-first.

- **Palette:** espresso brown `#3B2A20`, khaki `#C3B091`, cream `#F5EFE3`, purple `#7B4FC9` (buttons, active states, Plain Mode switch, tracker), soft lilac `#C9B6F0` (tags and hovers). A light theme (cream background) and a dark theme (espresso background) share the same accents.
- **Type:** a heavy condensed display font for headings (poster / battle-flyer feel) plus a clean sans for body text. Big numbers for counts and prices.
- **Motion:** subtle bounce on hover timed to ~120 BPM, cup "fill" animation in the Remix preview, "5, 6, 7, 8" count-in loader, snappy transitions. Respect `prefers-reduced-motion`.
- **Imagery:** real drink photos plus dancer silhouettes or motion-blur shots; avoid stock-looking coffee beans.
- **Texture:** studio-light gradients, tape marks on the floor, sticker-style tags for dance styles.
- **Components:** drink cards styled like class flyers; status tracker styled like a count bar 1–8.
- **Accessibility:** WCAG AA contrast, plain labels for screen readers, tap targets at least 44 px.

## Build phases

| Phase            | Scope                                                                                                                                                                                           |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 — Choreo (MVP) | Home, Lineup, Drink page with Remix, Playlist, Showtime with Drop-in and Book a Class, Demo pay, Plain Mode switch, demo banner, Live tracker, Backstage queue and menu manager, guest checkout |
| 2 — Full out     | Accounts, Saved Choreo, Past Performances and reorder, Freestyle builder, Dance Dictionary and first-visit welcome, Demo Backstage login, seeded demo data, slot capacity                       |
| 3 — Battle ready | Reps and Levels, Crew Orders, Props (reviews), Spotlight, The Cypher board, reports                                                                                                             |

## Open items

- Logo: wordmark "Groove Grounds" with a coffee bean shaped like a sneaker sole or a record (to be designed)
- Final drink photos (use placeholders until then)
