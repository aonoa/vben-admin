# Worklog

## 2026-05-06

- Scanned repository state, remotes, current branch, worktree list, package manifests, CI, and module layout.
- Assumed `vben-admin` is the active project for this bootstrap pass because the workspace contains a separate `base-server` repo.
- Recorded the current dirty-tree condition and the unresolved `pnpm-lock.yaml` merge as baseline risks.
- Chose to keep project-state docs under `docs/*.md` and treat `docs/src` as the public VitePress site.
- Deferred any source edits; only documentation and agent metadata were updated.
- Generated the project-specific Codex skill in the repository at `.codex/skills/vben-admin/`.
- Removed the user-level copy at `~/.codex/skills/vben-admin/`.
- Updated `.gitignore` so `.codex/skills/**` can be tracked while other `.codex` content stays ignored.
- Refreshed root coordination docs to separate monolithic `master/main` and microservice `monorepo/monorepo` version lines.
- Added the rule that feature additions, modifications, and refactors must assess both frontend and paired backend impact within the active version line.
- Folded the official Vben Admin skill reference from `https://github.com/vbenjs/skills` into the local project skill and project docs so app-layer work prefers framework primitives and documented conventions before bespoke abstractions.

## 2026-05-07

- Synced the generated frontend API client from the paired `base-server/master` OpenAPI output after adding site-message endpoints.
- Added handwritten site-message API wrappers under `apps/web-antd/src/api/system/` to normalize pagination/count fields and page-facing summary semantics.
- Added the message-center page under `apps/web-antd/src/views/_core/messages/` with inbox, mark-read, mark-all-read, publish, and recent-published flows.
- Replaced the static header bell placeholder data in `apps/web-antd/src/layouts/basic.vue` with backend-backed unread/list state and refresh synchronization.
- After user clarification, removed the frontend supplemental-route approach and aligned the frontend to the backend-managed `/messages` route supplied through database menu data.
- After the next product adjustment, changed the message page to route-based behavior so `/messages` stays inbox-only while `/system/site-message` exposes publish and management panels for `admin`/`root`.
- Reworked the `/system/site-message` management route so it shows publish records instead of an inbox and supports draft save, scheduled publish, direct publish, recall, and delete-pending actions.
- Fixed a publish-record tab switching bug by guarding the inbox/manage list loaders against stale async responses and by moving the manager tab state to a dedicated ref that forces list reload/remount on tab changes.
- Restyled the inbox and management message rows into separate cards with clearer hierarchy for title, summary, body, metadata, and actions.
- Removed the heavy inner frame around message body text so正文 reads as plain content with lighter spacing.
- Changed the management metadata label from "操作人" to "发布人" and stopped appending the user ID in display text.
- Added vertical spacing between message cards so adjacent records do not visually stick together.
- Removed the list divider line and card hover shadow so the message cards read as flat blocks.
- Restored a subtle hover state on message cards via color/border feedback only, without lift or shadow.
- Normalized backend role objects into `userStore.userRoles` and updated the access guard/store typings so backend-menu mode still works with the repeated `roles` contract.
- Added a site-message unread action in the inbox, wired to a new backend endpoint and unread-count refresh.
