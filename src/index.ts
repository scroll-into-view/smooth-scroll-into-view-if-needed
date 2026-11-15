import scrollIntoView, {
  Options,
  StandardBehaviorOptions,
  CustomBehaviorOptions,
} from 'scroll-into-view-if-needed'

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

export type SmoothBehaviorOptions = Options & {
  behavior?: 'smooth'
  duration?: number
  ease?: CustomEasing
  onScrollChange?: OnScrollChangeCallback
  /**
   * Stops the animation when aborted, and rejects the returned Promise with
   * the signal's abort reason
   */
  signal?: AbortSignal
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
  signal?: AbortSignal
}
function step(context: Context) {
  if (context.signal && context.signal.aborted) {
    return
  }
  const time = now()
  const elapsed =
    context.duration > 0
      ? Math.min((time - context.startTime) / context.duration, 1)
      : 1
  // apply easing to elapsed time, ending at the destination even if a custom
  // easing function doesn't return 1 for 1
  const value = elapsed === 1 ? 1 : context.ease(elapsed)

  const currentX = context.startX + (context.x - context.startX) * value
  const currentY = context.startY + (context.y - context.startY) * value

  context.method(currentX, currentY, elapsed, value)

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
  onScrollChange?: OnScrollChangeCallback,
  signal?: AbortSignal
) {
  // define scroll context
  const scrollable = el
  const startX = el.scrollLeft
  const startY = el.scrollTop
  const method = (
    currentX: number,
    currentY: number,
    elapsed: number,
    value: number
  ) => {
    // @TODO use Element.scroll if it exists, as it is potentially better performing
    // use ceil to include the the fractional part of the number for the scrolling
    const left = Math.ceil(currentX)
    const top = Math.ceil(currentY)

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
    signal,
  })
}

// `AbortSignal.reason` is newer than `AbortSignal` itself
const abortReason = (signal: AbortSignal): unknown =>
  signal.reason !== undefined
    ? signal.reason
    : Object.assign(new Error('The scroll was aborted'), { name: 'AbortError' })

// Listens before calling `run`, as the first animation frame runs
// synchronously and its `ease` or `onScrollChange` can abort the signal
function abortable<T>(signal: AbortSignal, run: () => Promise<T>): Promise<T> {
  if (signal.aborted) {
    return Promise.reject(abortReason(signal))
  }
  let onAbort!: () => void
  const aborted = new Promise<never>((_resolve, reject) => {
    onAbort = () => reject(abortReason(signal))
  })
  signal.addEventListener('abort', onAbort)
  const stopListening = () => signal.removeEventListener('abort', onAbort)
  let done: Promise<T>
  try {
    done = run()
  } catch (error) {
    stopListening()
    throw error
  }
  return Promise.race([done, aborted]).finally(stopListening)
}

const shouldSmoothScroll = (options: any): options is SmoothBehaviorOptions => {
  return (options && !options.behavior) || options.behavior === 'smooth'
}

const runSmoothScroll = (
  target: Element,
  overrides: SmoothBehaviorOptions
): Promise<SmoothScrollAction[]> =>
  // scroll-into-view-if-needed returns nothing, without calling `behavior`,
  // for targets that aren't connected to the document
  Promise.resolve(
    scrollIntoView<Promise<SmoothScrollAction[]> | undefined>(target, {
      ...overrides,
      behavior: (actions) => {
        // Collected with push rather than by spreading a reduce accumulator,
        // which would copy the array for every action
        const animations: Promise<SmoothScrollAction>[] = []
        for (const { el, left, top } of actions) {
          const startLeft = el.scrollLeft
          const startTop = el.scrollTop
          if (startLeft === left && startTop === top) {
            continue
          }

          animations.push(
            new Promise<SmoothScrollAction>((resolve) => {
              smoothScroll(
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
                overrides.onScrollChange,
                overrides.signal
              )
            })
          )
        }
        return Promise.all(animations)
      },
    })
  ).then((actions) => actions || [])

function scroll(
  target: Element,
  options?: SmoothBehaviorOptions
): Promise<SmoothScrollAction[]>
function scroll<T>(target: Element, options: CustomBehaviorOptions<T>): T
function scroll(
  target: Element,
  options: StandardBehaviorOptions
): Promise<void>
function scroll<T>(target: Element, options?: any) {
  const overrides = options || {}
  if (shouldSmoothScroll(overrides)) {
    const { signal } = overrides
    return signal
      ? abortable(signal, () => runSmoothScroll(target, overrides))
      : runSmoothScroll(target, overrides)
  }

  if (typeof overrides.behavior === 'function') {
    return scrollIntoView<T>(target, overrides)
  }
  return Promise.resolve(scrollIntoView(target, overrides))
}

// re-assign here makes the flowtype generation work
const smoothScrollIntoView: typeof scroll = scroll

export default smoothScrollIntoView
