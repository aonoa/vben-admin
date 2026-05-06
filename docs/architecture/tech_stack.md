# Tech Stack

## Selected Stack

| Area | Choice | Why |
| --- | --- | --- |
| Package manager | `pnpm` | Workspace-aware, fast, enforced by `preinstall` |
| Monorepo runner | `Turbo` | Shared build/type/dev orchestration across many packages |
| Frontend runtime | Vue 3 + TypeScript | Matches repo conventions and shared package design |
| App bundler | Vite | Fast dev loop for each app |
| UI libraries | Ant Design Vue, Ant Design Vue Next, Naive UI, Element Plus, TDesign | The repo intentionally supports multiple frontend variants |
| State | Pinia | Shared across apps and packages |
| Routing | Vue Router | Standard route-based admin architecture |
| Unit tests | Vitest + happy-dom | Lightweight component and package tests |
| E2E | Playwright | Used by the playground and full-flow checks |
| Docs | VitePress | Public docs site under `docs/src` |
| Mock backend | Nitro | Local API simulation for frontend development |

## Rejected Alternatives

- npm or Yarn: less aligned with the workspace tooling already in place
- Single-framework app structure: would remove the repo’s multi-UI value
- Hand-written API clients: `openapi.yaml` already exists as a generation contract
- A separate docs system: VitePress is already wired into the repo

## Operational Assumptions

- Node must satisfy `^20.19.0 || ^22.18.0 || ^24.0.0`
- pnpm must satisfy `>=10.0.0`
- `preinstall` enforces pnpm-only usage
- `pnpm-lock.yaml` is a high-conflict file and must be resolved before release work
- Generated files under API, docs, or package build outputs are not edited by hand
