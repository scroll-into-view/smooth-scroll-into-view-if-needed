---
'smooth-scroll-into-view-if-needed': major
---

Ship ESM only.

- The CommonJS build (`dist/index.cjs`) is removed. `exports` points straight at the ESM build, and `main`, `module` and `types` point at it too, for tools that don't read `exports`.
- The `require` and `source` export conditions and the `source`, `typings` and `browserify` fields are removed.
- Node.js 20.19+ and 22.12+ can still `require()` the package. It returns the module namespace, so the function is on `.default`: `const { default: scrollIntoView } = require('smooth-scroll-into-view-if-needed')`.
