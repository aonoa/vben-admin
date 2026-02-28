# PROJECT KNOWLEDGE BASE

**Generated:** 2026-02-28
**Commit:** a12147095
**Branch:** (current)

## OVERVIEW

Vue 3 + Vite + TypeScript monorepo admin template. Supports 5 UI frameworks (Antd, Naive UI, Element Plus, TDesign). pnpm workspaces + Turbo build.

## STRUCTURE

```
./
├── apps/              # 6 web apps (@vben/web-*)
├── packages/          # Shared packages
│   ├── @core/         # Core framework (~12 packages)
│   ├── effects/       # Side-effect packages (6)
│   ├── constants/    # Constants
│   ├── icons/        # Icon library
│   ├── locales/      # i18n
│   ├── preferences/  # Theme/preferences
│   ├── stores/        # Pinia stores
│   ├── styles/        # Global styles
│   ├── types/         # TypeScript types
│   └── utils/         # Utilities
├── internal/          # Build tooling (lint, vite, tailwind configs)
├── docs/              # Documentation (VitePress)
├── playground/        # Testing playground
└── scripts/           # Build/deploy scripts
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Add new app | `apps/` | Copy from existing web-* app |
| Add shared utility | `packages/utils/src/` | Follow barrel export pattern |
| Add Pinia store | `packages/stores/src/modules/` | Follow `*.test.ts` pattern |
| UI components | `packages/@core/ui-kit/` | Multiple UI framework support |
| Router/Auth | `packages/effects/hooks/src/` | Composable functions |
| Config change | `internal/` | @vben/* config packages |
| Tests | `__tests__/` | Co-located with source |

## CODE MAP

| Symbol | Type | Location | Notes |
|--------|------|----------|-------|
| main.ts | entry | apps/*/src/ | App bootstrap |
| bootstrap.ts | fn | apps/*/src/ | Vue init |
| app.vue | component | apps/*/src/ | Root component |

## CONVENTIONS

- **2-space indent**, single quotes, max 100 chars
- **ESM only**: `"type": "module"` in all packages
- **Build**: `pnpm unbuild` for packages
- **Naming**: `@vben/*` for packages, `@vben-core/*` for core
- **Tests**: `*.test.ts` (unit), `*.spec.ts` (e2e)
- **Barrel exports**: `*/index.ts` for public APIs
- **pnpm catalog**: Centralized deps in `pnpm-workspace.yaml`

## ANTI-PATTERNS (THIS PROJECT)

- **DO NOT cache HTML** — Prevents cache issues after updates
- **DO NOT modify default config** — Use `overridesPreferences()` instead
- **DO NOT mix business i18n** — Keep business translations separate from `@vben/locales`
- **DO NOT set props/slots** with `connectedComponent` in modal/drawer
- **Avoid `as any`** — Type errors must be fixed properly

## UNIQUE STYLES

- Multi-UI framework support (antd, naive, ele, tdesign)
- Connected component pattern for modal/drawer state sharing
- Heavy barrel export usage (`*/index.ts`)
- Preferences plugin for theme/config persistence
- Dynamic router with permission system

## COMMANDS

```bash
pnpm dev              # Dev all apps
pnpm dev:antd         # Specific app
pnpm build            # Build all
pnpm test:unit        # Vitest
pnpm lint             # ESLint + Stylelint
pnpm check            # Full check (types, deps, circular)
pnpm commit           # Interactive commit (czg)
```

## NOTES

- Node >=20.19.0, pnpm >=10.0.0 required
- Apps proxy `/api` to `http://localhost:8000/basic-api`
- Uses `happy-dom` for unit tests (not jsdom)
- Changesets for versioning
