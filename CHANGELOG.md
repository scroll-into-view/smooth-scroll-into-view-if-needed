# smooth-scroll-into-view-if-needed

## 3.0.0

### Major Changes

- [#1082](https://github.com/scroll-into-view/smooth-scroll-into-view-if-needed/pull/1082) [`e7f39d6`](https://github.com/scroll-into-view/smooth-scroll-into-view-if-needed/commit/e7f39d66379c2025aabb87839bf31c17f93adeba) Thanks [@tembo](https://github.com/apps/tembo)! - Ship ESM only.
  
  - The CommonJS build (`dist/index.cjs`) is removed. `exports` points straight at the ESM build, and `main`, `module` and `types` point at it too, for tools that don't read `exports`.
  - The `require` and `source` export conditions and the `source`, `typings` and `browserify` fields are removed.
  - Node.js 20.19+ and 22.12+ can still `require()` the package. It returns the module namespace, so the function is on `.default`: `const { default: scrollIntoView } = require('smooth-scroll-into-view-if-needed')`.

- [#1091](https://github.com/scroll-into-view/smooth-scroll-into-view-if-needed/pull/1091) [`98e1623`](https://github.com/scroll-into-view/smooth-scroll-into-view-if-needed/commit/98e16236c99a040979da75f028d44012914d61de) Thanks [@stipsan](https://github.com/stipsan)! - Make smooth scrolling completion reliable.
  
  - A custom `behavior` function's return value is returned as is, instead of being wrapped in a Promise, matching its types.
  - `duration: 0` scrolls to the destination right away, instead of computing `NaN` positions.
  - Animations always end at the destination, even when a custom `ease` function doesn't return `1` for `1`. Before, such animations never finished.
  - Smooth scrolling a target that isn't connected to the document resolves to `[]` instead of returning `undefined`.
  - Every option is forwarded to `scroll-into-view-if-needed`, so options it adds later work without an update here.
  - The smooth Promise is typed as `Promise<SmoothScrollAction[]>`, `auto` as `Promise<void>`, and `SmoothScrollAction` is exported.

### Minor Changes

- [`6988976`](https://github.com/scroll-into-view/smooth-scroll-into-view-if-needed/commit/698897659e9f6644a0ebbb3c9df30bf36122813c) Thanks [@stipsan](https://github.com/stipsan)! - Add a `signal` option to cancel smooth scrolling with an `AbortController`. Aborting stops the animation where it is and rejects the returned Promise with the signal's abort reason. A signal that's already aborted rejects without scrolling.

- [#1094](https://github.com/scroll-into-view/smooth-scroll-into-view-if-needed/pull/1094) [`5c1b0d7`](https://github.com/scroll-into-view/smooth-scroll-into-view-if-needed/commit/5c1b0d75a0b344dea7d1248b562d645f0eb9173e) Thanks [@stipsan](https://github.com/stipsan)! - Add a `beforeScroll` option that gets the computed scroll positions before the smooth scrolling starts, and returns the ones to animate. Leave elements out to skip them, or change `top` and `left` to offset them, for example to stay clear of a sticky header. The `ScrollAction` type is exported for it.

### Patch Changes

- [#1089](https://github.com/scroll-into-view/smooth-scroll-into-view-if-needed/pull/1089) [`06d983f`](https://github.com/scroll-into-view/smooth-scroll-into-view-if-needed/commit/06d983f0b2f41a5492d6d2eeae96295874c797d6) Thanks [@stipsan](https://github.com/stipsan)! - Declare the supported browsers as [Baseline 2019](https://web.dev/baseline) in the `browserslist` field of `package.json`, and build for it. The bundle stays free of optional chaining and nullish coalescing. `src/` and `dist/index.d.ts.map` (which pointed at `src/`) are no longer published. `dist/index.js.map` still embeds the source.

- [#1074](https://github.com/scroll-into-view/smooth-scroll-into-view-if-needed/pull/1074) [`38c77da`](https://github.com/scroll-into-view/smooth-scroll-into-view-if-needed/commit/38c77da1963b4b83cdd32de2950ed2243837a015) Thanks [@stipsan](https://github.com/stipsan)! - Build with Vite+ (tsdown and Rolldown) instead of `@sanity/pkg-utils`. The entry points, `exports`, and public types are unchanged.

- [#1080](https://github.com/scroll-into-view/smooth-scroll-into-view-if-needed/pull/1080) [`aa78ba7`](https://github.com/scroll-into-view/smooth-scroll-into-view-if-needed/commit/aa78ba70a596ecc66c82807656f01c6bcab4256f) Thanks [@tembo](https://github.com/apps/tembo)! - Collect the scroll animations in linear time instead of copying the array for every element that needs to scroll.

- [`f315379`](https://github.com/scroll-into-view/smooth-scroll-into-view-if-needed/commit/f3153799b73923eddb0af30f61573e30d5e40ee2) Thanks [@stipsan](https://github.com/stipsan)! - Fix the README: the `duration` default is `600`, not `300`, and `onScrollChange` is now documented. The demo, API and badge links point at live pages again.

## 2.1.2

### Patch Changes

- [#1085](https://github.com/scroll-into-view/smooth-scroll-into-view-if-needed/pull/1085) [`8657c2b`](https://github.com/scroll-into-view/smooth-scroll-into-view-if-needed/commit/8657c2b1d5825872715f711e31e2a04e94b93d96) Thanks [@tembo](https://github.com/apps/tembo)! - Update `scroll-into-view-if-needed` to `^3.2.1`

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
