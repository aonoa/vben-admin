# web-antd Project Docs

这些文档描述的是当前项目在 `vben-admin/monorepo` 分支上的实际落地方式，不是上游 Vben Admin 的通用说明。

## 快速入口

- [monorepo-overview.md](./monorepo-overview.md)
  - 当前 `web-antd` 的运行链路、菜单模式、API 分层和 OpenAPI 同步方式
- [module-map.md](./module-map.md)
  - 页面目录、API 模块、后端服务之间的对应关系
- [known-issues.md](./known-issues.md)
  - 当前前端版本线已知问题，尤其是 `vue-tsc` 未通过的文件清单

## 阅读顺序建议

1. 先读 [monorepo-overview.md](./monorepo-overview.md) 了解整体结构。
2. 开始改功能前，读 [module-map.md](./module-map.md) 找准页面和接口落点。
3. 跑验证前，读 [known-issues.md](./known-issues.md) 避免把既有错误误判成新问题。
