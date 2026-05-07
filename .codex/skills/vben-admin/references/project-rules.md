# Project Rules

These rules describe `vben-admin/main`, paired with the monolithic backend. For the microservice frontend, use `vben-admin/monorepo` together with `base-server/monorepo` and read the root coordination docs.

## Framework Conventions

- Treat Vben Admin 5.0 components, composables, layout patterns, and documented route, menu, access, theme, locale, login, and request flows as the default implementation surface for app-layer work.
- Use the official Vben skill reference at `https://github.com/vbenjs/skills` for framework-specific patterns and terminology.
- Prefer shared framework primitives and existing app patterns before creating bespoke abstractions. If a deviation is necessary, document the reason in the task handoff.

For feature additions, modifications, or refactors, treat `vben-admin/main` and `base-server/master` as one product. Inspect paired backend impact before frontend edits, and keep all contract/codegen/client updates inside this version line.

## Repository Areas

| Area | Paths | Notes |
| --- | --- | --- |
| Apps | `apps/web-antd`, `apps/web-antdv-next`, `apps/web-naive`, `apps/web-ele`, `apps/web-tdesign` | App-specific UI and bootstrap |
| Mock backend | `apps/backend-mock` | Development-only API surface |
| Playground | `playground` | Integration and e2e surface |
| Core foundation | `packages/@core/*` | Keep framework-neutral |
| Effects layer | `packages/effects/*` | Shared behavior and feature widgets |
| Shared libs | `packages/{constants,icons,locales,preferences,stores,styles,types,utils}` | Reusable runtime code |
| Tooling | `internal/*` | Workspace-wide configs and helpers |
| Public docs | `docs/src` | VitePress site content |
| Project docs | `docs/*.md` | Durable agent state |

## High-Conflict Files

- Root manifests and workspace config: `package.json`, `pnpm-workspace.yaml`, `pnpm-lock.yaml`, `openapi.yaml`
- Tooling config: `turbo.json`, `.npmrc`, `lefthook.yml`, `eslint.config.mjs`, `stylelint.config.mjs`, `vitest.config.ts`
- Shared blast-radius areas: `apps/backend-mock/**`, `apps/web-antd/**`, `packages/@core/**`, `packages/effects/**`, `internal/**`
- Docs and project state: `docs/src/**`, `docs/project_profile.md`, `docs/architecture/**`, `docs/planning/**`, `docs/progress.md`, `docs/worklog.md`

## Verification Ladder

1. Targeted app or package build.
2. Targeted unit or e2e check.
3. `pnpm lint` and the relevant static checks.
4. `pnpm check` when shared packages or tooling changed.

The active API prefix on `main` is `/basic-api/*`; microservice prefixes belong to `monorepo`.

For full-stack feature verification, add the paired backend command that covers the affected user flow. If no backend verification is required, record why.

## Parallel Execution Policy

- Safe: disjoint app/package/doc edits with non-overlapping write paths.
- Unsafe: lockfile, workspace, OpenAPI, or global config changes mixed with feature work.
- Always verify after each merge or child-worktree integration.
