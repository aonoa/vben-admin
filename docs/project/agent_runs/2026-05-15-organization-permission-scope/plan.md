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

## Follow-up 2026-05-15 Console Error Fix

- User feedback: the browser console still had many errors/warnings and must be checked directly.
- Change level: Level 1 bug fix.
- Scope:
  - Fix the organization action column Vue runtime warning caused by applying `v-show` directly to `a-popconfirm`, which has a non-element component root.
  - Fix `Live2D.vue` runtime errors caused by the idle timer continuing to call motion APIs after the model or motion manager is not playable.
- Frontend result:
  - `a-popconfirm` is now wrapped by a real `span` that owns `v-show`, so the Popconfirm component no longer receives a runtime directive.
  - `Live2D.vue` now clears the idle interval on unmount, guards motion calls behind a live motion manager check, stops motions through the motion manager, catches rejected motion promises, and avoids attaching a model after async load if the component has already unmounted.
- Backend impact: none. This was browser runtime behavior only; no API contract or backend behavior changed.
- Verification:
  - `pnpm exec oxfmt --write apps/web-antd/src/views/system/organization/index.vue apps/web-antd/src/adapter/component/Live2D.vue` passed.
  - `pnpm exec vitest run --dom apps/web-antd/src/api/system/organization-payload.test.ts apps/web-antd/src/views/system/organization/helpers.test.ts` passed with 2 files and 12 tests.
  - Playwright opened `http://127.0.0.1:5666/system/organization` with a real `vben / 123456` login token and recorded zero `console.warn`, zero `console.error`, zero `pageerror`, and zero 4xx/5xx responses.
  - A second Playwright pass waited 12.5 seconds to cover the first Live2D idle animation interval and again recorded zero browser warnings/errors and zero failed responses.
  - `git diff --check -- apps/web-antd/src/views/system/organization/index.vue apps/web-antd/src/adapter/component/Live2D.vue` passed.

## Follow-up 2026-05-15 Platform Organization Context

- User feedback: while switched to the `test` organization, seeing other organizations and modifying their permission scope is not reasonable.
- Decision:
  - `root` remains a global authorization role for gateway-level API allow/deny.
  - Platform organization management is only active when the user's current organization is the default organization and the user has the `root` role in that default organization.
  - Business organization context, such as `test`, is not a platform-management context even for root users.
- Backend result:
  - Organization list outside the default organization context is scoped to the current organization only.
  - `can_manage_organizations` is returned only for default-organization root context.
  - Organization create/update/delete and organization permission-scope save require default-organization root context.
  - Direct permission-scope writes for another organization while current organization is `test` are rejected server-side.
- Frontend result:
  - Organization management buttons now rely only on backend `can_manage_organizations`; frontend no longer treats local `root` role as a display fallback.
  - Member drawer no longer depends on the organization list exposing the default organization. It loads the default organization from `/admin-api/v1/my/organizations`, then reads default members for the "全部成员" source.
- Verification:
  - `go test ./app/admin/service/internal/biz ./app/admin/service/internal/data ./app/auth/service/internal/biz ./pkg/authx -count=1` passed.
  - `pnpm exec vitest run --dom apps/web-antd/src/api/system/organization-payload.test.ts apps/web-antd/src/views/system/organization/helpers.test.ts apps/web-antd/src/views/system/user/helpers.test.ts apps/web-antd/src/router/guard.test.ts` passed with 4 files and 20 tests.
  - Local API verification with `vben / 123456`:
    - Default organization context returned all organizations and `can_manage_organizations:true`.
    - `test` organization context returned only `test` and `can_manage_organizations:false`.
    - Saving the default organization's permission scope while current organization was `test` returned an error.
  - Playwright opened `/system/organization` in `test` organization context and confirmed the page shows `test`, does not show `默认组织`, does not show `新增`, does not show `权限范围`, and recorded zero browser warnings/errors and zero failed responses.
  - `git diff --check` passed for the touched backend/frontend files.
