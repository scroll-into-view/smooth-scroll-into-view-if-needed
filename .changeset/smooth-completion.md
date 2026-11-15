---
'smooth-scroll-into-view-if-needed': major
---

author: @stipsan

Make smooth scrolling completion reliable.

- A custom `behavior` function's return value is returned as is, instead of being wrapped in a Promise, matching its types.
- `duration: 0` scrolls to the destination right away, instead of computing `NaN` positions.
- Animations always end at the destination, even when a custom `ease` function doesn't return `1` for `1`. Before, such animations never finished.
- Smooth scrolling a target that isn't connected to the document resolves to `[]` instead of returning `undefined`.
- Every option is forwarded to `scroll-into-view-if-needed`, so options it adds later work without an update here.
- The smooth Promise is typed as `Promise<SmoothScrollAction[]>`, `auto` as `Promise<void>`, and `SmoothScrollAction` is exported.
