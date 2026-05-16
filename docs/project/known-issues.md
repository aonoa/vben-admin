# Known Issues

本文记录 `vben-admin/monorepo` 当前已经确认存在的问题，避免把既有问题误判成新回归。

## 1. 前端类型检查状态

验证命令：

```bash
pnpm --dir /home/mini/OpenSource/framework/vben-admin --filter @vben/web-antd exec vue-tsc --noEmit
```

截至 2026-05-16，`apps/web-antd` 全量 `vue-tsc --noEmit` 已通过。

## 2. 已修复的类型问题

2026-05-16 已清理这些历史类型问题：

- Copilot 和浮动按钮触摸事件的 `touch` 可能为 `undefined`。
- Copilot SSE 消息时间戳类型不匹配。
- 图片上传组件的 `uploadApi` 可能为空。
- `src/api/index.ts` 的 `for...in` key 类型不兼容。
- `@vben/styles/antd` side-effect import 缺声明。
- `Live2D.vue` 缺少 Vue 类型声明。
- dashboard ECharts `grid.outerBounds.containLabel` 类型不匹配。
- 日志表格 `data.items` 可能为 `undefined`。
- 资源弹窗 form values 类型过宽。

## 3. 使用建议

- 做新功能前先跑局部校验；涉及共享 API、路由、布局或生成代码时，应再跑全量 `vue-tsc --noEmit`。
- 如果后续全量类型检查失败，把新增失败项记录到本文件，避免把历史和本次改动混在一起。
- 如果任务涉及动态菜单链路，优先先对齐：
  - `src/api/core/menu.ts`
  - `src/router/access.ts`
  - `src/views/system/menu/**`
