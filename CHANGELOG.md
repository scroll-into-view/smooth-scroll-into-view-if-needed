# smooth-scroll-into-view-if-needed

## 2.1.1

### Patch Changes

- [#1083](https://github.com/scroll-into-view/smooth-scroll-into-view-if-needed/pull/1083) [`7aca731`](https://github.com/scroll-into-view/smooth-scroll-into-view-if-needed/commit/7aca73131eb12c5a9bfa327fdbc117c6e8a73295) Thanks [@tembo](https://github.com/apps/tembo)! - Compile the published bundles to ES2019 syntax again. The previous release shipped optional chaining (`?.`) and nullish coalescing (`??`) because the browserslist targets drifted, which broke Webpack 4 and other older toolchains ([scroll-into-view-if-needed#1235](https://github.com/scroll-into-view/scroll-into-view-if-needed/issues/1235)). The build targets are now pinned and the build fails if the output isn't ES2019-compatible.

- [#1083](https://github.com/scroll-into-view/smooth-scroll-into-view-if-needed/pull/1083) [`7aca731`](https://github.com/scroll-into-view/smooth-scroll-into-view-if-needed/commit/7aca73131eb12c5a9bfa327fdbc117c6e8a73295) Thanks [@tembo](https://github.com/apps/tembo)! - Remove the `engines.node` requirement added in the previous release. Requiring Node.js 26 was unintentionally breaking for consumers on older Node.js versions, and as a browser library this package has no Node.js runtime requirement ([compute-scroll-into-view#928](https://github.com/scroll-into-view/compute-scroll-into-view/issues/928))

## 2.1.0

### Minor Changes

- [#1069](https://github.com/scroll-into-view/smooth-scroll-into-view-if-needed/pull/1069) [`eca543a`](https://github.com/scroll-into-view/smooth-scroll-into-view-if-needed/commit/eca543aa7d93e12056eb5481e6ce74ee1df4f78d) Thanks [@stipsan](https://github.com/stipsan)! - Require Node.js 26 (current LTS) or later, and publish to npm with trusted publishing (OIDC) and provenance

## [2.0.2](https://github.com/scroll-into-view/smooth-scroll-into-view-if-needed/compare/v2.0.1...v2.0.2) (2023-09-15)

### Bug Fixes

- SmoothBehaviorOptions is updated to be a type alias ([237c52f](https://github.com/scroll-into-view/smooth-scroll-into-view-if-needed/commit/237c52ffc4ee4eb3f364f5c7462c8d7deed3aad9))

## [2.0.1](https://github.com/scroll-into-view/smooth-scroll-into-view-if-needed/compare/v2.0.0...v2.0.1) (2023-09-14)

### Bug Fixes

- **deps:** bump `scroll-into-view-if-needed` to v3.1.0 ([cda553d](https://github.com/scroll-into-view/smooth-scroll-into-view-if-needed/commit/cda553d8a4d55647262e13b9191f422053df6915))

## [2.0.0](https://github.com/scroll-into-view/smooth-scroll-into-view-if-needed/compare/v1.1.33...v2.0.0) (2023-03-09)

### ⚠ BREAKING CHANGES

- Updates `scroll-into-view-if-needed` to `v3`

### Features

- add ESM ([eaf2582](https://github.com/scroll-into-view/smooth-scroll-into-view-if-needed/commit/eaf2582c7e4c36af63e17165fa791f2b2c575fe5))
- add onScrollChange callback ([#1040](https://github.com/scroll-into-view/smooth-scroll-into-view-if-needed/issues/1040)) ([a6ad6ff](https://github.com/scroll-into-view/smooth-scroll-into-view-if-needed/commit/a6ad6ffe1acb502902440da70c100d3b93307574))

### Bug Fixes

- add missing parameters: skipOverflowHiddenElements ([#1024](https://github.com/scroll-into-view/smooth-scroll-into-view-if-needed/issues/1024)) ([941df37](https://github.com/scroll-into-view/smooth-scroll-into-view-if-needed/commit/941df371bc5bf1ab1337bb811e1d3ce5a3974bbd))
