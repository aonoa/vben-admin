# apps/ — Web Applications

**Parent:** [Root AGENTS.md](../AGENTS.md)

## OVERVIEW

6 independently runnable Vue 3 applications. Each supports a different UI framework.

## APPS

| App | UI Framework | Entry |
|-----|--------------|-------|
| web-antd | Ant Design Vue | apps/web-antd/src/main.ts |
| web-antdv-next | Ant Design Vue Next | apps/web-antdv-next/src/main.ts |
| web-naive | Naive UI | apps/web-naive/src/main.ts |
| web-ele | Element Plus | apps/web-ele/src/main.ts |
| web-tdesign | TDesign Vue | apps/web-tdesign/src/main.ts |
| playground | Testing | playground/src/main.ts |

## APP STRUCTURE

Each app follows identical structure:

```
apps/{app-name}/
├── src/
│   ├── main.ts          # Entry point
│   ├── bootstrap.ts     # Vue initialization
│   ├── app.vue         # Root component
│   ├── router/         # App-specific routes
│   ├── views/         # Page components
│   ├── components/    # App-level components
│   └── env.d.ts       # Type declarations
├── vite.config.mts    # Vite configuration
├── tailwind.config.mjs
├── postcss.config.mjs
└── index.html
```

## WHERE TO LOOK

| Task | Location |
|------|----------|
| App entry | `apps/{app}/src/main.ts` |
| Vue setup | `apps/{app}/src/bootstrap.ts` |
| App routes | `apps/{app}/src/router/` |
| App views | `apps/{app}/src/views/` |

## COMMANDS

```bash
pnpm dev:antd         # Dev web-antd
pnpm dev:naive        # Dev web-naive
pnpm dev:ele          # Dev web-ele
pnpm dev:tdesign      # Dev web-tdesign
pnpm dev:play         # Dev playground
pnpm build:antd       # Build web-antd
```

## CONVENTIONS

- **2-space indent**, single quotes, max 100 chars
- **No cache** for HTML files
- **API proxy**: `/api` → `http://localhost:8000/basic-api`

## ANTI-PATTERNS

- **DO NOT modify** default preferences directly — use `overridesPreferences()`
- **DO NOT** add app-specific logic to shared packages
- **Avoid** directly importing UI framework components — use from `@vben-core/*-ui`
