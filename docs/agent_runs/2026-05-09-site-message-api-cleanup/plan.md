# Site Message API Cleanup

## Goal

Remove the legacy site-message audience fields from the paired frontend API layer after backend and persistence have already converged on all-user delivery only.

## Classification

- Level 3 public API change
- Active version line: `base-server/master` + `vben-admin/main`
- Frontend impact: yes
- Backend impact: yes

## Execution Notes

- The API cleanup touches generated outputs plus handwritten files, so this iteration is executed sequentially.
- No parallel child tasks are used because the repositories are already dirty and the affected files overlap the active site-message work.

## Requirements Update

- Generated frontend API models should no longer include `receiverType` or `receiverIds` for site-message management.
- Handwritten site-message wrappers and pages should no longer normalize or render those fields.

## Scope

- `openapi.yaml`
- `apps/web-antd/src/api/generated/**`
- `apps/web-antd/src/api/system/site-message.ts`
- `apps/web-antd/src/views/_core/messages/manage.vue`
- `docs/progress.md`
- `docs/worklog.md`

## Tasks

- [x] Record the API cleanup scope.
- [x] Sync regenerated OpenAPI/client outputs from the paired backend.
- [x] Remove handwritten wrapper/page references to the deleted audience fields.
- [x] Run targeted verification and update project docs.

## Verification

- [x] `make frontend-api` from the paired backend repo
- [x] `pnpm -C /home/mini/OpenSource/framework/vben-admin --filter @vben/web-antd exec vue-tsc --noEmit` (still fails on unrelated pre-existing repo issues outside the site-message files)

## Risks

- Repo-wide frontend typecheck still has unrelated existing failures outside the site-message files.

## Result

- The generated frontend API models no longer include `receiverType` or `receiverIds` for site-message management.
- The handwritten wrapper and manager page no longer normalize or render those fields.
