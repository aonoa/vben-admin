# Risk Register

| ID | Risk | Impact | Mitigation |
| --- | --- | --- | --- |
| R1 | Dirty working tree with broad in-flight edits and an unresolved `pnpm-lock.yaml` merge | High | Do not modify unrelated files; keep bootstrap docs isolated from source changes |
| R2 | Multiple UI frameworks share the same core packages | High | Run app-specific builds plus shared-package checks after touching `@core` or `effects` |
| R3 | Generated artifacts can be overwritten by codegen | High | Edit sources only; regenerate outputs from the documented command |
| R4 | `pnpm-workspace.yaml` and lockfile are high-conflict files | High | Treat workspace and dependency edits as explicit, isolated tasks |
| R5 | `docs/` has two roles: public docs site and project-state docs | Medium | Keep `docs/src` and `docs/*.md` separate in intent and review |
| R6 | Mock backend can drift from the real backend contract | Medium | Validate API-shape changes against `openapi.yaml` and app smoke tests |
| R7 | Tooling packages under `internal/*` affect every package | High | Change them only with broad verification and clear rollback boundaries |
| R8 | Monolith and microservice API prefixes can be mixed accidentally | High | Keep `main` paired with `base-server/master`; use `monorepo` only with `base-server/monorepo` |
| R9 | Frontend-only changes can silently diverge from backend contracts or permissions | High | Treat feature work as full-stack; check paired backend contracts, auth/RBAC, data shape, and targeted backend verification |

## Open Items

- The workspace still contains stale or unused package globs in `pnpm-workspace.yaml`; they should be reviewed before large dependency work.
- The current dirty tree means bootstrap docs describe the repository state, not a clean release baseline.
