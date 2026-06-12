# Proposal intake (maintainers)

Turn a `/send-resource` GitHub issue into a validated seed resource JSON for human review before D1 import.

Related scripts:

| npm script              | Script file                         |
| ----------------------- | ----------------------------------- |
| `proposal:intake`       | `scripts/proposal-intake/cli.ts`    |
| `community-icon:import` | `scripts/import-community-icon.mjs` |
| `proposal:set-icon`     | `scripts/set-proposal-icon.mjs`     |

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
3. Append the resource to `db/seed/web-pentesting-expansion.json` (or another seed file)
4. `npm run db:seed:local` → verify on `/resources`
5. `npm run db:seed:remote` only after review

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

## End-to-end workflow

### Standard proposal (auto favicon)

```bash
export GITHUB_TOKEN="$(gh auth token)"
export CURSOR_API_KEY=...

npm run proposal:intake -- 42
# review db/seed/proposals/issue-42.json
# merge into db/seed/web-pentesting-expansion.json
npm run db:seed:local
```

### YouTube (or external URL) + community logo

```bash
npm run community-icon:import -- https://community.example/logo.svg my-community
npm run proposal:intake -- 42
npm run proposal:set-icon -- 42 my-community
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
| `Icon file not found`                  | Run `community-icon:import` or check `--icon-path`              |

---

## See also

- Root [`README.md`](../../README.md) — Proposal intake and Community logos sections
- [`db/README.md`](../../db/README.md) — Seed and `icon_url` notes
- [`AGENTS.md`](../../AGENTS.md) — npm script quick reference
