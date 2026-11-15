---
'smooth-scroll-into-view-if-needed': minor
---

Add a `beforeScroll` option that gets the computed scroll positions before the smooth scrolling starts, and returns the ones to animate. Leave elements out to skip them, or change `top` and `left` to offset them, for example to stay clear of a sticky header. The `ScrollAction` type is exported for it.
