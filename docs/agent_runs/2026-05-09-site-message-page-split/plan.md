# Site Message Page Split

## Goal

Split site-message inbox and management into separate pages and remove the user-facing summary field from the frontend experience.

## Classification

- Level 2 feature increment
- Active version line: `base-server/master` + `vben-admin/main`
- Frontend impact: yes
- Backend impact: yes, paired menu component data must target the new page files

## Scope

- `apps/web-antd/src/views/_core/messages/*`
- `apps/web-antd/src/api/system/site-message.ts`
- `apps/web-antd/src/layouts/basic.vue`
- `docs/progress.md`
- `docs/worklog.md`
- Paired backend built-in menu bootstrap in `base-server/internal/biz/base.go`

## Requirements Update

- `/messages` is a dedicated inbox page file.
- `/system/site-message` is a dedicated management page file.
- The pages must no longer branch their primary layout off the route at runtime.
- Summary is removed from compose validation, compose inputs, row cards, and bell preview text.
- Existing backend API contracts remain unchanged for this iteration; the frontend should send the internal category default instead of exposing summary input.

## Tasks

- [x] Record the requirement change and verification strategy.
- [x] Split the shared page into separate inbox and manage Vue files.
- [x] Keep shared types/helpers in the existing API wrapper where practical.
- [x] Remove summary display/input semantics from inbox, manager, and notification list.
- [x] Run targeted frontend verification and update project docs.

## Verification

- [x] `pnpm -C /home/mini/OpenSource/framework/vben-admin --filter @vben/web-antd exec vue-tsc --noEmit` (fails on unrelated pre-existing repo issues in copilot, generated request, dashboard, and existing form modal typings)

## Risks

- Dynamic backend-menu routing depends on persisted component paths matching real files under `src/views`.
- The repo still has unrelated broad typecheck failures outside the touched files, so compile-level verification remains partially blocked by pre-existing errors.

## Result

- Site-message inbox and management are now implemented in separate files: `/_core/messages/inbox` and `/_core/messages/manage`.
- The old shared `index.vue` compatibility page was removed; only `/_core/messages/inbox` and `/_core/messages/manage` remain as routable page components.
- Summary was removed from manager compose validation, manager/inbox cards, and notification bell preview text; the frontend now sends the backend default category instead of exposing a summary field.
- After the follow-up correction, the frontend no longer performs role-based gating for the manager page; visibility and access are expected to come only from backend menu data plus backend API authorization.
