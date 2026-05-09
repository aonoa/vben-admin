# Known Issues

本文记录 `vben-admin/monorepo` 当前已经确认存在的问题，避免把既有问题误判成新回归。

## 1. 前端类型检查当前未通过

验证命令：

```bash
pnpm --dir /home/mini/OpenSource/framework/vben-admin --filter @vben/web-antd exec vue-tsc --noEmit
```

截至 2026-05-09，已确认报错集中在这些文件：

- `src/adapter/component/copilot/ai-copilot.vue`
- `src/adapter/component/copilot/floating-button.vue`
- `src/adapter/component/image/image.vue`
- `src/api/index.ts`
- `src/bootstrap.ts`
- `src/layouts/basic.vue`
- `src/router/access.ts`
- `src/views/dashboard/analytics/analytics-trends.vue`
- `src/views/dashboard/analytics/analytics-visits.vue`
- `src/views/log/schemas/index.ts`
- `src/views/system/menu/list.vue`
- `src/views/system/menu/modules/form.vue`
- `src/views/system/resource/add_modal.vue`
- `src/views/system/role/modules/form.vue`

## 2. 已知问题分类

### 2.1 Copilot / 浮动组件类型问题

主要表现：

- `touch` 可能为 `undefined`
- 本地 `Message` 类型和实际对象结构不一致

涉及文件：

- `src/adapter/component/copilot/ai-copilot.vue`
- `src/adapter/component/copilot/floating-button.vue`

### 2.2 基础类型与导入问题

主要表现：

- `src/api/index.ts` 里的 `for...in` 类型不兼容
- `src/bootstrap.ts` 找不到 `@vben/styles/antd` 的 side-effect import 类型
- `src/layouts/basic.vue` 缺少 `Live2D.vue` 的声明

### 2.3 后端返回结构与前端声明不一致

主要表现：

- `src/router/access.ts` 认为菜单返回值上有 `items`
- `src/views/system/menu/list.vue`
- `src/views/system/role/modules/form.vue`

这说明当前手写 API 声明与实际使用之间还有一层未对齐。

### 2.4 仪表盘示例类型问题

主要表现：

- ECharts `GridOption` 配置字段不匹配

涉及文件：

- `src/views/dashboard/analytics/analytics-trends.vue`
- `src/views/dashboard/analytics/analytics-visits.vue`

## 3. 使用建议

- 做新功能前先跑局部校验，不要直接把全量 `vue-tsc` 失败视为本次改动引入。
- 如果本次任务涉及上面这些文件，先把“修既有类型问题”与“做新功能”分成两个边界清晰的提交。
- 如果任务涉及动态菜单链路，优先先对齐：
  - `src/api/core/menu.ts`
  - `src/router/access.ts`
  - `src/views/system/menu/**`
