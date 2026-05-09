# Site Message DB Cleanup

## Goal

Align the frontend with the backend schema cleanup by treating site-message delivery as all-user only and no longer depending on legacy audience metadata.

## Classification

- Level 3 architecture/schema change
- Active version line: `base-server/master` + `vben-admin/main`
- Frontend impact: minimal, mostly compatibility cleanup
- Backend impact: yes

## Execution Notes

- The backend schema change is the primary task. The frontend only needs cleanup if generated API shapes or current wrappers still reference the removed storage fields.
- The repo is already dirty from the site-message iteration, so this is handled sequentially.

## Requirements Update

- The site-message management UI should not depend on legacy `receiver_type` or `receiver_ids` semantics.
- New compose flows remain all-user only.

## Scope

- `apps/web-antd/src/api/system/site-message.ts`
- `apps/web-antd/src/views/_core/messages/manage.vue`
- `docs/progress.md`
- `docs/worklog.md`

## Tasks

- [x] Record the schema cleanup requirement.
- [x] Remove any frontend dependence on legacy site-message audience fields if the backend shape changes. (No additional source edit was required; the current all-user-only UI already avoids the removed storage fields.)
- [x] Run targeted frontend verification if files change. (No frontend source change in this iteration.)
- [x] Update project docs.

## Verification

- [ ] `pnpm -C /home/mini/OpenSource/framework/vben-admin --filter @vben/web-antd exec vue-tsc --noEmit`

## Risks

- The repository already has unrelated typecheck failures outside the site-message area.

## Result

- No frontend source change was required for the database cleanup iteration.
- The current all-user-only site-message UI remains compatible with the paired backend after the legacy audience columns were removed.
