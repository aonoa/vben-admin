# Site Message Remove Targeted Users

## Goal

Remove the targeted-user compose experience from the site-message management page and align new message submission with all-user delivery only.

## Classification

- Level 2 feature increment
- Active version line: `base-server/master` + `vben-admin/main`
- Frontend impact: yes
- Backend impact: yes

## Git And Execution Notes

- The active site-message work is already in progress in both repositories.
- Automatic parallel child execution is skipped because the worktrees are dirty and the frontend/backend changes overlap the same feature area.
- This iteration will be implemented sequentially and verified after both sides are updated.

## Requirements Update

- Compose no longer exposes a "specified users" audience option.
- New site-message drafts, scheduled tasks, and immediate publishes are always submitted as all-user messages.
- Management history may still contain old targeted-user records from earlier behavior, but no new targeted-user records should be created from this iteration onward.

## Scope

- `apps/web-antd/src/views/_core/messages/manage.vue`
- `apps/web-antd/src/api/system/site-message.ts`
- `docs/progress.md`
- `docs/worklog.md`
- paired backend normalization/tests/docs in `base-server/master`

## Tasks

- [x] Record the requirement change and verification plan.
- [x] Remove targeted-user form controls, list loading, and payload shaping from the manager page.
- [x] Keep publish records readable for historical targeted-user data without preserving the compose path.
- [x] Run targeted verification and update project docs.

## Verification

- [x] `pnpm -C /home/mini/OpenSource/framework/vben-admin --filter @vben/web-antd exec vue-tsc --noEmit` (still fails on unrelated pre-existing repo issues in copilot, generated request, dashboard, and existing modal typings)
- [x] paired backend tests in `base-server/master`

## Risks

- Repo-wide frontend typecheck still has pre-existing failures outside the changed site-message files.
- Historical targeted-user records remain visible in publish history until a separate data-cleanup iteration is requested.

## Result

- The management page no longer exposes targeted-user compose controls and always submits all-user messages.
- Historical targeted-user publish records remain readable in the record list without preserving the removed compose flow.
- The paired backend now ignores targeted-user audience input for new mutations, so frontend and backend behavior stay aligned.
