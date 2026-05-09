# Monorepo Overview

## 1. 适用范围

本文只描述 `vben-admin/monorepo` 这条版本线，重点应用是 `apps/web-antd`。

## 2. 运行链路

```text
浏览器
  -> apps/web-antd (Vite 5666)
  -> /api 代理
  -> gateway :8000
  -> auth / user / admin / common
```

本地代理配置见：

- `apps/web-antd/vite.config.ts`

规则是：

- 浏览器总是请求 `/api/*`
- Vite 去掉 `/api` 前缀后转发给 gateway
- 前端不直接请求 `8010/8020/8030/8040`

## 3. 当前入口与关键目录

| 路径                                 | 作用                             |
| ------------------------------------ | -------------------------------- |
| `apps/web-antd/src/api/core/**`      | 认证、用户、菜单、上传等基础 API |
| `apps/web-antd/src/api/system/**`    | 管理面 API 模块                  |
| `apps/web-antd/src/api/generated/**` | OpenAPI 生成客户端               |
| `apps/web-antd/src/router/**`        | 路由守卫、动态菜单生成           |
| `apps/web-antd/src/views/**`         | 页面视图                         |
| `apps/web-antd/src/layouts/**`       | 基础布局与全局壳层               |
| `openapi.yaml`                       | 从后端同步过来的 OpenAPI 输入    |

## 4. API 模块分层

### 4.1 core

| 文件 | 前缀 | 后端服务 | 说明 |
| --- | --- | --- | --- |
| `src/api/core/auth.ts` | `/auth-api/v1/*` | auth | 登录、刷新 token、登出、访问码 |
| `src/api/core/user.ts` | `/user-api/v1/*` | user | 用户详情、列表、增删改、密码 |
| `src/api/core/menu.ts` | `/admin-api/v1/menus/current` | admin | 当前用户动态菜单 |
| `src/api/core/upload.ts` | `/common-api/v1/file/upload` | common | 文件上传 |

### 4.2 system

| 文件 | 前缀 | 后端服务 | 说明 |
| --- | --- | --- | --- |
| `src/api/system/api.ts` | `/admin-api/v1/apis`、`/admin-api/v1/walk-routes` | admin | API 目录和 walk-routes |
| `src/api/system/dept.ts` | `/admin-api/v1/depts` | admin | 部门 |
| `src/api/system/log.ts` | `/admin-api/v1/logs` | admin | 系统日志 |
| `src/api/system/menu.ts` | `/admin-api/v1/menus*` | admin | 菜单管理 |
| `src/api/system/platform.ts` | `/admin-api/v1/platform/*` | admin | 业务域、服务注册、投影源状态 |
| `src/api/system/site-message.ts` | `/common-api/v1/site-messages/*` | common | 站内信收件箱、未读数、发布记录 |
| `src/api/system/resource.ts` | `/admin-api/v1/resources` | admin | 资源 |
| `src/api/system/role.ts` | `/admin-api/v1/roles` | admin | 角色 |
| `src/api/system/user-role-binding.ts` | `/admin-api/v1/user-role-bindings` | admin | 用户角色绑定 |
| `src/api/system/copilot.ts` | `/common-api/v1/copilot/sse` | common | Copilot SSE |

### 4.3 generated

OpenAPI 生成客户端路径：

- `src/api/generated/services/AuthServiceService.ts`
- `src/api/generated/services/UserServiceService.ts`
- `src/api/generated/services/AdminServiceService.ts`
- `src/api/generated/services/CommonServiceService.ts`
- `src/api/generated/services/UploadServiceService.ts`
- `src/api/generated/services/SseServiceService.ts`

## 5. 菜单与权限模式

当前 `web-antd` 不是纯静态菜单模式，而是“后端菜单 + 本地视图映射”模式：

1. 登录后在路由守卫里拉取用户信息。
2. 再从 `/admin-api/v1/menus/current` 拉取当前用户菜单。
3. `src/router/access.ts` 用 `generateAccess(...)` 把后端菜单映射到本地 `views/**/*.vue`。
4. 页面组件查找依赖：
   - `import.meta.glob('../views/**/*.vue')`
   - `BasicLayout`
   - `IFrameView`

因此，新增页面时至少要同时检查：

- 后端菜单数据是否会下发该路由
- 前端 `views/**` 下是否存在对应组件
- 组件路径是否与后端菜单 `component` 字段匹配

## 6. OpenAPI 与生成代码流程

这条版本线的 OpenAPI 来源是后端微服务线：

```text
base-server/api/openapi/openapi.yaml
  -> vben-admin/openapi.yaml
  -> pnpm run generate:api
  -> apps/web-antd/src/api/generated/**
```

同步命令从后端仓库执行：

```bash
cd /home/mini/OpenSource/framework/base-server
make frontend-api
```

## 7. 页面现状

当前业务页面主要集中在：

- `views/dashboard/**`
- `views/system/user/**`
- `views/system/role/**`
- `views/system/menu/**`
- `views/system/dept/**`
- `views/system/resource/**`
- `views/system/api/**`
- `views/system/platform/domain/**`
- `views/system/platform/service/**`
- `views/system/platform/projection-source/**`
- `views/log/**`
- `views/_core/authentication/**`
- `views/_core/profile/**`
- `views/_core/messages/inbox.vue`
- `views/_core/messages/manage.vue`

## 8. 当前状态

截至 2026-05-09，可确认的现状是：

- 前端主工作应用是 `apps/web-antd`
- 菜单、角色、平台治理等页面已接到 `admin` 服务
- 上传、Copilot、站内信已接到 `common` 服务
- 动态菜单依赖后端下发
- `vue-tsc --noEmit` 当前未通过，详见 [known-issues.md](./known-issues.md)
