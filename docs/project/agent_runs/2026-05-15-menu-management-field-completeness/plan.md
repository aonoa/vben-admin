# 菜单管理字段完整性修复

## 范围

- 版本线：`base-server/monorepo` + `vben-admin/monorepo`。
- 变更级别：Level 1，本地缺陷修复。
- 目标：菜单管理表单支持排序和后端已有 meta 字段，编辑时回显、提交时归一化，避免字段被清空。

## 前端任务

- 补齐 `SystemMenu` 类型中的 `meta.authority`、`ignoreAccess`、`fullPathKey`、`menuVisibleWithForbidden` 等字段。
- 菜单抽屉表单增加排序和高级字段。
- 把旧的 `action` 类型判断改为当前菜单类型 `button`。
- 将权限标识提交到可持久化的 `meta.authority`，不再依赖无后端存储列的 `authCode`。

## 验证计划

- 菜单相关文件 eslint。
- 若工程既有类型或 lint 问题阻塞，记录实际失败项。
- 执行 `git diff --check`。

## 执行结果

- 已同步后端 OpenAPI 到前端，并更新生成模型 `api_admin_service_v1_Meta`。
- 已补齐菜单表单排序、标签页、徽章、权限标识、访问控制和布局相关字段。
- 已新增 `menu-payload` 归一化层，将表单权限标识落到 `meta.authority`，并保证编辑提交时完整保留后端已有 meta 字段。
- 已修正菜单列表 API 类型为 `{ items, total }` 响应结构。
- 验证通过：`pnpm exec eslint apps/web-antd/src/api/system/menu.ts apps/web-antd/src/api/system/menu-payload.ts apps/web-antd/src/api/system/menu-payload.test.ts apps/web-antd/src/views/system/menu/modules/form.vue apps/web-antd/src/views/system/menu/data.ts`。
- 验证通过：`pnpm exec vitest run --dom apps/web-antd/src/api/system/menu-payload.test.ts`。
- 验证通过：`git diff --check`。

## 注意事项

- 当前仓库已有上一轮站内信按组织推送的未提交改动，本轮不回滚、不重排这些改动。
