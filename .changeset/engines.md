---
'smooth-scroll-into-view-if-needed': patch
---

Declare the Node.js versions that can `import` the package in `engines`: `^12.20.0 || ^14.13.1 || >=16.0.0`, the first releases with ES module `exports` support. The range is a floor for server-side rendering and tests, not a requirement to run a current Node.js, so installs on any supported Node.js keep working.
