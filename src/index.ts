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
    el.scrollLeft = x
    el.scrollTop = y
  }

  // scroll looping over a frame
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
  if (shouldSmoothScroll<SmoothBehaviorOptions>(options)) {
    const overrides = options || {}
    // @TODO replace <any> in promise signatures with better information
    return scrollIntoView<Promise<any>>(target, {
      block: overrides.block,
      inline: overrides.inline,
      scrollMode: overrides.scrollMode,
      boundary: overrides.boundary,
      behavior: actions =>
        Promise.all(
          actions.map(
            ({ el, left, top }) =>
              new Promise(resolve =>
                smoothScroll(
                  el,
                  left,
                  top,
                  overrides.duration,
                  overrides.ease,
                  () => resolve()
                )
              )
          )
        ),
    })
  }

  // @TODO maybe warn when someone could be using this library this way unintentionally

  return scrollIntoView<T>(target, options)
}

// re-assign here makes the flowtype generation work
const smoothScrollIntoView = scroll

export default smoothScrollIntoView
