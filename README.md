# Groove Grounds

Dance-themed coffee ordering site — a concept / portfolio demo by ztreuse. No real orders or payments.

**Live demo:** https://groove-grounds.vercel.app

**How it all works, step by step** (sign-up, ordering, the staff side, group orders, points): [docs/WALKTHROUGH.md](docs/WALKTHROUGH.md).

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

Find the Studio uses fictional contact details on purpose (a made-up street, a reserved `.example` email, a placeholder number), set in `lib/studio.ts`. Setting `mapEmbedUrl` there (for example the `src` from Google Maps' "Embed a map") shows a map; only do that for a real address. The About page's founding story and choreographers are fictional too (hands-only photos, so no real person is named); they live in `lib/copy.ts` under `about`. The story and the choreographers' names live in `lib/copy.ts` under `about`. Opening hours come from Backstage > Class schedule.

## Magic-link sign-in

Sign in offers "Email me a sign-in link" for existing members (Supabase `signInWithOtp`, `shouldCreateUser: false`). The link returns through `/auth/callback`. Two Supabase settings matter:

- **Redirect URLs** (Authentication → URL Configuration) must allow `<your site>/auth/callback` for every origin you use (localhost and the deployed URL).
- Supabase's built-in email service only delivers to your project's team members and is heavily rate-limited. For visitors to receive links (and sign-up confirmations), add a custom SMTP provider under Authentication → Emails.
