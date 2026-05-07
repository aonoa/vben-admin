# Module Boundaries

| Area | Paths | Responsibility | Notes |
| --- | --- | --- | --- |
| Web apps | `apps/web-antd`, `apps/web-antdv-next`, `apps/web-naive`, `apps/web-ele`, `apps/web-tdesign` | App-specific UI, routing, bootstrap, and feature composition | Keep app-only logic out of shared packages |
| Mock backend | `apps/backend-mock` | Local Nitro API for development and demos | Treat as a dev-only contract surface |
| Playground | `playground` | Integration demos and Playwright e2e surface | Good place for cross-package smoke checks |
| Core foundation | `packages/@core/*` | Shared design primitives, UI kit, preferences, composables | Highest blast radius; avoid app-specific logic |
| Effects layer | `packages/effects/*` | Shared behavior, access, layouts, hooks, request, common UI | Depends on core packages, not on app code |
| Shared runtime libs | `packages/{constants,icons,locales,preferences,stores,styles,types,utils}` | Cross-app runtime code and data | Safe reuse layer for most features |
| Tooling packages | `internal/*` | Vite, lint, Tailwind, tsconfig, node utilities | Changes can affect every package |
| Documentation site | `docs/src` | Public VitePress docs | Separate from bootstrap docs |
| Bootstrap docs | `docs/project_profile.md`, `docs/architecture/*`, `docs/planning/*`, `docs/progress.md`, `docs/worklog.md` | Durable project state for agents | Keep these updated before relying on changed decisions |
| Scripts | `scripts/*` | Repo automation and release helpers | Verify before changing CI or build flows |

## Boundary Rules

- App code may depend on shared packages, but shared packages should not depend on app code.
- `packages/@core/*` should remain framework-agnostic and low-level.
- `packages/effects/*` can depend on `@core` and shared libs, but not on a specific app.
- In app-layer code, prefer Vben Admin 5.0 components, composables, and documented route, menu, access, theme, locale, login, and request patterns before bespoke abstractions; record intentional deviations in the handoff.
- Touch `internal/*` only when changing monorepo-wide tooling.
- Treat `docs/src` as user-facing content and `docs/*.md` as project-state records.
- Treat feature additions, modifications, and refactors as full-stack by default: inspect the paired `../base-server` branch for API/proto/OpenAPI contracts, service handlers, biz logic, data schema, auth/RBAC, upload/SSE behavior, config, and runtime behavior.
- If a frontend change does not require backend changes, document the reason in the handoff.
- Keep this full-stack analysis inside the active version line; `main` pairs with `base-server/master`, while `monorepo` pairs with `base-server/monorepo`.
