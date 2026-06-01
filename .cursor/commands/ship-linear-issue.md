---
name: ship-linear-issue
description: Ship a RutaSec Linear issue (worktree, poteto-mode, GitLab MR, Linear status).
---

# Ship Linear issue

Follow the project skill `.cursor/skills/ship-linear-issue/SKILL.md` in full.

The user will name a Linear issue (e.g. `DAV-116`). If they did not, ask for the identifier once, then run the skill workflow without skipping steps.

Load **poteto-mode** for implementation.

Use this prompt shape after `get_issue`:

Implement the Linear issue **{ISSUE_ID}**.

/poteto-mode

Reglas:

1. Lee **{ISSUE_ID}** por MCP (no uses solo el título).
2. Plan mode primero; no edites el archivo del plan.
3. Worktree obligatorio: **{WORKTREE_PATH}** y rama **{GIT_BRANCH_NAME}** desde origin/main.
4. Linear → In Progress al empezar; Done cuando el MR mergee.
5. Al terminar: vp check, vp test run, MR en GitLab a main (glab), quitar worktree.
6. No abras GitHub PR. origin es gitlab.com:davos/rutasec.
7. Actualiza `.cursor/rules/`, `AGENTS.md`, `README.md` o `db/README.md` si el cambio lo requiere.

Si el issue pide cuenta local de prueba, sigue db/README.md y npm run db:smoke-user:local.

Replace `{ISSUE_ID}`, `{WORKTREE_PATH}`, and `{GIT_BRANCH_NAME}` from Linear before starting.
