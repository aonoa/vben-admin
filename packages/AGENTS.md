# packages/ — Shared Library Packages

**Parent:** [Root AGENTS.md](../AGENTS.md)

## OVERVIEW

Shared packages consumed by all apps. ~40 packages organized by domain.

## STRUCTURE

```
packages/
├── @core/           # Core framework (base, ui-kit, preferences, composables)
│   ├── base/       # shared, icons, types
│   ├── ui-kit/     # popup-ui, shadcn-ui, antd-ui, ele-ui, naive-ui, tdesign-ui
│   ├── preferences/
│   └── composables/
├── effects/        # Business logic hooks
│   ├── hooks/      # Router, auth, web, utils
│   ├── layouts/    # Layout widgets
│   ├── plugins/    # vxe-table, access
│   └── common-ui/  # auth forms, user dropdown
├── constants/     # Enum definitions
├── icons/         # Icon library (svg icons)
├── locales/       # i18n (Chinese, English, Japanese)
├── preferences/   # Theme preferences plugin
├── stores/        # Pinia stores (user, lock, router)
├── styles/        # Global SCSS
├── types/         # Shared TypeScript types
└── utils/         # General utilities
```

## WHERE TO LOOK

| Task | Location |
|------|----------|
| Add utility | `packages/utils/src/` |
| Add store | `packages/stores/src/modules/` |
| Add UI component | `packages/@core/ui-kit/*/src/` |
| Add hook | `packages/effects/hooks/src/` |
| Add types | `packages/types/src/` |

## CONVENTIONS

- **ESM only**: All packages have `"type": "module"`
- **Build**: `pnpm unbuild` — do NOT use tsup/vite-plugin-dts
- **Exports**: Use barrel exports (`*/index.ts`)
- **Naming**: `@vben/*` or `@vben-core/*` namespace
- **Peer deps**: Vue must be peerDependency, not devDependency
- **Tests**: Co-located `__tests__/*.test.ts`

## ANTI-PATTERNS

- **DO NOT** add business logic to `@core` packages
- **DO NOT** use `as any` for type errors
- **DO NOT** mix i18n keys — use separate locale files
- **Avoid** circular dependencies (run `pnpm check:circular`)
