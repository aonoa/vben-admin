# vben-admin — Agent Notes

## Source Of Truth

- Read `docs/project_profile.md`, `docs/architecture/current_architecture.md`, `docs/architecture/tech_stack.md`, `docs/planning/module_boundaries.md`, `docs/planning/verification.md`, `docs/planning/risk_register.md`, `docs/progress.md`, and `docs/worklog.md` before planning or editing.
- Read `.codex/skills/vben-admin/SKILL.md` and the official Vben Admin skill reference at `https://github.com/vbenjs/skills` for framework-specific route, menu, access, theme, locale, login, request, and component conventions.
- Treat `docs/*.md` as durable project state.
- Treat `docs/src` as the public VitePress docs site, not bootstrap state.

## Project Shape

- These notes describe the frontend `main` branch paired with the monolithic backend. The microservice frontend is on the separate `monorepo` branch.
- Read `../AGENTS.md` for cross-repository coordination and full-stack feature rules.
- Read `../REPO_STRUCTURE.md` and `../STARTUP_AND_INTEGRATION.md` before switching branches or syncing backend OpenAPI output.
- `apps/*`: independently runnable web apps plus `backend-mock`
- `packages/*`: shared runtime libraries and framework layers
- `internal/*`: build, lint, config, and tooling packages
- `docs/src`: public documentation site
- `playground`: integration and e2e surface
- `scripts/*`: repo automation and release helpers
- Prefer Vben framework primitives and existing app patterns before introducing bespoke abstractions in app-layer code; record any intentional deviation in the handoff.

## High-Conflict Files

- `package.json`, `pnpm-workspace.yaml`, `pnpm-lock.yaml`, `openapi.yaml`
- `turbo.json`, `.npmrc`, `lefthook.yml`, `eslint.config.mjs`, `stylelint.config.mjs`, `vitest.config.ts`
- `apps/*/package.json`, `apps/backend-mock/**`, `apps/web-antd/**`
- `packages/@core/**`, `packages/effects/**`
- `docs/src/**`, `docs/project_profile.md`, `docs/architecture/**`, `docs/planning/**`, `docs/progress.md`, `docs/worklog.md`
- `playground/playwright.config.ts`
- `internal/**`

## Module Rules

- App code may depend on shared packages, but shared packages must not depend on app code.
- Keep `packages/@core/*` low-level and framework-neutral.
- Keep `packages/effects/*` free of app-specific imports.
- Change `internal/*` only for workspace-wide tooling updates.
- Never hand-edit generated artifacts when a generation command exists.
- Active backend API prefix on this branch is `/basic-api/*`; do not mix in microservice prefixes unless the repo is on `monorepo`.

## Full-Stack Feature Rule

- Treat `vben-admin/main` + `../base-server/master` as one complete monolithic product line for feature work.
- When adding, modifying, or refactoring a feature, inspect the paired backend impact before editing: API/proto/OpenAPI contracts, service handlers, biz logic, data schema, auth/RBAC, upload/SSE, config, and runtime behavior.
- If a frontend change affects routes, menus, permissions, request parameters, response fields, upload/SSE behavior, or generated client usage, plan the matching backend check or update in `../base-server` on the same version line.
- If the backend does not need changes, state the reason in the completion report.
- Do not apply microservice API prefixes or service-split assumptions unless both repos are on `monorepo`.

## Verification

```bash
corepack enable
pnpm install
pnpm build
pnpm build:antd
pnpm build:naive
pnpm build:ele
pnpm build:tdesign
pnpm build:play
pnpm build:docs
pnpm test:unit
pnpm test:e2e
pnpm lint
pnpm check:type
pnpm check:dep
pnpm check:circular
pnpm check:cspell
pnpm check
```

## Git Policy

- Check `git status --short --branch`, current branch/ref, and worktree list before editing.
- Do not overwrite existing dirty files unless the task explicitly targets them.
- Keep commits aligned with a single task boundary.
- Do not commit generated artifacts, lockfile churn, or unrelated user work.
- Push only when the user asks.
- Verify after each merge or worktree integration.

## Worktree And Parallelism

- Use parallel work only for disjoint write paths.
- Do not parallelize lockfile, workspace, API contract, or global config changes with feature work.
- Reserve explicit paths before spawning workers.
- Merge one child result at a time and re-run targeted verification after each merge.

## Human Escalation

Ask before changing:

- Product scope
- Public API shape or generated client contract
- Package boundaries or ownership
- UI framework choice
- Build, release, or deployment posture
- Security-sensitive configuration

## Human Interrupts

- Pause the affected work immediately.
- Record the confirmed change in `docs/worklog.md` and any affected project docs.
- Re-check task boundaries, parallelism, and verification before resuming.

## Completion Report

Report:

- Goal result
- Active version line and frontend/backend impact
- Changed files
- Verification run
- Open risks
- Next recommended action
