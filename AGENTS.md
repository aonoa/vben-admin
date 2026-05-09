# vben-admin — Agent notes

## What this repo is

- Vue 3 + Vite + TypeScript workspace based on Vben Admin.
- The active product app in this workspace is `apps/web-antd`.
- On the active microservice version line, `apps/web-antd` talks to gateway `:8000` through the Vite `/api` proxy.

## Read first

- `README.md`
- `docs/project/README.md`
- `docs/project/monorepo-overview.md`
- `docs/project/module-map.md`
- `docs/project/known-issues.md`

## Where to change things

- `apps/web-antd/src/api/core/**` — auth, user, menu, upload
- `apps/web-antd/src/api/system/**` — admin/common-facing management APIs
- `apps/web-antd/src/api/generated/**` — generated OpenAPI client (**do not edit generated files casually**)
- `apps/web-antd/src/router/**` — guards, dynamic menu generation, access handling
- `apps/web-antd/src/views/**` — page views
- `apps/web-antd/src/layouts/**` — app shell
- `packages/**` — shared Vben framework packages
- `internal/**` — build, lint, and vite config

## Runtime routing model

- Browser requests `/api/*`
- Vite proxies `/api` to `http://localhost:8000`
- Gateway routes by service prefix:
  - `/auth-api/v1/*`
  - `/user-api/v1/*`
  - `/admin-api/v1/*`
  - `/common-api/v1/*`

Do not assume the old monolith `/basic-api/*` prefixes on the `monorepo` branch.

## Menu and access model

- The app is not using a purely static menu.
- Current-user menus come from `/admin-api/v1/menus/current`.
- `src/router/access.ts` maps backend menu definitions to local `views/**/*.vue` files.
- When adding a page, check both the frontend component path and the backend menu data/component mapping.

## Generated code boundaries

- `apps/web-antd/src/api/generated/**` — regenerated from `openapi.yaml`
- `openapi.yaml` — synced from the paired backend repo via `make frontend-api`

## Common commands

- App dev server: `pnpm dev:antd`
- App typecheck: `pnpm --filter @vben/web-antd exec vue-tsc --noEmit`
- API generation: `pnpm run generate:api`

## Repo-specific gotchas

- `web-antd` is the project app; other UI apps are mostly upstream/demo variants.
- The current `monorepo` line has documented pre-existing `vue-tsc` failures; see `docs/project/known-issues.md`.
- If the backend contract changes, sync `openapi.yaml`, regenerate client code, then fix handwritten wrappers and call sites together.
