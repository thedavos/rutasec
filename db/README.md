# Database (D1)

Product schema: `schema.sql`. Better Auth tables: `auth-schema.sql`. Catalog seeds: `seed/web-pentesting-starter.json` and `seed/web-pentesting-expansion.json` → `seed/import.sql` (generated). Seed resources may include optional `icon_url` (curated site icon); run `node scripts/backfill-seed-icon-urls.mjs` to populate from resource URLs, or `npm run community-icon:import` to host a community logo under `public/community-icons/` (manifest: `seed/community-logos.json`). After `npm run proposal:intake`, run `npm run proposal:set-icon -- <issue#> <slug>` to patch `seed/proposals/issue-<n>.json`, then `npm run proposal:promote -- <issue#>` to merge into expansion seed.

## Commands

```bash
npm run db:schema:local    # apply product + auth schema (local)
npm run db:migrate:local   # apply incremental migrations on existing local D1
npm run db:seed:local        # load starter catalog seed only
npm run db:seed:local:all    # load starter + expansion (use after proposal:promote)
npm run db:smoke-user:local  # ensure local smoke test account (dev server must be running)
npm run db:smoke-user:reset  # delete and recreate smoke account
npm run cache:clear:local    # clear local catalog KV cache
npm run cache:clear:remote   # clear remote catalog KV cache (Cloudflare credentials required)
```

## Catalog cache

Public catalog reads (resource lists, filter options, resource detail) are cached in Cloudflare KV with a 5 minute TTL. D1 remains the source of truth.

After updating editorial catalog data locally:

```bash
npm run db:seed:local:all
npm run cache:clear:local
```

Use `db:seed:local` when you only changed the starter seed. After promoting a proposal into expansion, prefer `db:seed:local:all`.

After a remote seed or import:

```bash
npm run db:seed:remote:all
npm run cache:clear:remote
```

You can also wait for TTL expiry instead of clearing cache manually. For a full local reset of D1 and KV state, remove both state directories:

```bash
rm -rf .wrangler/state/v3/d1 .wrangler/state/v3/kv
```

## Local smoke test account

Fixed credentials for manual QA on **local D1 only**. Not for production. Safe to commit; the account exists only after you run the seed script against your machine.

| Field    | Value                 |
| -------- | --------------------- |
| Email    | `smoke@rutasec.local` |
| Password | `SmokeTest123!`       |
| Name     | Smoke Tester          |

Sign in at [http://localhost:3000/sign-in](http://localhost:3000/sign-in) after `npm run dev`.

### Create or refresh

1. Start the app: `npm run dev`
2. Run `npm run db:smoke-user:local` (idempotent if the account already works)
3. If the password drifts or login fails: `npm run db:smoke-user:reset`

The script calls Better Auth sign-up against your local server so passwords are hashed correctly. `app_users` is created on the first authenticated server action (for example saving a resource).

### After wiping local D1

```bash
rm -rf .wrangler/state/v3/d1
npm run db:schema:local
npm run db:seed:local
npm run dev
npm run db:smoke-user:local
```

### Existing local D1 (schema change without wipe)

```bash
npm run db:migrate:local
npm run db:seed:local
npm run cache:clear:local
```

Skip migrations on a fresh database created from `db/schema.sql` (column is already in `CREATE TABLE`).
