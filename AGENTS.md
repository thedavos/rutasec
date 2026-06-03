# AGENTS.md

Guidance for AI agents working in the RutaSec codebase.

## Project

RutaSec is a cybersecurity learning catalog on **TanStack Start + Cloudflare Workers + D1 + Better Auth**. MVP goal: public catalog, auth, and save a resource to a personal library.

Detailed rules live in **`.cursor/rules/`** (`.mdc` files). Prefer those over generic framework advice.

| Rule file            | When it applies                                         |
| -------------------- | ------------------------------------------------------- |
| `rutasec-core.mdc`   | Always — stack, v1 scope, data boundaries               |
| `architecture.mdc`   | `src/**` — feature modules, DI, hexagonal layers, ports |
| `vite-plus.mdc`      | Always — toolchain and validation                       |
| `tanstack-start.mdc` | `src/**` — routes, loaders, server functions            |
| `cloudflare-d1.mdc`  | `db/**`, `wrangler.jsonc`, `scripts/**`                 |
| `better-auth.mdc`    | Auth files — sessions, cookies                          |
| `sentry.mdc`         | `src/**` — instrument server functions                  |
| `testing.mdc`        | Always — Vitest, Playwright, coverage, layer boundaries |
| `ui-shadcn.mdc`      | UI files — shadcn/ui required for pages and components  |
| `shared-utils.mdc`   | `src/**` — generic pure helpers → `src/shared/utils/`   |

## Stack

TanStack Start · React · Tailwind CSS · Cloudflare Workers · D1 · Better Auth · Sentry

Do not introduce Astro, Next.js, Durable Objects, Queues, KV, or R2 unless explicitly requested.

## Key paths

```
src/routes/                    file-based routes (presentation)
src/app/di/                    composition root (*.module.ts, incl. timeline.module.ts)
src/modules/<feature>/         feature modules (catalog, library, identity, goals, dashboard, timeline — study plan generate/get + weekly view)
src/shared/                    cross-cutting (db, domain/Result, utils/)
src/shared/utils.ts            cn() only; other helpers in src/shared/utils/
db/schema.sql                  D1 schema
docs/timeline-rules.md         frozen MVP timeline scheduling rules
```

db/seed/ seed JSON + generated import.sql
scripts/ import-seed-to-d1.mjs
wrangler.jsonc Worker + D1 binding (DB → rutasec-db)
.cursor/rules/ project rules for agents

````

## Vite+ toolchain

This project uses **Vite+** (`vp`) — distinct from raw Vite. Docs: https://viteplus.dev/guide/ or `node_modules/vite-plus/docs`.

```bash
vp install              # after pull / dependency changes
vp check                # format, lint, type-check
vp test run             # unit tests once
npm run test:coverage   # unit tests + 80% coverage gate
npm run test:e2e:install # Playwright Chromium (once)
npm run test:e2e        # e2e specs in e2e/ (when UI exists)
vp env doctor           # diagnose toolchain issues
````

### App scripts

```bash
npm run dev             # dev server (port 3000, .env.local, Sentry)
npm run build           # production build → dist/server/
npm run deploy          # build + wrangler deploy
npm run test:e2e        # Playwright e2e (starts dev server if needed)
npm run db:schema:local # apply schema to local D1
npm run db:seed:local   # generate + load seed into local D1
```

Local D1 is SQLite under `.wrangler/state/v3/d1/` — no separate SQL server. `npm run dev` uses the same local D1 via the `DB` binding.

## v1 ship gate

A change belongs in v1 if it supports this loop:

1. Browse public catalog
2. Open resource detail
3. Sign in
4. Save a resource

Defer drag-and-drop timeline editing, automatic plan regeneration, full goals analytics, broad dashboard, admin panel, scraping, and social features.

## Before finishing work

```bash
vp check
vp test run
```

## Conventions

- **Generic pure helpers** (no feature-specific rules) live in `src/shared/utils/` as one function per file with colocated `*.test.ts` — see `shared-utils.mdc`. Do not park reusable string/URL/compare helpers under a module’s `presentation/` folder.
- Business logic and D1 access in server functions / loaders, not client components.
- `resources` = editorial catalog; `user_resources` = personal state — keep them separate.
- `src/modules/timeline` owns scheduling rules, study plan persistence (DAV-118), and the weekly timeline route (DAV-119).
- Instrument `createServerFn` handlers with `Sentry.startSpan` (see `sentry.mdc`).
- Add shadcn components: `pnpm dlx shadcn@latest add <component>`.
- Minimize scope — match existing patterns; don't over-engineer.

## Docs (Projects Vault)

Operational docs (PRD, architecture, setup, commands) live outside this repo:

`/Users/davidvargas/Davion Software/Projects Vault/projects/rutasec/docs/`

Start with `SETUP.md` and `COMMANDS.md` for bootstrap and CLI reference.
