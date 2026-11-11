import scrollIntoView, {
  StandardBehaviorOptions as BaseStandardBehaviorOptions,
  CustomBehaviorOptions as BaseCustomBehaviorOptions,
} from 'scroll-into-view-if-needed'

type CustomBehaviorOptions<T = unknown> = BaseCustomBehaviorOptions<T> & {
  container?: 'all' | 'nearest'
}

type StandardBehaviorOptions = Omit<BaseStandardBehaviorOptions, 'behavior'> & {
  behavior?: ScrollBehavior | 'instant'
  container?: 'all' | 'nearest'
}

export interface CustomEasing {
  (t: number): number
}

type OnScrollChangeCallback = (scrollState: {
  target: Element
  elapsed: number
  value: number
  left: number
  top: number
}) => void

export type SmoothBehaviorOptions = Omit<
  StandardBehaviorOptions,
  'behavior'
> & {
  /** Limit scrolling to all ancestors or the nearest scrolling box. */
  container?: 'all' | 'nearest'
  behavior?: 'smooth'
  duration?: number
  ease?: CustomEasing
  onScrollChange?: OnScrollChangeCallback
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

export type SmoothScrollAction = {
  el: Element
  // [start, end] tuples of the distance animated
  left: [number, number]
  top: [number, number]
}

type Context = {
  scrollable: Element
  method: (elapsed: number, value: number, x: number, y: number) => void
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
  const elapsed =
    context.duration <= 0
      ? 1
      : Math.min((time - context.startTime) / context.duration, 1)
  // apply easing to elapsed time
  const value = elapsed === 1 ? 1 : context.ease(elapsed)

  const currentX = context.startX + (context.x - context.startX) * value
  const currentY = context.startY + (context.y - context.startY) * value

  context.method(currentX, currentY, elapsed, value)

  // scroll more if we have not reached our destination
  if (elapsed < 1) {
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
  ease: CustomEasing = (t) => 1 + --t * t * t * t * t,
  cb: Function,
  onScrollChange?: OnScrollChangeCallback
) {
  // define scroll context
  const scrollable = el
  const startX = el.scrollLeft
  const startY = el.scrollTop
  const method = (x: number, y: number, elapsed: number, value: number) => {
    // @TODO use Element.scroll if it exists, as it is potentially better performing
    // use ceil to include the the fractional part of the number for the scrolling
    const left = Math.ceil(x)
    const top = Math.ceil(y)

    el.scrollLeft = left
    el.scrollTop = top

    onScrollChange?.({
      target: el,
      elapsed,
      value,
      left,
      top,
    })
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

function scroll(
  target: Element,
  options?: SmoothBehaviorOptions
): Promise<SmoothScrollAction[]>
function scroll<T>(target: Element, options: CustomBehaviorOptions<T>): T
function scroll(
  target: Element,
  options: StandardBehaviorOptions
): Promise<{ interrupted: boolean } | void>
function scroll<T>(target: Element, options?: any) {
  const overrides = options || {}
  if (shouldSmoothScroll<SmoothBehaviorOptions>(overrides)) {
    return Promise.resolve(
      scrollIntoView<Promise<SmoothScrollAction[]>>(target, {
        ...overrides,
        behavior: (actions) =>
          Promise.all(
            actions.reduce<Promise<SmoothScrollAction>[]>(
              (results, { el, left, top }) => {
                const startLeft = el.scrollLeft
                const startTop = el.scrollTop
                if (startLeft === left && startTop === top) {
                  return results
                }

                return [
                  ...results,
                  new Promise<SmoothScrollAction>((resolve) => {
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
                        }),
                      overrides.onScrollChange
                    )
                  }),
                ]
              },
              []
            )
          ),
      })
    ).then((actions) => actions || [])
  }

  if (typeof options?.behavior === 'function') {
    return scrollIntoView<T>(target, options)
  }
  return Promise.resolve(scrollIntoView(target, options))
}

// re-assign here makes the flowtype generation work
const smoothScrollIntoView = scroll

export default smoothScrollIntoView
