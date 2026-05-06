# Verification

## Setup

```bash
corepack enable
pnpm install
```

## Build

```bash
pnpm build
pnpm build:antd
pnpm build:naive
pnpm build:ele
pnpm build:tdesign
pnpm build:play
pnpm build:docs
```

## Tests

```bash
pnpm test:unit
pnpm test:e2e
```

## Static Checks

```bash
pnpm lint
pnpm check:type
pnpm check:dep
pnpm check:circular
pnpm check:cspell
pnpm check
```

## Manual Smoke Checks

```bash
pnpm dev:antd
pnpm dev:naive
pnpm dev:ele
pnpm dev:tdesign
pnpm dev:play
pnpm dev:docs
```

## Verification Policy

- Prefer the narrowest command that covers the touched boundary first.
- If shared packages or tooling change, run a wider check set before handoff.
- If generated artifacts change, rerun the relevant build or generation command rather than editing output files directly.
- For feature additions, modifications, or refactors, include the paired backend verification that covers the affected user flow when API contracts, auth, data fields, permissions, upload, or SSE behavior can be affected.
- If only frontend verification is required, state why the paired backend does not need a code or verification change.
