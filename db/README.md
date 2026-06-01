# Database (D1)

Product schema: `schema.sql`. Better Auth tables: `auth-schema.sql`. Catalog seed: `seed/web-pentesting-starter.json` → `seed/import.sql` (generated).

## Commands

```bash
npm run db:schema:local    # apply product + auth schema (local)
npm run db:seed:local        # load starter catalog seed
npm run db:smoke-user:local  # ensure local smoke test account (dev server must be running)
npm run db:smoke-user:reset  # delete and recreate smoke account
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
