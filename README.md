# RutaSec

Cybersecurity learning catalog on **TanStack Start**, **Cloudflare Workers**, **D1**, and **Better Auth**.

**MVP goal:** browse the public catalog → open a resource → sign in → save a resource to your library.

## Stack

- [TanStack Start](https://tanstack.com/start) + [TanStack Router](https://tanstack.com/router) (file-based routes in `src/routes/`)
- [React](https://react.dev/) · [Tailwind CSS](https://tailwindcss.com/) · [shadcn/ui](https://ui.shadcn.com/)
- [Cloudflare Workers](https://developers.cloudflare.com/workers/) · [D1](https://developers.cloudflare.com/d1/)
- [Better Auth](https://www.better-auth.com/) (email/password, sessions)
- [Sentry](https://sentry.io/) (server instrumentation)
- Tooling: [Vite+](https://viteplus.dev/guide/) (`vp` CLI)

## Prerequisites

- Node.js (see `packageManager` in `package.json`)
- [Wrangler](https://developers.cloudflare.com/workers/wrangler/) for D1 and deploy
- `.env.local` with `BETTER_AUTH_SECRET` and `BETTER_AUTH_URL` (see [Authentication](#authentication))

## Getting started

```bash
vp install
npx -y @better-auth/cli secret   # add output to .env.local as BETTER_AUTH_SECRET=
# .env.local also needs BETTER_AUTH_URL=http://localhost:3000
npm run db:schema:local          # product tables + Better Auth tables
npm run db:seed:local
npm run dev
```

Dev server: [http://localhost:3000](http://localhost:3000). Local D1 lives under `.wrangler/state/v3/d1/` and is used automatically via the `DB` binding.

**Reset local D1** (wipe SQLite, re-apply schema and seed):

```bash
rm -rf .wrangler/state/v3/d1 && npm run db:schema:local && npm run db:seed:local
```

## Toolchain (Vite+)

This repo uses **Vite+** (`vp`), not the raw `vite` CLI for checks and tests.

```bash
vp check              # format, lint, type-check
vp check --fix        # same, with auto-fixes
vp test run           # unit tests (Vitest via vite-plus/test)
npm run test:coverage # unit tests + 80% coverage gate on modules/shared
vp env doctor         # diagnose toolchain issues
```

After pull or dependency changes: `vp install`.

## Project layout

```
src/
  routes/                 # TanStack file-based routes (loaders → server fns)
  modules/<feature>/      # catalog, identity, … (hexagonal layers)
  app/di/                 # composition root (*.module.ts)
  shared/presentation/ui/ # shadcn primitives
  shared/                 # getDb(), Result, utils
db/
  schema.sql              # D1 product schema
  auth-schema.sql         # Better Auth tables (user, session, account, verification)
  seed/                   # JSON source + generated import.sql
```

Business logic and D1 access stay in server functions and use cases — not in presentation components. See `.cursor/rules/architecture.mdc` and `AGENTS.md` for conventions.

## Database (D1)

| Binding | Database     | Schema                                 |
| ------- | ------------ | -------------------------------------- |
| `DB`    | `rutasec-db` | `db/schema.sql` + `db/auth-schema.sql` |

```bash
npm run db:schema:local    # apply product + auth schema (local)
npm run db:schema:remote   # apply product + auth schema (remote)
npm run db:auth-schema:generate  # regenerate db/auth-schema.sql from Better Auth CLI
npm run db:tables:local    # list tables
npm run db:seed:sql        # generate db/seed/import.sql
npm run db:seed:local      # generate + load seed (local)
npm run db:seed:remote     # generate + load seed (remote)
```

Seed source: `db/seed/web-pentesting-starter.json`. Each resource uses `resource_type` plus a learning-mode tag: `theory`, `practice`, or `mixed`.

Access D1 in server code via `#/shared/db` (`getDb()`).

**First-time Cloudflare setup** (if `database_id` is not in `wrangler.jsonc`):

```bash
npx wrangler d1 create rutasec-db   # once — copy id into wrangler.jsonc
```

## Authentication

Better Auth runs on the same D1 binding as product data. Server config lives in `src/modules/identity/adapters/better-auth/server-auth.ts` (`getAuth()`). The catch-all API route is `src/routes/api/auth/$.ts`. Sign-in and sign-up pages are at `/sign-in` and `/sign-up`.

```bash
# .env.local
BETTER_AUTH_SECRET=<from @better-auth/cli secret>
BETTER_AUTH_URL=http://localhost:3000
```

After changing Better Auth options, regenerate auth tables if needed:

```bash
npm run db:auth-schema:generate
npm run db:schema:local   # or reset local D1 first (see Getting started)
```

MVP: email/password and sessions only. Personal actions (e.g. save resource) must validate the session on the server via `getSessionFn` or `getAuth().api.getSession`.

```tsx
import { authClient } from "#/modules/identity";
import { getAuth } from "#/modules/identity/adapters/better-auth/server-auth";
import { getSessionFn } from "#/modules/identity/server/get-session";
```

Production: set `BETTER_AUTH_SECRET` and `BETTER_AUTH_URL` with `wrangler secret put`. Keep `nodejs_compat` enabled in `wrangler.jsonc`.

## UI (shadcn)

New pages and feature UI use components from `#/shared/presentation/ui/`. Install primitives before use:

```bash
pnpm dlx shadcn@latest add button
```

Config: `components.json`. Class merging: `cn()` in `src/shared/utils.ts`.

## Testing

| Kind     | Command                                            |
| -------- | -------------------------------------------------- |
| Unit     | `npm run test` or `vp test run`                    |
| Coverage | `npm run test:coverage`                            |
| E2E      | `npm run test:e2e:install` then `npm run test:e2e` |

E2E specs live in `e2e/` (Playwright). Unit tests colocate as `*.test.ts` beside modules under `src/modules/**` and `src/shared/**`.

## Build and deploy

```bash
npm run build    # vp build → dist/server/
npm run deploy   # build + wrangler deploy
npm run preview  # preview production build
```

Production secrets: `wrangler secret put <NAME>`. Bindings and compatibility flags: `wrangler.jsonc`.

## CI/CD (GitLab)

Pipelines run on merge requests and `main` via [`.gitlab-ci.yml`](.gitlab-ci.yml):

| Stage    | Job                 | Purpose                                     |
| -------- | ------------------- | ------------------------------------------- |
| validate | `check`             | `vp check` (format, lint, types)            |
| test     | `unit`              | `npm run test:coverage` (80% gate)          |
| build    | `build`             | `npm run build`                             |
| e2e      | `e2e`               | Playwright (`e2e/`) with local D1 bootstrap |
| deploy   | `deploy:production` | Manual Wrangler deploy on `main`            |
| deploy   | `db:schema:remote`  | Manual remote D1 schema apply               |

Set in GitLab **Settings → CI/CD → Variables**: `CLOUDFLARE_API_TOKEN` (and `CLOUDFLARE_ACCOUNT_ID` if Wrangler needs it). Override `BETTER_AUTH_SECRET` for stricter e2e; production auth secrets belong in Wrangler (`wrangler secret put`), not only in GitLab.

## v1 scope

In scope: public catalog, resource detail, auth, save to library.

Deferred: timeline, full goals dashboard, admin, scraping, broad social features.

## Docs

- Agent and architecture rules: `AGENTS.md`, `.cursor/rules/`
- Vite+: https://viteplus.dev/guide/ or `node_modules/vite-plus/docs`
- Operational docs (setup, commands, PRD): Projects Vault `projects/rutasec/docs/`

## Learn more

- [TanStack Start](https://tanstack.com/start)
- [TanStack Router](https://tanstack.com/router)
- [Cloudflare Workers + Vite](https://developers.cloudflare.com/workers/framework-guides/web-apps/tanstack-start/)
