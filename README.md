<div align="center">
  <a href="https://github.com/anncwb/vue-vben-admin">
    <img alt="VbenAdmin Logo" width="215" src="https://unpkg.com/@vbenjs/static-source@0.1.7/source/logo-v1.webp">
  </a>
  <br>
  <br>

[![license](https://img.shields.io/github/license/anncwb/vue-vben-admin.svg)](LICENSE)

  <h1>Vue Vben Admin</h1>
</div>

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=vbenjs_vue-vben-admin&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=vbenjs_vue-vben-admin) ![codeql](https://github.com/vbenjs/vue-vben-admin/actions/workflows/codeql.yml/badge.svg) ![build](https://github.com/vbenjs/vue-vben-admin/actions/workflows/build.yml/badge.svg) ![ci](https://github.com/vbenjs/vue-vben-admin/actions/workflows/ci.yml/badge.svg) ![deploy](https://github.com/vbenjs/vue-vben-admin/actions/workflows/deploy.yml/badge.svg)

**English** | [中文](./README.zh-CN.md) | [日本語](./README.ja-JP.md)

# 此项目上游为 Vue Vben Admin，仅做了部分细微调整以适配我写的后端，会不定期同步上游代码

`upstream` 分支与 `Vue Vben Admin` 的 `main` 分支完全一样

仅修改 `web-antd` 效果

## Introduction

Vue Vben Admin is a free and open source middle and back-end template. Using the latest `vue3`, `vite`, `TypeScript` and other mainstream technology development, the out-of-the-box middle and back-end front-end solutions can also be used for learning reference.

## Upgrade Notice

This is the latest version, 5.0, and it is not compatible with previous versions. If you are starting a new project, it is recommended to use the latest version. If you wish to view the old version, please use the [v2 branch](https://github.com/vbenjs/vue-vben-admin/tree/v2).

## Features

- **Latest Technology Stack**: Developed with cutting-edge front-end technologies like Vue 3 and Vite
- **TypeScript**: A language for application-scale JavaScript
- **Themes**: Multiple theme colors available with customizable options
- **Internationalization**: Comprehensive built-in internationalization support
- **Permissions**: Built-in solution for dynamic route-based permission generation

## Preview

- [Vben Admin](https://vben.pro/) - Full version Chinese site

Test Account: vben/123456

## Documentation

[Document](https://doc.vben.pro/)

## Install and Use

1. Get the project code

```bash
git clone https://github.com/aonoa/vben-admin.git
```

2. Install dependencies

```bash
cd vue-vben-admin
npm i -g corepack
pnpm install
```

3. Run

```bash
pnpm dev
```

4. Build

```bash
pnpm build
```

## Git Contribution Submission Specification

Reference [vue](https://github.com/vuejs/vue/blob/dev/.github/COMMIT_CONVENTION.md) specification ([Angular](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular))

- `feat` Add new features
- `fix` Fix the problem/BUG
- `style` The code style is related and does not affect the running result
- `perf` Optimization/performance improvement
- `refactor` Refactor
- `revert` Undo edit
- `test` Test related
- `docs` Documentation/notes
- `chore` Dependency update/scaffolding configuration modification etc.
- `ci` Continuous integration
- `types` Type definition file changes

## License

[MIT © Vben-2020](./LICENSE)
