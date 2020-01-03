[![CircleCI Status](https://img.shields.io/circleci/project/github/stipsan/smooth-scroll-into-view-if-needed.svg?style=flat-square)](https://circleci.com/gh/stipsan/smooth-scroll-into-view-if-needed)
[![npm stat](https://img.shields.io/npm/dm/smooth-scroll-into-view-if-needed.svg?style=flat-square)](https://npm-stat.com/charts.html?package=smooth-scroll-into-view-if-needed)
[![npm version](https://img.shields.io/npm/v/smooth-scroll-into-view-if-needed.svg?style=flat-square)](https://www.npmjs.com/package/smooth-scroll-into-view-if-needed)
[![gzip size][gzip-badge]][unpkg-dist]
[![size][size-badge]][unpkg-dist]
[![module formats: umd, cjs, and es][module-formats-badge]][unpkg-dist]
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square)](https://github.com/semantic-release/semantic-release)
![smooth-scroll-into-view-if-needed](https://user-images.githubusercontent.com/81981/39496447-c1153942-4d9e-11e8-92c8-ad5ac0e406ac.png)

This is an addon to [`scroll-into-view-if-needed`](https://www.npmjs.com/package/scroll-into-view-if-needed) that [ponyfills](https://ponyfill.com) smooth scrolling.
And while `scroll-into-view-if-needed` use the same default options as browsers and the spec does, this library is a bit more opinionated and include bonus features that help you build great UIs.

## [Demo](https://scroll-into-view-if-needed.netlify.com/)

## Install

```bash
yarn add smooth-scroll-into-view-if-needed
```

The UMD build is also available on [unpkg](https://unpkg.com/smooth-scroll-into-view-if-needed/umd/):

```html
<script src="https://unpkg.com/smooth-scroll-into-view-if-needed/umd/smooth-scroll-into-view-if-needed.min.js"></script>
```

You can find the library on `window.scrollIntoView`.

## Usage

```js
import scrollIntoView from 'smooth-scroll-into-view-if-needed'
const node = document.getElementById('hero')

// `options.behavior` is set to `smooth` by default so you don't have to pass options like in `scroll-into-view-if-needed`
scrollIntoView(node)

// combine it with any of the other options from 'scroll-into-view-if-needed'
scrollIntoView(node, {
  scrollMode: 'if-needed',
  block: 'nearest',
  inline: 'nearest',
})

// a promise is always returned to help reduce boilerplate
const sequence = async () => {
  const slide = document.getElementById('slide-3')
  // First smooth scroll to hero
  await scrollIntoView(node, { behavior: 'smooth' })
  // Then we scroll to a slide in a slideshow
  return scrollIntoView(slide, { behavior: 'smooth' })
}
```

## Polyfills

This library rely on `Promise` and `requestAnimationFrame`. This library does not ship with polyfills for these to keep bundlesizes as low as possible.

## API

Check the full API in [`scroll-into-view-if-needed`](https://github.com/stipsan/scroll-into-view-if-needed#api).

### scrollIntoView(target, [options]) => Promise

`scroll-into-view-if-needed` does not return anything, while this library will return a Promise that is resolved when all of the scrolling boxes are finished scrolling.

> The ability to cancel animations will be added in a future version.

### options

Type: `Object`

#### behavior

Type: `'auto' | 'smooth' | Function`<br> Default: `'smooth'`

This option deviates from `scroll-into-view-if-needed` in two ways.

- The default value is `smooth` instead of `auto`
- Using `smooth` adds it to browsers that miss it, and overrides the native smooth scrolling in the browsers that have it to ensure the scrolling is consistent in any browser.

The options `auto` or `Function` behaves exactly like in `scroll-into-view-if-needed`.

#### duration

Type: `number`<br> Default: `300`

> Introduced in `v1.1.0`

This setting is not a hard limit.
The duration of a scroll differs depending on how many elements is scrolled, and the capabilities of the browser.
On mobile the browser might pause or throttle the animation if the user switches to another tab.
And there might be nothing to scroll.
No matter the scenario a Promise is returned so you can await on it.

#### ease

Type: `Function`

> Introduced in `v1.1.0`

The default easing is `easeOutQuint` based on these algorithms: https://gist.github.com/gre/1650294#file-easing-js

Linear example:

```typescript
scrollIntoView(node, {
  ease: t => t,
})
```

Acceleration until halfway, then deceleration:

```typescript
scrollIntoView(node, {
  ease: t =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
})
```

Sine easing in and out:

```typescript
scrollIntoView(node, {
  ease: t => (1 + Math.sin(Math.PI * t - Math.PI / 2)) / 2,
})
```

## Credits

- [smoothscroll](https://github.com/iamdustan/smoothscroll) for the reference implementation of smooth scrolling.

## More documentation will be added

[gzip-badge]: http://img.badgesize.io/https://unpkg.com/smooth-scroll-into-view-if-needed/umd/smooth-scroll-into-view-if-needed.min.js?compression=gzip&label=gzip%20size&style=flat-square
[size-badge]: http://img.badgesize.io/https://unpkg.com/smooth-scroll-into-view-if-needed/umd/smooth-scroll-into-view-if-needed.min.js?label=size&style=flat-square
[unpkg-dist]: https://unpkg.com/smooth-scroll-into-view-if-needed/umd/
[module-formats-badge]: https://img.shields.io/badge/module%20formats-umd%2C%20cjs%2C%20es-green.svg?style=flat-square
