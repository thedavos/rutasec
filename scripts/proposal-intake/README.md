# Proposal intake (maintainers)

Turn a `/send-resource` GitHub issue into a validated seed resource JSON for human review before D1 import.

Related scripts:

| npm script              | Script file                                  |
| ----------------------- | -------------------------------------------- |
| `proposal:intake`       | `scripts/proposal-intake/cli.ts`             |
| `community-icon:import` | `scripts/import-community-icon.mjs`          |
| `proposal:set-icon`     | `scripts/set-proposal-icon.mjs`              |
| `proposal:promote`      | `scripts/promote-proposal-to-seed.mjs`       |
| `proposal:close`        | `scripts/proposal-intake/close-issue-cli.ts` |

## Prerequisites

- GitHub issue titled `[new-<type>] …` from the `/send-resource` flow (see `buildResourceProposalIssue`)
- `GITHUB_TOKEN` or `gh auth token`
- `CURSOR_API_KEY` for AI enrichment

```bash
export GITHUB_TOKEN="$(gh auth token)"
export CURSOR_API_KEY=...
```

## `proposal:intake`

Fetch a GitHub issue, parse the proposal body, enrich missing seed fields with the Cursor SDK, resolve `icon_url`, dedupe URLs, and write a seed resource object.

```bash
npm run proposal:intake -- <issue-number> [options]
```

### Options

| Flag        | Description                                              |
| ----------- | -------------------------------------------------------- |
| `--stdout`  | Print validated JSON to stdout instead of writing a file |
| `--dry-run` | Validate and print summary; do not write output          |
| `--help`    | Show usage                                               |

### Output

Default path (gitignored):

```text
db/seed/proposals/issue-<number>.json
```

The file is a **bare seed resource object** (not a full seed file with `learning_path`).

### Examples

```bash
npm run proposal:intake -- 42
npm run proposal:intake -- 42 --stdout
npm run proposal:intake -- --help
```

### After intake

1. Review `db/seed/proposals/issue-<number>.json`
2. Optionally set a community logo (see below)
3. Promote into editorial seed: `npm run proposal:promote -- <number>`
4. `npm run db:seed:local:all` → verify on `/resources`
5. `npm run cache:clear:local` if catalog looks stale
6. `npm run db:seed:remote:all` only after review
7. `npm run proposal:close -- <number>` → close the GitHub issue with an acceptance comment

---

## `community-icon:import`

Download a community logo and host it in the repo. Use when the resource URL points elsewhere (e.g. YouTube) but the card should show the community mark.

```bash
npm run community-icon:import -- <logo-url> <community-slug> [--force]
```

### Arguments

| Argument           | Description                                                      |
| ------------------ | ---------------------------------------------------------------- |
| `<logo-url>`       | HTTPS URL to png, jpg, gif, webp, svg, or ico (max 512 KB)       |
| `<community-slug>` | Lowercase slug: letters, numbers, hyphens (e.g. `acme-security`) |
| `--force`          | Overwrite an existing file for that slug                         |

### What it does

1. Downloads and validates the image
2. Saves to `public/community-icons/<slug>.<ext>`
3. Updates `db/seed/community-logos.json` with `icon_path`, `source_url`, `updated_at`
4. Prints the `icon_url` for seed JSON

### Examples

```bash
npm run community-icon:import -- https://example.com/logo.svg acme-security
npm run community-icon:import -- https://cdn.example.com/brand.png rootedcon --force
npm run community-icon:import -- --help
```

Use only logos you have rights to redistribute.

---

## `proposal:set-icon`

Patch `icon_url` on a proposal file produced by `proposal:intake`.

```bash
npm run proposal:set-icon -- <issue-number> <community-slug>
npm run proposal:set-icon -- <issue-number> --icon-path /community-icons/<slug>.<ext>
```

### Modes

- **By slug:** looks up `icon_path` in `db/seed/community-logos.json` (requires `community-icon:import` first)
- **By path:** sets `icon_url` directly; file must exist under `public/community-icons/`

### Examples

```bash
npm run proposal:set-icon -- 42 acme-security
npm run proposal:set-icon -- 42 --icon-path /community-icons/acme-security.svg
npm run proposal:set-icon -- --help
```

---

## `proposal:promote`

Copy a reviewed proposal into an editorial seed file (default: `db/seed/web-pentesting-expansion.json`).

```bash
npm run proposal:promote -- <issue-number> [options]
```

### Options

| Flag                  | Description                                                          |
| --------------------- | -------------------------------------------------------------------- |
| `--seed <path>`       | Target seed file (default: expansion)                                |
| `--assign-path-order` | Set `path_order` to next free slot when the proposed one is taken    |
| `--remove-proposal`   | Delete `db/seed/proposals/issue-<n>.json` after a successful promote |
| `--dry-run`           | Validate only; do not write seed or remove proposal                  |
| `--help`              | Show usage                                                           |

### Examples

```bash
npm run proposal:promote -- 42
npm run proposal:promote -- 42 --assign-path-order --remove-proposal
npm run proposal:promote -- 42 --seed db/seed/web-pentesting-starter.json --dry-run
```

Re-running promote with the same resource `id` updates the existing row in the target seed (idempotent).

---

## `proposal:close`

Close a reviewed proposal issue on GitHub with an optional acceptance comment.

```bash
npm run proposal:close -- <issue-number> [options]
```

### Options

| Flag                 | Description                                        |
| -------------------- | -------------------------------------------------- |
| `--comment <text>`   | Custom closing comment                             |
| `--resource-id <id>` | Include catalog resource id in the default comment |
| `--no-comment`       | Close without posting a comment                    |
| `--dry-run`          | Validate only; do not post or close                |
| `--help`             | Show usage                                         |

By default the script posts a short acceptance message. If `db/seed/proposals/issue-<n>.json` still exists, it includes the resource `id` in that message.

Only issues with a proposal title (`[new-<type>] …`) are accepted — same guard as `proposal:intake`.

### Examples

```bash
npm run proposal:close -- 42
npm run proposal:close -- 42 --resource-id res-video-example
npm run proposal:close -- 42 --no-comment
npm run proposal:close -- 42 --dry-run
```

---

## Seed import (starter + expansion)

`npm run db:seed:local` loads **starter only**. After promoting proposals into expansion, import both editorial seeds:

```bash
npm run db:seed:local:all    # generate SQL from starter + expansion → load local D1
npm run db:seed:remote:all   # same for remote D1
npm run cache:clear:local    # refresh catalog KV after seed changes
```

Underlying scripts: `db:seed:sql:all` → `scripts/import-all-seeds-to-d1.mjs`.

---

## End-to-end workflow

### Standard proposal (auto favicon)

```bash
export GITHUB_TOKEN="$(gh auth token)"
export CURSOR_API_KEY=...

npm run proposal:intake -- 42
# review db/seed/proposals/issue-42.json
npm run proposal:promote -- 42 --assign-path-order --remove-proposal
npm run db:seed:local:all
npm run cache:clear:local
npm run proposal:close -- 42
```

### YouTube (or external URL) + community logo

```bash
npm run community-icon:import -- https://community.example/logo.svg my-community
npm run proposal:intake -- 42
npm run proposal:set-icon -- 42 my-community
npm run proposal:promote -- 42 --assign-path-order
npm run db:seed:local:all
npm run cache:clear:local
npm run proposal:close -- 42 --resource-id res-video-example
```

Example seed fields after set-icon:

```json
{
  "url": "https://www.youtube.com/watch?v=VIDEO_ID",
  "resource_type": "video",
  "original_source_name": "My Community",
  "icon_url": "/community-icons/my-community.svg"
}
```

`url` is where the learner goes. `icon_url` is what appears on catalog cards.

---

## Files and folders

| Path                                                     | Purpose                                                |
| -------------------------------------------------------- | ------------------------------------------------------ |
| `scripts/proposal-intake/`                               | Intake CLI and helpers                                 |
| `scripts/import-community-icon.mjs`                      | Logo download + manifest update                        |
| `scripts/set-proposal-icon.mjs`                          | Patch proposal `icon_url`                              |
| `scripts/promote-proposal-to-seed.mjs`                   | Merge proposal into editorial seed                     |
| `scripts/proposal-intake/close-issue-cli.ts`             | Close GitHub proposal issue                            |
| `scripts/import-all-seeds-to-d1.mjs`                     | Generate combined SQL from all editorial seeds         |
| `db/seed/proposals/`                                     | Generated proposal JSON (gitignored except `.gitkeep`) |
| `db/seed/community-logos.json`                           | Slug → `icon_path` manifest                            |
| `public/community-icons/`                                | Hosted logo assets (`/community-icons/...` in the app) |
| `src/shared/utils/parse-resource-proposal-issue-body.ts` | Issue body parser (unit tested)                        |

---

## Troubleshooting

| Error                                  | Likely fix                                                      |
| -------------------------------------- | --------------------------------------------------------------- |
| `Set GITHUB_TOKEN`                     | `export GITHUB_TOKEN="$(gh auth token)"`                        |
| `Set CURSOR_API_KEY`                   | Add Cursor SDK API key to env                                   |
| `title does not match proposal format` | Issue title must start with `[new-course]`, `[new-video]`, etc. |
| `Duplicate seed URL`                   | Resource already in seed; do not re-import                      |
| `No icon_path for slug`                | Run `community-icon:import` for that slug first                 |
| `Proposal file not found`              | Run `proposal:intake` for that issue number first               |
| `path_order … already used`            | Re-run `proposal:promote` with `--assign-path-order`            |
| `Icon file not found`                  | Run `community-icon:import` or check `--icon-path`              |

---

## GitHub Actions (maintainers)

Step-by-step workflows in [`.github/workflows/`](../../.github/workflows/). Run from **Actions** → workflow → **Run workflow**.

| Workflow                 | File                       | When to run                     |
| ------------------------ | -------------------------- | ------------------------------- |
| **Proposal intake**      | `proposal-intake.yml`      | New proposal issue to review    |
| **Proposal promote**     | `proposal-promote.yml`     | After reviewing intake artifact |
| **Proposal seed remote** | `proposal-seed-remote.yml` | After merging the seed PR       |
| **Proposal close**       | `proposal-close.yml`       | After remote D1 is updated      |

### Required secrets

| Secret                  | Workflows                                                         |
| ----------------------- | ----------------------------------------------------------------- |
| `CURSOR_API_KEY`        | Proposal intake; Proposal promote (when `intake_run_id` is empty) |
| `CLOUDFLARE_API_TOKEN`  | Proposal seed remote                                              |
| `CLOUDFLARE_ACCOUNT_ID` | Proposal seed remote                                              |

`GITHUB_TOKEN` is provided by Actions (issues + PR permissions are declared in each workflow).

### Recommended sequence

1. **Proposal intake** — input: `issue_number`
   - Uploads artifact `proposal-issue-<n>`
   - Comments on the issue with resource id and workflow run link

2. **Proposal promote** — inputs: `issue_number`, `intake_run_id` (from step 1 run)
   - Merges proposal into `web-pentesting-expansion.json`
   - Opens a PR for human review

3. Merge the seed PR on `main`

4. **Proposal seed remote** — loads starter + expansion into remote D1 and clears catalog KV
   - Uses the `production` environment (optional approval gate)

5. **Proposal close** — input: `issue_number`, optional `resource_id`
   - Posts acceptance comment and closes the issue

Each workflow supports `dry_run` where applicable (validate without writes).

Local CLI commands remain available for the same steps on a maintainer machine.

---

## See also

- Root [`README.md`](../../README.md) — Proposal intake and Community logos sections
- [`db/README.md`](../../db/README.md) — Seed and `icon_url` notes
- [`AGENTS.md`](../../AGENTS.md) — npm script quick reference
