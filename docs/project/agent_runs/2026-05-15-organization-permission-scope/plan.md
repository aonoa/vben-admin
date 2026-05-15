# Organization Permission Scope UI

Date: 2026-05-15

## Scope

- Active version line: `base-server/monorepo` + `vben-admin/monorepo`.
- Change level: Level 2 feature increment.
- Goal: expose organization permission-scope management and make role permission assignment follow the current organization's permission catalog.

## Frontend Change

- `src/api/system/organization.ts` now wraps organization permission-scope and permission-catalog generated APIs.
- `src/api/system/organization-payload.ts` normalizes permission-scope payloads and avoids duplicate response/request field shapes.
- `src/views/system/organization/modules/permission-scope-drawer.vue` adds a side drawer for selecting an organization's allowed menus and API resources.
- `src/views/system/organization/index.vue` only shows create/edit/delete and `权限范围` actions to the bootstrap platform root user; organization admins keep the member-management entry.
- `src/views/system/role/modules/form.vue` loads `permission-catalog/current` every time the role drawer opens, so role menus/API resources match the active organization scope.

## Backend Coupling

- Backend APIs are provided by `base-server/monorepo` admin service:
  - `GET /admin-api/v1/organizations/{organization_id}/permission-scope`
  - `PUT /admin-api/v1/organizations/{organization_id}/permission-scope`
  - `GET /admin-api/v1/permission-catalog/current`
  - `GET /admin-api/v1/organizations/{organization_id}/permission-catalog`
- The organization permission-scope drawer uses global menu/resource APIs as the selectable source, so an already narrowed organization can still be expanded.
- The role form uses the current permission catalog, not global menu/resource APIs.
- Backend also enforces that only bootstrap root can mutate organization master data or update organization permission scope; frontend button visibility is only a UX guard.

## Verification

- `pnpm exec oxfmt --write apps/web-antd/src/api/system/organization.ts apps/web-antd/src/api/system/organization-payload.ts apps/web-antd/src/api/system/organization-payload.test.ts apps/web-antd/src/views/system/organization/index.vue apps/web-antd/src/views/system/organization/modules/permission-scope-drawer.vue apps/web-antd/src/views/system/organization/schemas/index.ts apps/web-antd/src/views/system/role/modules/form.vue` passed.
- `pnpm exec vitest run --dom apps/web-antd/src/api/system/role-payload.test.ts apps/web-antd/src/api/system/organization-payload.test.ts apps/web-antd/src/views/system/organization/helpers.test.ts apps/web-antd/src/views/system/user/helpers.test.ts apps/web-antd/src/router/guard.test.ts` passed with 5 files and 20 tests.
- `pnpm --filter @vben/web-antd exec vue-tsc --noEmit --skipLibCheck --pretty false` still fails on existing known issues from `docs/project/known-issues.md`; no final error references the new permission-scope files or the touched role form.
- `git diff --check -- apps/web-antd/src/api/system/organization.ts apps/web-antd/src/api/system/organization-payload.ts apps/web-antd/src/api/system/organization-payload.test.ts apps/web-antd/src/views/system/organization/index.vue apps/web-antd/src/views/system/organization/modules/permission-scope-drawer.vue apps/web-antd/src/views/system/organization/schemas/index.ts apps/web-antd/src/views/system/role/modules/form.vue` passed.

## Risks

- Browser-level manual verification is still recommended for the drawer tree selection behavior and scoped role form refresh after switching organizations.
