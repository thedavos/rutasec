# AGENTS.md

## Project Context
This repository originated as a blank GitLab scaffold (`gitlab.com/davos/rutasec`). Initially, it contained only the default `README.md` with no application code, dependencies, or services.

> ⚠️ **Note**: The "no tooling" notes below have been superseded. This project now uses **Vite+** as its unified frontend toolchain. See the active instructions below.

### Legacy Scaffold Notes (for reference)
- ~~No build/lint/test commands exist yet.~~ → **Now handled by Vite+** (`vp check`, `vp test`)
- ~~No services to start.~~ → **Frontend dev server**: `vp dev`
- ~~No dependency files present.~~ → **Now managed via**: `package.json` + `vp install`

When additional backend services or non-frontend code are added, update this file accordingly.

---

## Using Vite+, the Unified Toolchain for the Web

This project uses **Vite+**, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`.

> 💡 Vite+ is distinct from Vite. It invokes Vite through `vp dev` and `vp build`.

- Run `vp help` for a list of commands
- Run `vp <command> --help` for details on a specific command
- Docs: local at `node_modules/vite-plus/docs` or online at https://viteplus.dev/guide/

### Review Checklist
- [ ] Run `vp install` after pulling remote changes and before getting started
- [ ] Run `vp check` and `vp test` to format, lint, type-check, and test changes
- [ ] Check `vite.config.ts` tasks or `package.json` scripts for validation steps; run via `vp run <script>`
- [ ] If setup, runtime, or package-manager behavior looks wrong, run `vp env doctor` and include its output when asking for help

### Common Workflows
```bash
# Start dev server
vp dev

# Build for production
vp build

# Run all checks (lint + type + test)
vp check && vp test

# Install/update dependencies
vp install

# Diagnose environment issues
vp env doctor