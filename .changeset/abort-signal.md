---
'smooth-scroll-into-view-if-needed': minor
---

author: @stipsan

Add a `signal` option to cancel smooth scrolling with an `AbortController`. Aborting stops the animation where it is and rejects the returned Promise with the signal's abort reason. A signal that's already aborted rejects without scrolling.
