# Module Map

本文把 `web-antd` 的主要页面、API 模块和后端服务做一层对照，便于功能定位。

## 1. 页面到 API 的对应关系

| 页面目录 | 主要文件 | 对应 API 模块 | 后端服务 | 备注 |
| --- | --- | --- | --- | --- |
| `views/system/user/**` | `index.vue`、`add_modal.vue` | `src/api/core/user.ts` | user | 用户列表、用户详情、增删改 |
| `views/system/role/**` | `list.vue`、`modules/form.vue` | `src/api/system/role.ts`、`src/api/system/menu.ts` | admin | 角色管理依赖菜单树 |
| `views/system/menu/**` | `list.vue`、`modules/form.vue` | `src/api/system/menu.ts` | admin | 菜单 CRUD、名称/路径校验 |
| `views/system/dept/**` | `list.vue`、`modules/form.vue` | `src/api/system/dept.ts` | admin | 部门树 |
| `views/system/resource/**` | `index.vue`、`add_modal.vue` | `src/api/system/resource.ts` | admin | 资源管理 |
| `views/system/api/**` | `index.vue`、`add_modal.vue` | `src/api/system/api.ts` | admin | API 目录、walk-routes |
| `views/system/platform/domain/**` | `index.vue`、`add_modal.vue` | `src/api/system/platform.ts` | admin | 业务域注册 |
| `views/system/platform/service/**` | `index.vue`、`add_modal.vue` | `src/api/system/platform.ts` | admin | 服务注册 |
| `views/system/platform/projection-source/**` | `index.vue`、`add_modal.vue` | `src/api/system/platform.ts` | admin | 投影源状态治理 |
| `views/log/**` | `system.vue`、`log_info.vue` | `src/api/system/log.ts` | admin | 系统日志 |
| `views/_core/profile/**` | `index.vue`、`base-setting.vue` | `src/api/core/user.ts` | user | 个人资料、密码设置 |
| `views/_core/authentication/**` | `login.vue` 等 | `src/api/core/auth.ts` | auth | 登录、登出、刷新 token |
| `views/dashboard/**` | `analytics/**`、`workspace/**` | 无稳定业务 API 依赖 | 本地示例 / 组合态 | 当前有类型问题，见 known-issues |

## 2. 菜单与路由生成链路

| 环节 | 文件 | 作用 |
| --- | --- | --- |
| 拉取当前用户菜单 | `src/api/core/menu.ts` | 调 `/admin-api/v1/menus/current` |
| 动态菜单生成 | `src/router/access.ts` | 把后端菜单映射成本地可访问路由 |
| 守卫触发点 | `src/router/guard.ts` | 登录后拉用户信息、生成动态路由 |
| 组件查找 | `import.meta.glob('../views/**/*.vue')` | 根据后端 `component` 字段匹配页面 |

## 3. API 改动时前端应该动哪里

### 3.1 改普通手写 API

一般涉及：

- `src/api/core/**` 或 `src/api/system/**`
- 对应页面 `src/views/**`
- 必要时 `src/router/**`

### 3.2 改 OpenAPI 契约

一般涉及：

1. 后端 `make frontend-api`
2. 前端 `openapi.yaml`
3. `src/api/generated/**`
4. 手写 wrapper 或页面调用点

### 3.3 改菜单/权限

除了页面代码，还要同步检查：

- `/admin-api/v1/menus/current` 返回结构
- 后端菜单数据中的 `component`、`path`、`name`
- 前端 `views/**` 里是否存在对应组件

## 4. 当前未落地模块

当前 `monorepo` 线没有这些模块：

- 站内信收件箱
- 站内信管理
- 站内信铃铛提醒

如果后续迁移这类功能，应按“新增功能”评估前后端改动，不应假设单体线已有实现可直接复用。
