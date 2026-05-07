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
- User-role normalization now accepts backend role objects so access checks and route-mode gating stay stable after the backend role-contract fix
- Inbox items can now be marked back to unread, and the unread badge refreshes from the backend count again

## Active Blockers

- No project blocker from the bootstrap itself
- Existing dirty-tree state and `pnpm-lock.yaml` merge conflict remain an external WIP condition
- Full `pnpm -F @vben/web-antd run typecheck` still fails because of multiple pre-existing repository errors outside the site-message files

## Next Planned Iteration

- Keep future implementation work document-driven
