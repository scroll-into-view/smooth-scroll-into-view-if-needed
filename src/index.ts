import scrollIntoView, {
  Options,
  StandardBehaviorOptions,
  CustomBehaviorOptions,
} from 'scroll-into-view-if-needed'

export interface CustomEasing {
  (t: number): number
}
export interface SmoothBehaviorOptions extends Options {
  behavior?: 'smooth'
  duration?: number
  ease?: CustomEasing
}

// Memoize so we're much more friendly to non-dom envs
let memoizedNow: () => number
const now = () => {
  if (!memoizedNow) {
    memoizedNow =
      'performance' in window ? performance.now.bind(performance) : Date.now
  }
  return memoizedNow()
}

type SmoothScrollAction = {
  el: Element;
  // [start, end] tuples of the distance animated
  left: [number, number];
  top: [number, number];
}

type Context = {
  scrollable: Element
  method: Function
  startTime: number
  startX: number
  startY: number
  x: number
  y: number
  duration: number
  ease: CustomEasing
  cb: Function
}
function step(context: Context) {
  const time = now()
  const elapsed = Math.min((time - context.startTime) / context.duration, 1)
  // apply easing to elapsed time
  const value = context.ease(elapsed)

  const currentX = context.startX + (context.x - context.startX) * value
  const currentY = context.startY + (context.y - context.startY) * value

  context.method(currentX, currentY)

  // scroll more if we have not reached our destination
  if (currentX !== context.x || currentY !== context.y) {
    requestAnimationFrame(() => step(context))
  } else {
    // If nothing left to scroll lets fire the callback
    context.cb()
  }
}

function smoothScroll(
  el: Element,
  x: number,
  y: number,
  duration = 600,
  ease: CustomEasing = t => 1 + --t * t * t * t * t,
  cb: Function
) {
  let scrollable
  let startX
  let startY
  let method

  // define scroll context
  scrollable = el
  startX = el.scrollLeft
  startY = el.scrollTop
  method = (x: number, y: number) => {
    // @TODO use Element.scroll if it exists, as it is potentially better performing
    // use ceil to include the the fractional part of the number for the scrolling
    el.scrollLeft = Math.ceil(x)
    el.scrollTop = Math.ceil(y)
  }

  // scroll looping over a frame if needed
  step({
    scrollable: scrollable,
    method: method,
    startTime: now(),
    startX: startX,
    startY: startY,
    x: x,
    y: y,
    duration,
    ease,
    cb,
  })
}

const shouldSmoothScroll = <T>(options: any): options is T => {
  return (options && !options.behavior) || options.behavior === 'smooth'
}

function scroll(target: Element, options?: SmoothBehaviorOptions): Promise<any>
function scroll<T>(target: Element, options: CustomBehaviorOptions<T>): T
function scroll(target: Element, options: StandardBehaviorOptions): void
function scroll<T>(target: Element, options?: any) {
  const overrides = options || {}
  if (shouldSmoothScroll<SmoothBehaviorOptions>(overrides)) {
    return scrollIntoView<Promise<SmoothScrollAction[]>>(target, {
      block: overrides.block,
      inline: overrides.inline,
      scrollMode: overrides.scrollMode,
      boundary: overrides.boundary,
      skipOverflowHiddenElements: overrides.skipOverflowHiddenElements,
      behavior: actions =>
        Promise.all(
          actions.reduce((results: Promise<SmoothScrollAction>[], { el, left, top }) => {
            const startLeft = el.scrollLeft
            const startTop = el.scrollTop
            if (startLeft === left && startTop === top) {
              return results
            }

            return [
              ...results,
              new Promise(resolve => {
                return smoothScroll(
                  el,
                  left,
                  top,
                  overrides.duration,
                  overrides.ease,
                  () =>
                    resolve({
                      el,
                      left: [startLeft, left],
                      top: [startTop, top],
                    })
                )
              }),
            ]
          }, [])
        ),
    })
  }

  return Promise.resolve(scrollIntoView<T>(target, options))
}

// re-assign here makes the flowtype generation work
const smoothScrollIntoView = scroll

export default smoothScrollIntoView
