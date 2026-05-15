# Organization Scoped User Management

Date: 2026-05-13

## Scope

- Active version line: `base-server/monorepo` + `vben-admin/monorepo`.
- Change level: Level 2 feature increment.
- Goal: the user management page follows the header's current organization.

## Behavior

- Default organization shows all users because backend keeps all users as default members.
- Switching to another organization makes the user list show only that organization's members.
- Creating a user creates the global user through `user` service, then explicitly adds the new user to the default organization and, when different, the current organization through `admin` organization-members API; the user's role binding includes the default organization's `default` role.
- Removing a user from the user management page still deletes the global user; organization membership editing remains on the organization management page.

## Verification

- Type/lint check for the touched frontend surface when available.
- Manual verification target: switch header organization, open `/system/user`, confirm rows match `/admin-api/v1/organizations/{id}/members`; create user in non-default org and confirm membership appears.

## Results

- `views/system/user/index.vue` now loads rows from current organization members, applies username/nickname/status/role filters within that member set, and paginates the filtered result.
- `views/system/user/add_modal.vue` now adds newly created users to the default organization and the current organization before saving role bindings, and merges the default organization's `default` role into the selected role IDs.
- Removing a row from a non-default organization removes the user from that organization. Removing from the default organization keeps the existing global delete behavior.
- `pnpm exec vitest run apps/web-antd/src/views/system/user/helpers.test.ts --dom` passed with 6 tests.
- `pnpm -F @vben/web-antd run typecheck` failed on known existing files from `docs/project/known-issues.md`; no error referenced the touched files.
- `git diff --check` passed in `vben-admin`.

## Risks

- Project-wide `vue-tsc` has known failures documented in `docs/project/known-issues.md`.
- Existing generated OpenAPI and organization work is already dirty; this task should only layer on top of it.

## Follow-up 2026-05-14

- Requirement refinement: organization member management should use the project's table component instead of the current checkbox list UI.
- Frontend change plan:
  - Keep existing organization member APIs unchanged.
  - Replace the member modal's custom list + pagination UI with a VXE table while preserving search, selection, default-organization read-only behavior, and save semantics.
- Backend change plan: none. Existing `/admin-api/v1/organizations/{organization_id}/members` read/write APIs already satisfy this UI refactor.
- Verification refinement: run a focused frontend type check on the touched file set if available, and record any pre-existing project-wide blockers.

## Follow-up 2026-05-14 Results

- Frontend code change:
  - `views/system/organization/index.vue` now renders organization members with the project's VXE table component instead of the custom checkbox list.
  - Member selection remains organization-wide across local pagination and search filtering.
  - Member search now refreshes the table immediately on input and clear, instead of waiting for the input `change` event.
  - Default organization remains read-only and still displays all visible rows as selected members.
- Backend code change: none. Existing organization members read/write APIs were reused without contract changes.
- Frontend verification:
  - `git diff --check -- apps/web-antd/src/views/system/organization/index.vue docs/project/agent_runs/2026-05-13-organization-user-scope/plan.md` passed.
  - `pnpm exec eslint apps/web-antd/src/views/system/organization/index.vue` passed.
  - `pnpm --filter @vben/web-antd exec vue-tsc --noEmit --pretty false` still hits project-wide known issues, but no `src/views/system/organization/**` or `src/api/system/organization.ts` errors were emitted after this iteration's local fixes.
- Residual risk:
  - This iteration did not add a component test for the modal table interaction. End-to-end confirmation in the browser is still recommended for checkbox behavior under real pagination and search input.

## Follow-up 2026-05-14 Requirement Change

- User feedback changed the member-management interaction:
  - The organization member entry should show both the full member source and the current organization's members at the same time.
  - Adding members should use the default organization's members as the source set.
  - Removing members should only affect the current organization membership.
  - A side drawer is acceptable for the interaction surface.
- Updated frontend change plan:
  - Replace the current single-table member modal with a side drawer.
  - Show `默认组织成员（全部成员）` and `当前组织成员` in separate table panels.
  - Keep backend contracts unchanged and persist the final current-organization member set through the existing save API.
- Updated backend change plan: none. Existing organization list + organization members read/write APIs still cover this requirement refinement.
- Updated verification target:
  - Focused lint/type checks for the touched organization drawer/page files.
  - Manual browser verification should confirm add/remove behavior between the source member table and the current-organization member table.

## Follow-up 2026-05-14 Requirement Change Results

- Frontend code change:
  - `views/system/organization/index.vue` now opens a dedicated member-management drawer instead of handling member editing inline.
  - `views/system/organization/modules/member-drawer.vue` shows `默认组织成员` and `当前组织成员` side by side with separate search, pagination, and bulk selection state.
  - Adding members now uses the default organization's member list as the source set; removing members only updates the current organization's member set.
  - Default organization remains read-only in the member-management drawer.
  - `views/system/organization/helpers.ts` extracts member normalization, filtering, pagination, and membership-set operations for targeted tests.
- Backend code change: none. Existing organization list + organization members APIs were reused without contract changes.
- Frontend verification:
  - `pnpm exec vitest run apps/web-antd/src/views/system/organization/helpers.test.ts --dom` passed with 5 tests.
  - `pnpm exec eslint apps/web-antd/src/views/system/organization/index.vue apps/web-antd/src/views/system/organization/modules/member-drawer.vue apps/web-antd/src/views/system/organization/helpers.ts apps/web-antd/src/views/system/organization/helpers.test.ts` passed.
  - `pnpm --filter @vben/web-antd exec vue-tsc --noEmit --pretty false` still has project-wide known issues, but no `src/views/system/organization/**` or `src/api/system/organization.ts` errors were emitted in the filtered output for this iteration.
- Residual risk:
  - This iteration still lacks browser-level verification for the drawer's add/remove flows and responsive layout.

## Follow-up 2026-05-14 Organization Order Fix

- Bug report:
  - Editing an organization and changing its order triggered `body unmarshal proto: ... duplicate field "order_no"`.
- Root cause:
  - The organization list/item objects in the frontend can simultaneously carry normalized camelCase fields such as `orderNo` and original response fields such as `order_no`.
  - The edit form previously received the full organization object and the update request also forwarded the full object, which allowed duplicate semantic fields into the JSON payload.
- Frontend fix:
  - `src/api/system/organization-payload.ts` now builds a strict mutation payload whitelist for organization create/update requests.
  - `src/api/system/organization.ts` now uses that whitelist for both create and update calls.
  - `src/views/system/organization/modules/form.vue` now also uses the same whitelist when seeding edit-form values.
- Backend change: none. This was a frontend request-payload bug.
- Verification:
  - `pnpm exec vitest run apps/web-antd/src/api/system/organization-payload.test.ts --dom` passed with 1 test.
  - `pnpm exec eslint apps/web-antd/src/api/system/organization.ts apps/web-antd/src/api/system/organization-payload.ts apps/web-antd/src/api/system/organization-payload.test.ts apps/web-antd/src/views/system/organization/modules/form.vue` passed.
  - `pnpm --filter @vben/web-antd exec vue-tsc --noEmit --pretty false` still has project-wide known issues, but no filtered output referenced the touched organization payload/form files in this fix iteration.

## Follow-up 2026-05-14 Single Table Member Interaction

- User feedback changed the member-management interaction again:
  - The organization member drawer should use one table instead of separate default/current tables.
  - The table should support filtering by `默认组织成员` and `当前组织成员`.
  - It should keep simple keyword search and multi-select add/remove actions.
- Frontend change:
  - `views/system/organization/modules/member-drawer.vue` now uses a single member table with:
    - scope filter: `全部成员` / `默认组织` / `当前组织`
    - keyword search by username/nickname/email
    - a membership status column for the current organization
    - multi-select `移入当前组织` / `移出当前组织`
  - `views/system/organization/helpers.ts` now includes scoped-row marking for the current organization state.
- Backend change: none. Existing APIs for default/current organization members were reused.
- Verification:
  - `pnpm exec vitest run apps/web-antd/src/views/system/organization/helpers.test.ts --dom` passed with 6 tests.
  - `pnpm exec eslint apps/web-antd/src/views/system/organization/modules/member-drawer.vue apps/web-antd/src/views/system/organization/helpers.ts apps/web-antd/src/views/system/organization/helpers.test.ts` passed.
  - `pnpm --filter @vben/web-antd exec vue-tsc --noEmit --pretty false` still has project-wide known issues; no filtered output should reference the touched organization helper/drawer files after this iteration.

## Follow-up 2026-05-14 Single Table Refinement

- User feedback refined the single-table behavior:
  - `全部成员` is exactly the default organization member set.
  - The scope filter should only contain `全部成员` and `当前组织`.
  - Search should use a single input with format-based matching:
    - contains `@`: email
    - `id:` / `uid:` prefix: user id
    - otherwise: nickname
  - In `全部成员`, only `移入当前组织` should be available.
  - In `当前组织`, only `移出当前组织` should be available.
- Frontend change:
  - `views/system/organization/modules/member-drawer.vue` now limits the scope filter to two options and shows only the action valid for the active scope.
  - `views/system/organization/helpers.ts` now parses the keyword into nickname/email/id modes for single-input search.
- Backend change: none.
- Verification:
  - `pnpm exec vitest run apps/web-antd/src/views/system/organization/helpers.test.ts --dom` passed with 6 tests.
  - `pnpm exec eslint apps/web-antd/src/views/system/organization/modules/member-drawer.vue apps/web-antd/src/views/system/organization/helpers.ts apps/web-antd/src/views/system/organization/helpers.test.ts` passed.
  - `pnpm --filter @vben/web-antd exec vue-tsc --noEmit --pretty false` still has project-wide known issues, but no filtered output referenced the touched organization drawer/helper files after this refinement.

## Follow-up 2026-05-14 Search Trigger Refinement

- User feedback refined member search behavior again:
  - Keyword search should also match `用户名`.
  - Typing in the input should not immediately filter rows.
  - Search should apply when pressing Enter, or when switching between `全部成员` and the current organization scope.
  - Clearing all text from the input should also trigger one empty search immediately.
- Frontend change:
  - `views/system/organization/modules/member-drawer.vue` now separates draft input text from the applied search keyword.
  - Pressing Enter applies the current input as the active filter, resets pagination, and clears the current selection.
  - Switching scope also applies the current input before reloading the visible member slice.
  - Clicking the clear icon or manually deleting the input down to an empty string both reapply an empty search immediately.
  - `views/system/organization/helpers.ts` now treats non-email/non-id keywords as nickname-or-username text search.
- Backend change: none.
- Verification:
  - `pnpm exec vitest run apps/web-antd/src/views/system/organization/helpers.test.ts --dom` passed with 6 tests.
  - `pnpm exec eslint apps/web-antd/src/views/system/organization/modules/member-drawer.vue apps/web-antd/src/views/system/organization/helpers.ts apps/web-antd/src/views/system/organization/helpers.test.ts` passed.
  - `git diff --check -- apps/web-antd/src/views/system/organization/modules/member-drawer.vue apps/web-antd/src/views/system/organization/helpers.ts apps/web-antd/src/views/system/organization/helpers.test.ts docs/project/agent_runs/2026-05-13-organization-user-scope/plan.md` passed.
  - `pnpm --filter @vben/web-antd exec vue-tsc --noEmit --pretty false | rg "src/views/system/organization/modules/member-drawer|src/views/system/organization/helpers"` returned no matches for the touched files; the underlying full type check still exits non-zero because of project-wide known issues from `docs/project/known-issues.md`.

## Follow-up 2026-05-14 Immediate Member Mutation

- User feedback changed the organization member mutation flow:
  - Removing members from the current organization should require a second confirmation.
  - The drawer should no longer rely on the bottom `保存成员` button.
- Frontend change:
  - `views/system/organization/modules/member-drawer.vue` now disables the drawer footer and removes the batch save button flow.
  - `移入当前组织` now saves immediately through the existing organization-members API.
  - `移出当前组织` now opens a confirmation dialog before saving immediately.
  - The drawer shows request-in-flight loading state while add/remove mutations are being persisted.
- Backend change: none. Existing save-members API is still reused, only the trigger timing changed.
- Verification:
  - `pnpm exec eslint apps/web-antd/src/views/system/organization/modules/member-drawer.vue` passed.
  - `git diff --check -- apps/web-antd/src/views/system/organization/modules/member-drawer.vue docs/project/agent_runs/2026-05-13-organization-user-scope/plan.md` passed.

## Follow-up 2026-05-14 Organization Role Cleanup

- User confirmed the expected behavior when a user is removed from an organization:
  - The user should lose that organization's role bindings.
  - If the removed organization was the current organization, the current organization should fall back to a valid remaining organization.
  - Department cleanup is desired too, but the current version line no longer has an active persisted user-department membership model to mutate.
- Backend change:
  - `sys_user_role_binding` is now treated as organization-scoped data via `organization_id`.
  - Organization member removal now clears the removed user's role bindings for that organization and then refreshes the auth permission snapshot.
  - Permission projection now sends admin roles/APIs in the `admin` service namespace and sends role-binding `organization_id` as auth `scope_id`, so gateway authorization can follow the current organization header.
  - If a user is removed from the organization that is currently marked as their active organization, the backend now switches them back to the default organization.
- Frontend change:
  - `requestClient` now sends `x-scope-id` from the current organization store on normal requests.
  - The organization store now persists `currentOrganizationId`.
  - User-role-binding API calls now pass `organizationId`.
  - User list and user edit modal now read/write roles for the current organization instead of mixing all organizations.
  - Organization member removal confirmation now explicitly states that the current organization's role permissions will also be cleared.
- Known limitation:
  - Department cleanup was not implemented in this iteration because the current microservice line has already removed the old `sys_user_dept_membership` persistence model, and `sys_user` itself does not carry an active department assignment field in use. A real department-following implementation needs a restored or redesigned user-department relation model first.
- Verification:
  - `make api ent` passed in `base-server`.
  - `make frontend-api` passed in `base-server`.
  - `go test ./app/admin/service/internal/biz ./app/admin/service/internal/data` passed in `base-server`.
  - `go test ./app/admin/service/...` passed in `base-server`.
  - `go test ./app/auth/service/internal/biz` passed in `base-server`.
  - `pnpm exec vitest run apps/web-antd/src/views/system/user/helpers.test.ts apps/web-antd/src/views/system/organization/helpers.test.ts --dom` passed with 12 tests in `vben-admin`.
  - `pnpm exec eslint apps/web-antd/src/api/request.ts apps/web-antd/src/store/organization.ts apps/web-antd/src/api/system/user-role-binding.ts apps/web-antd/src/views/system/user/index.vue apps/web-antd/src/views/system/user/add_modal.vue apps/web-antd/src/views/system/organization/modules/member-drawer.vue` passed in `vben-admin`.
  - `git diff --check -- ...` passed for the touched backend and frontend files.
  - `pnpm --filter @vben/web-antd exec vue-tsc --noEmit --pretty false | rg "src/api/request|src/store/organization|src/api/system/user-role-binding|src/views/system/user/index|src/views/system/user/add_modal|src/views/system/organization/modules/member-drawer"` produced no matches for the touched files; the full type check still exits non-zero because of project-wide known issues from `docs/project/known-issues.md`.

## Follow-up 2026-05-14 Department Linkage

- User confirmed the remaining gap should be fully closed:
  - Removing a user from an organization should also clear that organization's department assignment.
  - The current microservice line therefore needs an actual persisted user-department relation model again.
- Backend change plan:
  - Reintroduce an admin-owned `sys_user_dept_membership` table scoped by `organization_id`.
  - Add admin APIs to read/write/delete one user's department binding inside one organization.
  - Clear both role bindings and department bindings when organization members are removed.
  - Clear department bindings when a bound department is deleted.
  - Fix the current organization-scoped role-binding regression where creating a user in a non-default organization still mixes the default organization's `default` role into the current organization's binding request.
- Frontend change plan:
  - Add a current-organization department selector to the user modal.
  - Show the current organization's department on the user list.
  - Split new-user role binding writes into:
    - default organization `default` role
    - current organization selected roles
  - Persist department changes through the new admin user-dept-binding API.
- Verification target:
  - Regenerate backend proto/ent and frontend OpenAPI code in the microservice line.
  - Run focused backend tests for admin biz/data organization behavior.
  - Run focused frontend vitest/eslint checks for the touched user helpers/API/page files.

## Follow-up 2026-05-14 Department Linkage Results

- Backend code change:
  - `pkg/data/schema/user_dept_membership.go` reintroduces an admin-owned organization-scoped user-department binding table.
  - `admin.proto`, generated admin bindings, and admin service/biz/data layers now expose `Get/Upsert/DeleteUserDeptBinding`.
  - Organization member removal now clears both the removed organization's role bindings and department binding for that user.
  - Department deletion now clears any user-department bindings pointing at the deleted department before removing the department rows.
  - Migration/seed logic now creates and preserves `sys_user_dept_membership` instead of dropping it during startup cleanup.
  - `cleanupUserRoleBindingBeforeMigration` now deduplicates by `(user_id, role_id, organization_id)` when the scoped column already exists, preventing cross-organization binding loss during migration.
  - `UpsertUserRoleBinding` no longer auto-injects the default organization's `default` role into every organization-scoped binding request.
- Frontend code change:
  - `src/api/system/user-dept-binding.ts` adds the current-organization user-department binding API wrapper.
  - `views/system/user/add_modal.vue` now loads/saves the current organization's department binding and splits default-organization role bootstrap from current-organization role binding.
  - `views/system/user/schemas/index.ts` adds a current-organization department selector and makes role options resolve against the active organization explicitly.
  - `views/system/user/index.vue` now loads and shows the current organization's department name for each visible user row.
- Documentation change:
  - `base-server/docs/table-ownership.md` now records `sys_user_dept_membership` as admin-owned source-of-truth data.
  - `docs/project/module-map.md` now documents the user page's new department-binding API dependency.
- Verification:
  - `make api ent` passed in `base-server`.
  - `make frontend-api` passed in `base-server`.
  - `go test ./app/admin/service/internal/biz ./app/admin/service/internal/data` passed in `base-server`.
  - `go test ./app/admin/service/...` passed in `base-server`.
  - `go test ./app/auth/service/internal/biz` passed in `base-server`.

## Follow-up 2026-05-14 User List Department Removal

- Requirement refinement:
  - The user list should no longer display the department column.
- Change classification:
  - Level 1 local frontend change.
- Frontend change:
  - `views/system/user/schemas/index.ts` removes the `部门` column from the user list table.
  - `views/system/user/index.vue` stops fetching per-user current-organization department bindings for list rendering.
  - The user edit modal keeps its current-organization department selector and save behavior unchanged.
- Backend change:
  - None. This is only a list presentation change; the existing department-binding APIs are still needed by the user edit modal.
- Verification target:
  - Run focused lint on the touched user list files.
  - Run `git diff --check` for the touched frontend files and this iteration record.

## Follow-up 2026-05-14 User List Organization Fields

- Requirement refinement:
  - Because the user list is scoped to the currently selected organization, the list should show that organization's department and role information.
- Change classification:
  - Level 1 local frontend change.
- Frontend change:
  - `views/system/user/index.vue` restores current-organization department binding loading for the visible user list rows.
  - `views/system/user/schemas/index.ts` restores the `部门` table column.
  - The existing role column remains organization-scoped and unchanged.
- Backend change:
  - None. Existing organization-scoped role-binding and department-binding APIs already provide the required data.
- Verification target:
  - Run focused lint on the touched user list files.
  - Run `git diff --check` for the touched frontend files and this iteration record.

## Follow-up 2026-05-14 Organization Scope Bootstrap Fix

- Bug report:
  - After the recent organization-scoped user-list changes, the frontend could still fail at startup and appear to lose menu routes or related API access.
- Root cause:
  - `currentOrganizationId` is persisted locally and was being sent immediately as `x-scope-id` before the frontend revalidated that organization against the server.
  - If the cached organization id was stale, the first protected requests such as menu loading could run under an invalid scope and make the app look like its routes were gone.
- Frontend fix:
  - `src/api/request.ts` now only attaches `x-scope-id` after the current organization id has been validated against the loaded organization list.
  - `src/router/guard.ts` now loads the current user's organizations before generating dynamic menus/routes on first access bootstrap.
- Backend change:
  - None. Service routes remained available; the issue was frontend bootstrap state.
- Verification target:
  - Run focused lint on `src/api/request.ts` and `src/router/guard.ts`.
  - Run a frontend build to confirm the guarded bootstrap path still compiles.
  - `pnpm exec vitest run apps/web-antd/src/views/system/user/helpers.test.ts apps/web-antd/src/views/system/organization/helpers.test.ts --dom` passed with 12 tests in `vben-admin`.
  - `pnpm exec eslint apps/web-antd/src/api/core/user.ts apps/web-antd/src/api/system/user-role-binding.ts apps/web-antd/src/api/system/user-dept-binding.ts apps/web-antd/src/views/system/user/helpers.ts apps/web-antd/src/views/system/user/helpers.test.ts apps/web-antd/src/views/system/user/schemas/index.ts apps/web-antd/src/views/system/user/add_modal.vue apps/web-antd/src/views/system/user/index.vue` passed in `vben-admin`.
  - `git diff --check -- ...` passed for the touched backend and frontend files.
  - `pnpm --filter @vben/web-antd exec vue-tsc --noEmit --pretty false | rg "src/api/core/user|src/api/system/user-role-binding|src/api/system/user-dept-binding|src/views/system/user/helpers|src/views/system/user/schemas/index|src/views/system/user/add_modal|src/views/system/user/index"` produced no matches for the touched files; the underlying full type check still exits non-zero because of project-wide known issues from `docs/project/known-issues.md`.
- Residual risk:
  - User list department names are currently loaded with one binding request per visible row. Functionally correct, but if the page size grows substantially, batching this into a list API would be a better follow-up.

## Follow-up 2026-05-14 Refresh 404

- Bug report:
  - Refreshing a protected page could show the application's 404 fallback while the browser console had no obvious route-load error.
- Root cause:
  - The backend could return an empty current-user menu tree when the current organization had no explicit user-role binding.
  - The frontend menu API wrapper was typed as returning a raw array even though the actual response shape is `{ items: [...] }`, which made this class of issue easier to miss.
- Frontend fix:
  - `src/api/core/menu.ts` now types the current-menu response as an object with `items`.
- Backend dependency:
  - `base-server` now falls back to default-organization role bindings for current-user menus when the active organization has no explicit binding, and adds missing admin role APIs to the permission catalog.
- Verification target:
  - Run focused lint on `src/api/core/menu.ts`.
  - Re-test browser refresh with a user whose current organization is non-default.
- Verification result:
  - `pnpm exec eslint apps/web-antd/src/api/core/menu.ts` passed.
  - Playwright opened `http://127.0.0.1:5666/system/user` with `vben` while the current organization was `test`; the page title was `用户管理 - Vben Admin Antd`, the body was not 404, and no 4xx requests were observed.

## Follow-up 2026-05-14 Refresh 404 Regression

- Bug report:
  - Browser refresh still shows the application 404 page, with no frontend console exception.
- Current finding:
  - The failure is still likely before dynamic routes are generated.
  - A backend authorization regression can make `/admin-api/v1/my/organizations`, `/admin-api/v1/menus/current`, or `/user-api/v1/users/{user_id}` return `403`; when those startup APIs fail, the frontend has no menu routes to register and falls through to 404.
- Frontend change plan:
  - No additional frontend UI/API change planned unless backend verification shows the startup APIs now succeed but the router still falls through.
  - Keep the existing menu response normalization and route invalidation retry behavior.
- Backend dependency:
  - Fix auth default-role fallback and admin permission projection sync so startup APIs are authorized for non-root/default-role users.
- Verification target:
  - After backend fix and projection sync, refresh a protected page with a non-root user and confirm no 404 fallback.
- Verification result:
  - `pnpm exec eslint apps/web-antd/src/api/core/menu.ts apps/web-antd/src/router/guard.ts apps/web-antd/src/layouts/basic.vue` passed.
  - Browser verification used a real `jack` access token, refreshed `http://127.0.0.1:5666/system/user`, and stayed on the `用户管理 - Vben Admin Antd` page.
  - During that refresh, `/admin-api/v1/my/organizations`, `/user-api/v1/users/info`, and `/admin-api/v1/menus/current` all returned `200`; no 4xx requests and no frontend console errors were observed.

## Follow-up 2026-05-14 Organization Switch Menu Regression

- Bug report:
  - Switching the header organization makes the sidebar menu disappear.
- Change classification:
  - Level 1 local frontend bug fix.
- Current finding:
  - `handleOrganizationChange` clears access menus/routes through `invalidateAccessRoutes()`, then calls `useRefresh().refresh()`.
  - `useRefresh().refresh()` only re-renders the current tab component and does not enter `router.beforeEach`, so dynamic menus/routes are not regenerated after being cleared.
  - A direct gateway check for `jack` showed `/admin-api/v1/menus/current` still returns menu items for the default organization, so this iteration is a frontend state rebuild issue unless browser verification shows otherwise.
- Frontend change plan:
  - Extract protected-route access generation in `router/guard.ts` into a reusable function.
  - Let organization switching invalidate old routes, immediately regenerate access menus/routes for the current route, and then refresh the current page data.
  - Add a focused regression test for rebuilding menus/routes after organization switching.
- Backend change:
  - None planned. Backend menu and organization endpoints are already returning successfully in the local check.
- Verification target:
  - Run focused lint on `src/router/guard.ts` and `src/layouts/basic.vue`.
  - Run `git diff --check` for the touched frontend files and this iteration record.
  - Browser-check switching the header organization and confirm the sidebar menu remains populated.
- Verification result:
  - `pnpm exec vitest run apps/web-antd/src/router/guard.test.ts --dom` passed with 2 tests.
  - `pnpm exec eslint apps/web-antd/src/router/guard.ts apps/web-antd/src/router/guard.test.ts apps/web-antd/src/layouts/basic.vue` passed.
  - `git diff --check -- apps/web-antd/src/router/guard.ts apps/web-antd/src/router/guard.test.ts apps/web-antd/src/layouts/basic.vue docs/project/agent_runs/2026-05-13-organization-user-scope/plan.md` passed.
  - Browser verification used a real `vben` access token, opened `http://127.0.0.1:5666/system/user`, switched the header organization from `test` to `默认组织`, and stayed on `用户管理 - Vben Admin Antd` with `系统管理/用户管理` still visible in the sidebar.
  - During browser verification, `/admin-api/v1/my/organizations` and `/admin-api/v1/menus/current` returned `200`; `/menus/current` returned 6 menu items before and after the switch, and no 4xx requests were observed.
  - `pnpm --filter @vben/web-antd exec vue-tsc --noEmit --pretty false 2>&1 | rg "src/router/guard|src/layouts/basic|src/store/organization|src/api/request"` only reported the known `src/layouts/basic.vue` missing `Live2D.vue` declaration from `docs/project/known-issues.md`.

## Follow-up 2026-05-14 Permission Documentation Sync

- User request:
  - Align documentation with the current permission implementation.
- Change classification:
  - Level 1 docs-only synchronization.
- Current finding:
  - The backend implementation now uses the validated current organization as `x-scope-id`.
  - Frontend docs did not clearly state that `requestClient` attaches `x-scope-id` only after `/my/organizations` validates the current organization, or that organization switching must rebuild dynamic menus/routes.
- Documentation change:
  - `docs/project/monorepo-overview.md` now records `x-scope-id`, current-organization menu generation, current-organization user role/dept binding APIs, and organization-switch route rebuild behavior.
  - `docs/project/module-map.md` now maps the header organization switch to `requestClient`, `organization` store, and router guard responsibilities.
- Code change:
  - None. This iteration only updates documentation to match the current implementation.
- Verification:
  - `git diff --check -- docs/project/monorepo-overview.md docs/project/module-map.md docs/project/agent_runs/2026-05-13-organization-user-scope/plan.md` passed.
  - Stale wording search for the old "organization does not participate in scope authorization" model passed after excluding `**/agent_runs/**`.
