---
'smooth-scroll-into-view-if-needed': patch
---

Declare the supported browsers as [Baseline 2019](https://web.dev/baseline) in the `browserslist` field of `package.json`, and build for it. The bundle stays free of optional chaining and nullish coalescing. `src/` and `dist/index.d.ts.map` (which pointed at `src/`) are no longer published. `dist/index.js.map` still embeds the source.
