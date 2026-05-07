# Project Profile

## Identity

- Repository: `vben-admin`
- Project type: Vue 3 admin monorepo
- Stack: pnpm workspaces, Turbo, Vite, TypeScript
- UI coverage: Ant Design Vue, Ant Design Vue Next, Naive UI, Element Plus, TDesign
- Supporting apps: `docs` (VitePress), `playground` (Playwright), `backend-mock` (Nitro)

## Current State

- Branch: `main`
- Baseline commit: `f573228bb1f55a30999e651962281899ff7e4189`
- Remotes: `origin` points to `git@github.com:aonoa/vben-admin.git`; `up` points to upstream `vbenjs/vue-vben-admin`
- Worktree: single worktree at the repo root
- Git status: dirty working tree with broad in-flight edits and an unresolved `pnpm-lock.yaml` merge
- Version line: this document describes the frontend on `main`; the microservice frontend lives on the separate `monorepo` branch.

## Sibling Version Line

- Monolithic pairing: `base-server/master` + `vben-admin/main`
- Microservice pairing: `base-server/monorepo` + `vben-admin/monorepo`
- Shared coordination docs live one directory above this repo in `../REPO_STRUCTURE.md` and `../STARTUP_AND_INTEGRATION.md`
- `main` uses `/basic-api/*`; `monorepo` uses `/auth-api/*`, `/user-api/*`, `/admin-api/*`, and `/common-api/*`.
- Feature additions, modifications, and refactors must be evaluated as full-stack work against the paired backend branch, even when the code change is ultimately frontend-only.

## Goal

Provide a reusable admin template with multiple UI-framework variants, shared packages, docs, and a local mock backend for development and demos.

## Target Users

- Frontend maintainers
- Feature developers working in one app or one package
- Docs contributors
- QA / e2e authors using the playground

## Core Workflows

- Run one app locally with `pnpm dev:<app>`
- Change shared packages and reuse them across apps
- Prefer Vben Admin 5.0 primitives and documented patterns for routes, menus, permissions, theme, locale, login, and request wiring before creating custom app abstractions
- Regenerate API client code from `openapi.yaml`
- Check paired backend API contracts, handlers, business logic, data schema, auth/RBAC, upload/SSE, and config whenever frontend behavior depends on them
- Build docs and playground artifacts
- Run unit, type, lint, circular-dependency, and e2e checks before handoff

## Non-Goals

- No monolithic single-app rewrite
- No direct business logic inside foundational `@core` packages
- No bypassing workspace tooling with ad hoc package management

## Success Criteria

- App builds stay green for the affected framework target
- Shared package changes do not break unrelated apps
- Generated files are not edited by hand
- Project state lives in repository docs, not chat
- Frontend and backend impact are both reported for feature work
