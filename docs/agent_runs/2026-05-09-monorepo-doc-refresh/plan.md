# Monorepo Doc Refresh

## Goal

Add missing project-level documentation for `vben-admin/monorepo` and refresh outdated references so the frontend repo can be navigated without relying on chat history.

## Classification

- Level 1 docs-only change
- Active version line: `base-server/monorepo` + `vben-admin/monorepo`
- Frontend impact: docs only
- Backend impact: paired-doc references only

## Scope

- `README.md`
- `docs/project/README.md`
- `docs/project/monorepo-overview.md`
- `docs/project/module-map.md`
- `docs/project/known-issues.md`

## Tasks

- [x] Record the current frontend runtime and API layering for the monorepo line.
- [x] Document dynamic menu generation and backend coupling.
- [x] Record the current page/module to backend-service mapping.
- [x] Record the existing `vue-tsc` failure set as known issues.
- [x] Link the new docs from the repository README.

## Verification

- [x] Manual consistency review of file paths, endpoint prefixes, and service names
- [x] `pnpm --dir /home/mini/OpenSource/framework/vben-admin --filter @vben/web-antd exec vue-tsc --noEmit` (fails on existing issues now documented in `docs/project/known-issues.md`)
