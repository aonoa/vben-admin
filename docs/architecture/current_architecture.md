# Current Architecture

## Major Modules

- This architecture describes the frontend `main` branch paired with the monolithic backend, not the `monorepo` microservice branch.
- `apps/web-antd`, `apps/web-antdv-next`, `apps/web-naive`, `apps/web-ele`, `apps/web-tdesign`: independently runnable frontend apps
- `apps/backend-mock`: local Nitro mock backend
- App-layer work in these apps should compose Vben Admin 5.0 route, menu, access, theme, locale, login, request, and component primitives before bespoke code.
- `packages/@core/*`: shared foundations, UI kit, preferences, composables, design primitives
- `packages/effects/*`: reusable app behavior, layouts, hooks, access control, request layer, and feature widgets
- `packages/{constants,icons,locales,preferences,stores,styles,types,utils}`: cross-app shared runtime packages
- `internal/*`: build, lint, tsconfig, Tailwind, and Vite tooling packages
- `docs/`: VitePress docs site under `docs/src`; bootstrap project docs live in `docs/*.md`
- `playground/`: integration playground and e2e surface
- `scripts/`: repo automation and release helpers

## Data Flow

1. Each app boots from its `src/main.ts` and app-local bootstrap code.
2. App code composes shared functionality from `packages/*`.
3. The local mock backend serves development data for frontend smoke checks.
4. `openapi.yaml` is the source contract for generated frontend API clients.
5. `playground` exercises cross-package behavior and e2e scenarios.
6. `docs/src` consumes shared packages for the public documentation site.

## External Integrations

- Vite for app builds and dev servers
- Turbo for monorepo task orchestration
- Vitest for unit tests
- Playwright for e2e tests
- VitePress for documentation
- Nitro for mock backend behavior
- OpenAPI generator for client code

## Public Contracts

- Workspace package names are published under `@vben/*` and `@vben-core/*`
- App-local alias imports use `#/*`
- `openapi.yaml` drives generated API client code
- Barrel exports are the public surface for most packages
- The active backend API prefix on this branch is `/basic-api/*`.

## Risks And Constraints

- Shared abstractions must stay framework-neutral because multiple UI libraries are supported
- Generated artifacts and the lockfile can overwrite manual edits
- `docs/` is dual-use: public docs site and bootstrap project-state docs
- Local mock backend behavior can drift from the real backend contract
