---
name: vben-admin
description: Use when working on the Vben Admin monorepo (Vue 3 + Vite + pnpm + Turbo), including apps, packages, docs, playground, and automation.
---

# Vben Admin

## Core Principle

This project uses document-driven iterative development. Repository docs are the source of truth; chat is temporary. Requirements, decisions, assumptions, open questions, task boundaries, verification commands, and iteration results must be written to project docs before they are treated as durable state.

## Vben Framework First

- Treat the official Vben Admin skill reference at `https://github.com/vbenjs/skills` as the framework guide for route, menu, access, theme, locale, login, API, and component conventions.
- Prefer existing Vben framework primitives, shared packages, and established app patterns before introducing bespoke abstractions or custom UI.
- If a task must deviate from framework conventions, record the reason and replacement pattern in the handoff.

## Full-Stack Product Rule

Treat `vben-admin/main` + `/home/mini/OpenSource/framework/base-server/master` as one complete monolithic product line for feature work. When adding, modifying, or refactoring a feature, inspect the paired backend impact before editing and report both frontend and backend impact at handoff.

If frontend routes, menus, permissions, fields, request parameters, response handling, upload, SSE, or generated client usage changes, plan the matching backend contract/handler/biz/data/auth check or update in the paired `base-server` repo on the same version line. If no backend change is required, state why.

Do not mix in microservice branch assumptions or API prefixes unless both repos are on `monorepo`.

## Read First

- `/home/mini/OpenSource/framework/AGENTS.md`
- `/home/mini/OpenSource/framework/REPO_STRUCTURE.md`
- `/home/mini/OpenSource/framework/STARTUP_AND_INTEGRATION.md`
- `AGENTS.md`
- `docs/project_profile.md`
- `docs/architecture/current_architecture.md`
- `docs/architecture/tech_stack.md`
- `docs/planning/module_boundaries.md`
- `docs/planning/verification.md`
- `docs/planning/risk_register.md`
- `docs/progress.md`
- `docs/worklog.md`

## Module Boundaries

- These rules describe the frontend `main` branch paired with the monolithic backend. The microservice frontend lives on `monorepo`.
- `apps/web-antd`, `apps/web-antdv-next`, `apps/web-naive`, `apps/web-ele`, `apps/web-tdesign`: app-specific UI, routing, and bootstrap
- `apps/backend-mock`: dev-only mock backend
- `playground`: integration demos and Playwright e2e
- `packages/@core/*`: low-level shared foundation, UI kit, preferences, composables
- `packages/effects/*`: shared behavior, access, layouts, hooks, request, common UI
- `packages/{constants,icons,locales,preferences,stores,styles,types,utils}`: shared runtime libraries
- `internal/*`: workspace tooling and config packages
- `docs/src`: public VitePress docs site
- `docs/*.md`: durable project-state docs
- `scripts/*`: automation and release helpers

## Shared High-Conflict Files

- `package.json`
- `pnpm-workspace.yaml`
- `pnpm-lock.yaml`
- `openapi.yaml`
- `turbo.json`
- `.npmrc`
- `lefthook.yml`
- `eslint.config.mjs`
- `stylelint.config.mjs`
- `vitest.config.ts`
- `apps/backend-mock/**`
- `apps/web-antd/**`
- `packages/@core/**`
- `packages/effects/**`
- `docs/src/**`
- `docs/project_profile.md`
- `docs/architecture/**`
- `docs/planning/**`
- `docs/progress.md`
- `docs/worklog.md`
- `internal/**`

Only modify these when the active task explicitly authorizes it.

## Verification

See `docs/planning/verification.md` for the current command matrix.

Use the narrowest command that covers the touched boundary first. Escalate to `pnpm check` only when shared packages, tooling, or cross-app behavior changed.

The active backend API prefix on `main` is `/basic-api/*`; do not introduce `/auth-api/*`, `/user-api/*`, `/admin-api/*`, or `/common-api/*` unless this repo is on `monorepo`.

## Git Policy

- Check `git status --short --branch`, current branch/ref, and worktree list before editing.
- Do not overwrite existing dirty files unless the task explicitly targets them.
- Keep commits aligned with a single task boundary.
- Do not commit generated artifacts, lockfile churn, or unrelated user work.
- Push only when the user asks.

## Worktree And Subagent Discipline

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
