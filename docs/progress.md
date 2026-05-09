# Progress

## Current Status

- Repository scan completed
- Bootstrap documents created for project state, architecture, boundaries, verification, and risks
- Project-specific skill has been generated in the repository at `.codex/skills/vben-admin/`
- Official Vben Admin skill guidance has been folded into the local skill and project docs so app-layer work prefers framework primitives and documented conventions before bespoke abstractions
- Root coordination docs now separate monolithic `master/main` and microservice `monorepo/monorepo` version lines
- Source code changes were not touched during the bootstrap pass
- Full-stack feature work is now documented as the default rule for changes in the paired frontend/backend version line
- `web-antd` now has a site-message center page, handwritten site-message API wrappers, and a backend-backed header bell integration for the monolithic line
- Message-center page now assumes the route is supplied by backend menu data at `/messages`, not by a frontend-only supplemental route
- The site-message page now supports dual route modes: hidden inbox-only `/messages` for ordinary users and visible `/system/site-message` management mode for `admin`/`root`
- The management mode now renders publish records with draft/schedule/publish/recall/delete-pending actions instead of an inbox
- Site-message inbox and manager now live in separate Vue files with independent routes and no shared compatibility page
- User-role normalization now accepts backend role objects so access checks and route-mode gating stay stable after the backend role-contract fix
- Inbox items can now be marked back to unread, and the unread badge refreshes from the backend count again
- Site-message summary is no longer a user-visible field in compose, card display, or bell previews
- Site-message management page code no longer checks frontend roles; access now depends on backend-provided menus and backend-enforced API permission only
- Site-message management now only supports all-user compose; the targeted-user selection path has been removed from the frontend flow
- The paired backend schema cleanup removed legacy audience columns, and the frontend remains compatible because the compose flow already no longer depends on them
- The paired backend/frontend API layer no longer carries `receiverType` or `receiverIds` in generated or handwritten site-message management code

## Active Blockers

- No project blocker from the bootstrap itself
- Existing dirty-tree state and `pnpm-lock.yaml` merge conflict remain an external WIP condition
- Full `pnpm -F @vben/web-antd run typecheck` still fails because of multiple pre-existing repository errors outside the site-message files

## Next Planned Iteration

- Keep future implementation work document-driven
