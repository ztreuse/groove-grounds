# Groove Grounds

Dance-themed coffee ordering site — a concept / portfolio demo by ztreuse. No real orders or payments.

The full spec is in [docs/PROJECT.md](docs/PROJECT.md); build prompts are in [PROMPTS.md](PROMPTS.md).

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Scripts

- `npm run dev`: start the dev server
- `npm run build`: production build
- `npm run lint`: ESLint
- `npm run format`: Prettier (with Tailwind class sorting)

## Staff accounts (Backstage)

Backstage works two ways:

- **Demo Backstage** (anyone): the order queue shows only orders placed from your own browser.
- **Staff** (signed in, role `owner` or `barista`): the queue shows every open order. Only the **owner** can open the menu manager at `/backstage/lineup`.

Roles live in `profiles.role`. To make an account staff, run in the Supabase SQL editor:

```sql
update profiles set role = 'owner'   -- or 'barista'
where id = (select id from auth.users where email = 'you@example.com');
```

## Demo dancer (one-tap sign-in)

The sign-in page has **Try the demo dancer**: a shared customer account with past orders, Saved Choreo and Reps, so visitors can see the Dancer Profile without signing up. Its details and choreo are read-only.

1. Set `DEMO_DANCER_EMAIL` and `DEMO_DANCER_PASSWORD` in `.env.local` (and in your host's environment variables when deploying).
2. Run `npm run db:seed-demo`. It creates the account if needed and resets its orders, choreo and Reps; run it again any time to refresh the demo.

## Class schedule

Opening hours, slot length, max drinks per slot, how far ahead people can book, minimum notice and blackout dates live in the `schedule_settings` table. The owner edits them at `/backstage/schedule`.


## Shop details

The About and Find the Studio pages use `[YOUR …]` placeholders for facts only you know. Fill in the address, phone, email and socials in `lib/studio.ts`; setting `mapEmbedUrl` there (for example the `src` from Google Maps' "Embed a map") shows the map. The story and the choreographers' names live in `lib/copy.ts` under `about`. Opening hours come from Backstage > Class schedule.
