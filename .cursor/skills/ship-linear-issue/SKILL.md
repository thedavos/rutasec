---
name: ship-linear-issue
description: >-
  Ship a RutaSec Linear issue end-to-end: read issue via Linear MCP, plan in
  Plan mode, git worktree + branch from Linear, implement with poteto-mode,
  GitHub PR to main (gh), Linear In Progress/Done, vp check/tests, worktree
  cleanup. Use when the user says ship Linear issue, implement DAV-XXX, or
  /ship-linear-issue.
disable-model-invocation: true
---

# Ship Linear issue (RutaSec)

Repeatable workflow for implementing a Linear backlog item in this repo. The user supplies a Linear identifier (e.g. `DAV-116`). Do not rely on the issue title alone.

Also load **poteto-mode** for implementation quality (Feature playbook, verification, prose).

## Inputs

| Input         | Source                                                                                                 |
| ------------- | ------------------------------------------------------------------------------------------------------ |
| Issue id      | User message (e.g. `DAV-116`)                                                                          |
| Full spec     | Linear MCP `get_issue` with `includeRelations: true`                                                   |
| Branch name   | Issue field `gitBranchName`                                                                            |
| Worktree path | `../rutasec-<issue-id-lowercase>-<short-slug>` (e.g. `../rutasec-dav-116-rut-21` for DAV-116 / RUT-21) |

If `get_issue` fails, authenticate Linear MCP and retry. Prefer `DAV-*` ids; human labels like `RUT-21` may not resolve.

## Non-negotiables

1. Read the issue via Linear MCP (description, acceptance criteria, relations, `gitBranchName`).
2. **Plan mode first.** Produce or follow a plan; do **not** edit the plan file the user or Plan mode created.
3. **Worktree required.** All implementation runs in the sibling worktree, not the primary checkout.
4. **Linear:** `In Progress` when work starts; `Done` when the pull request **merges** to `main` (not merely when the PR is opened).
5. **Finish:** `vp check`, `vp test run` (or `npm run test:coverage` if the change touches scoped modules), GitHub PR to `main`, remove worktree.
6. **No GitLab MR.** `origin` is `git@github.com:thedavos/rutasec.git`. Use `gh`, not `glab`.
7. If the issue or plan calls for a local test account, follow `db/README.md` and `npm run db:smoke-user:local`.
8. **Docs and agent guidance:** when the change affects how humans or agents work in the repo, update the relevant files in the same PR (see step 5).

## Workflow

Copy this checklist and track progress:

```
- [ ] 1. Linear: get_issue (full body + relations)
- [ ] 2. Plan mode: scope, files, acceptance criteria (do not edit plan file)
- [ ] 3. Worktree + branch from origin/main
- [ ] 4. Linear: state → In Progress
- [ ] 5. Implement in worktree (poteto-mode / Feature playbook)
- [ ] 5b. Update rules / README / AGENTS.md / db README if necessary
- [ ] 6. vp check && vp test run (coverage if required)
- [ ] 7. Commit, push origin, gh pr create → main
- [ ] 8. Worktree remove + prune (from primary repo)
- [ ] 9. Linear: Done after PR merges; link PR on issue if useful
```

### 1. Load issue

```text
get_issue(id: "<DAV-XXX>", includeRelations: true)
```

Note blockers in `relations.blockedBy`. If any blocker is not Done, stop and tell the user.

### 2. Plan

Switch to Plan mode before coding. Ground the plan in Linear acceptance criteria and repo rules (`.cursor/rules/`, `AGENTS.md`). After the user confirms the plan, do not modify the plan markdown file.

### 3. Worktree and branch

From the **primary** repo directory (parent of the worktree):

```bash
git fetch origin main
git worktree add -b "<gitBranchName>" "../rutasec-<dav-id-lowercase>-<short-slug>" origin/main
```

Use `gitBranchName` from Linear verbatim. `cd` into the worktree for all further git and `vp` commands.

### 4. Linear In Progress

```text
save_issue(id: "<DAV-XXX>", state: "In Progress")
```

### 5. Implement

Follow hexagonal layout in `architecture.mdc`. Match existing module patterns. Delegate heavy coding per poteto-mode Feature playbook if the change is nontrivial.

### 5b. Rules and docs (when necessary)

Before opening the PR, check whether the issue changed operational or agent-facing knowledge. Skip if nothing new applies; do not pad docs for small fixes.

| Change                                   | Update (pick what applies)                                                                                     |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| New module, route, script, or npm script | `AGENTS.md` key paths; `README.md` getting started / commands if user-facing                                   |
| D1 schema, seed, or local DB workflow    | `db/README.md`; `README.md` if bootstrap steps change                                                          |
| New `.cursor` skill, command, or rule    | `AGENTS.md` (skills/commands table or pointer); matching `.cursor/rules/*.mdc` if the rule should always apply |
| Auth, env, deploy, or toolchain          | `README.md`, `AGENTS.md`, and the relevant `.cursor/rules/` file                                               |

Synced product docs live outside the repo (`Projects Vault/.../rutasec/docs/` per `AGENTS.md`). Update those only when the issue explicitly asks or when shipping a milestone that must stay aligned with `docs/ISSUES.md` / Linear.

### 6. Verify

Inside the worktree:

```bash
vp check
vp test run
```

Use `npm run test:coverage` when changes affect `src/modules/**` or `src/shared/**` under the coverage gate.

### 7. GitHub pull request

```bash
git push -u origin HEAD
gh pr create --base main --title "<title>" --body "<summary + test plan + Closes DAV-XXX>"
```

Return the PR URL. Babysit GitHub Actions on the PR if workflows exist.

### 8. Worktree cleanup

From the **primary** repo (after PR exists):

```bash
git worktree remove "../rutasec-<dav-id-lowercase>-<short-slug>"
git worktree prune
git worktree list
```

Keep the remote branch for review until the PR merges.

### 9. Linear Done

When the PR is **merged** to `main`:

```text
save_issue(id: "<DAV-XXX>", state: "Done")
```

Optionally attach the PR link via `links` on `save_issue`.

## Invocation template

When the user runs `/ship-linear-issue` or names an issue, start from:

```markdown
Implement the Linear issue <DAV-XXX>.

/poteto-mode

Reglas:

1. Lee <DAV-XXX> por MCP (no uses solo el título).
2. Plan mode primero; no edites el archivo del plan.
3. Worktree obligatorio: <worktree-path> y rama <gitBranchName> desde origin/main.
4. Linear → In Progress al empezar; Done cuando el PR mergee.
5. Al terminar: vp check, vp test run, PR en GitHub a main (gh), quitar worktree.
6. No uses GitLab MR. origin es git@github.com:thedavos/rutasec.git.
7. Actualiza `.cursor/rules/`, `AGENTS.md`, `README.md` o `db/README.md` si el cambio lo requiere.

Si el issue pide cuenta local de prueba, sigue db/README.md y npm run db:smoke-user:local.
```

Fill `<DAV-XXX>`, `<worktree-path>`, and `<gitBranchName>` from `get_issue` before executing.

## References

- poteto-mode: `~/.cursor/plugins/cache/cursor-public/pstack/683cdbda983ea8be4b766ac3fe94b7b88e7f75ad/skills/poteto-mode/SKILL.md`
- RutaSec rules: `.cursor/rules/`, `AGENTS.md`
- GitHub CLI: `gh pr create` if MCP is preferred over CLI
