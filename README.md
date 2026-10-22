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

