[![CircleCI Status](https://img.shields.io/circleci/project/github/stipsan/smooth-scroll-into-view-if-needed.svg?style=flat-square)](https://circleci.com/gh/stipsan/smooth-scroll-into-view-if-needed)
[![npm stat](https://img.shields.io/npm/dm/smooth-scroll-into-view-if-needed.svg?style=flat-square)](https://npm-stat.com/charts.html?package=smooth-scroll-into-view-if-needed)
[![npm version](https://img.shields.io/npm/v/smooth-scroll-into-view-if-needed.svg?style=flat-square)](https://www.npmjs.com/package/smooth-scroll-into-view-if-needed)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square)](https://github.com/semantic-release/semantic-release)
![smooth-scroll-into-view-if-needed](https://user-images.githubusercontent.com/81981/39338604-0bff23f2-49c4-11e8-9929-2f2b74a67b3c.png)

This is an addon to [`scroll-into-view-if-needed`](https://www.npmjs.com/package/scroll-into-view-if-needed) that [ponyfills](https://ponyfill.com) smooth scrolling.

### This package requires v2 of `scroll-into-view-if-needed`, currently in alpha


## [Demo](https://scroll-into-view-if-needed.netlify.com/)

## Install

```bash
yarn add smooth-scroll-into-view-if-needed scroll-into-view-if-needed@next
```

## Usage

```js
import scrollIntoView from 'smooth-scroll-into-view-if-needed'
const node = document.getElementById('hero')

// If all you want is for all your users to have stuff smooth scroll into view
scrollIntoView(node, { behavior: 'smooth' })

// combine it with any of the other options
scrollIntoView(node, {
  behavior: 'smooth',
  scrollMode: 'if-needed',
  block: 'nearest',
  inline: 'nearest',
})

// It returns a promise that is resolved when the animation is finished
const sequence = async () => {
  const slide = document.getElementById('slide-3')
  // First smooth scroll to hero
  await scrollIntoView(node, { behavior: 'smooth' })
  // Then we scroll to a slide in a slideshow
  return scrollIntoView(slide, { behavior: 'smooth' })
}
```

### Custom scrolling transition

If the default smooth scrolling ponyfill isn't the duration or easing you want,
you can provide your own scrolling logic by giving `behavior` a callback (this is actually a `scroll-into-view-if-needed` feature, if this is what you're after then you might need this package).

```js
import scrollIntoView from 'smooth-scroll-into-view-if-needed'
const node = document.getElementById('hero')

scrollIntoView(node, {
  // Your scroll actions will always be an array, even if there is nothing to scroll
  behavior: actions =>
    // list is sorted from innermost (closest parent to your target) to outermost (often the document.body or viewport)
    actions.forEach(({ el, top, left }) => {
      // implement the scroll anyway you want
      el.scrollTop = top
      el.scrollLeft = left

      // If you need the relative scroll coordinates, for things like window.scrollBy style logic, just do the math
      const offsetTop = el.scrollTop - top
      const offsetLeft = el.scrollLeft - left
    }),
  // all the other options (scrollMode, block, inline) still work, so you don't need to reimplement them (unless you really really want to)
})
```

## More documentation will be added (hang in there)
