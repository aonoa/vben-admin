# 前端类型检查收口迭代记录

## 1. 目标

清理 `vben-admin/monorepo` 中 `apps/web-antd` 当前阻塞全量 `vue-tsc --noEmit` 的已知类型错误，使前端基础框架具备可持续迭代的类型检查基线。

## 2. 变更级别

Level 1：质量加固。

本次不改变后端 API 合约、数据库 schema 或权限模型。

## 3. 版本线

- 后端：`base-server/monorepo`
- 前端：`vben-admin/monorepo`

## 4. 初始状态

初始命令：

```bash
pnpm --filter @vben/web-antd exec vue-tsc --noEmit --pretty false
```

结果：失败。

当前错误集中在：

- Copilot 和浮动按钮触摸事件的 `touch` 可能为 `undefined`。
- Copilot SSE 消息时间戳类型不匹配。
- 图片上传组件的 `uploadApi` 可能为空。
- `src/api/index.ts` 的 `for...in` key 类型不兼容。
- `@vben/styles/antd` side-effect import 缺声明。
- `Live2D.vue` 缺少 Vue 类型声明。
- dashboard ECharts `grid.outerBounds.containLabel` 类型不匹配。
- 日志表格 `data.items` 可能为 `undefined`。
- 资源弹窗 form values 类型过宽。

## 5. 实施计划

- 只修复类型错误，不调整产品交互。
- 优先使用显式类型、空值保护和局部声明文件，不引入新依赖。
- 修复后重跑全量 `vue-tsc`。
- 更新 `docs/project/known-issues.md`，不再保留已修复的类型失败列表。

## 6. 验证计划

```bash
pnpm --filter @vben/web-antd exec vue-tsc --noEmit --pretty false
pnpm exec eslint <touched files>
git diff --check
```

## 7. 验证结果

已执行：

```bash
pnpm --filter @vben/web-antd exec vue-tsc --noEmit --pretty false
pnpm exec eslint apps/web-antd/src/adapter/component/copilot/ai-copilot.vue apps/web-antd/src/adapter/component/copilot/floating-button.vue apps/web-antd/src/adapter/component/image/image.vue apps/web-antd/src/api/index.ts apps/web-antd/src/api/system/copilot.ts apps/web-antd/src/api/system/organization.ts apps/web-antd/src/views/dashboard/analytics/analytics-trends.vue apps/web-antd/src/views/dashboard/analytics/analytics-visits.vue apps/web-antd/src/views/log/schemas/index.ts apps/web-antd/src/views/system/resource/add_modal.vue apps/web-antd/src/types/shims.d.ts
git diff --check
```

结果：

- `vue-tsc` 通过。
- touched files eslint 通过。
- `git diff --check` 通过。

## 8. 后端影响

无。当前任务只修前端类型基线，不改 API 合约或后端行为。
