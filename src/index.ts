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
let memoizedNow
var now = () => {
  if (!memoizedNow) {
    memoizedNow =
      'performance' in window ? performance.now.bind(performance) : Date.now
  }
  return memoizedNow()
}

function step(context) {
  var time = now()
  var value
  var currentX
  var currentY
  var elapsed = (time - context.startTime) / context.duration

  // avoid elapsed times higher than one
  elapsed = elapsed > 1 ? 1 : elapsed

  // apply easing to elapsed time
  value = context.ease(elapsed)

  currentX = context.startX + (context.x - context.startX) * value
  currentY = context.startY + (context.y - context.startY) * value

  context.method.call(context.scrollable, currentX, currentY)

  // scroll more if we have not reached our destination
  if (currentX !== context.x || currentY !== context.y) {
    requestAnimationFrame(step.bind(global, context))
  }
}

function smoothScroll(
  el,
  x,
  y,
  duration = 300,
  ease = t => 0.5 * (1 - Math.cos(Math.PI * t)),
  cb
) {
  var scrollable
  var startX
  var startY
  var method
  var startTime = now()

  // define scroll context
  if (el === document.documentElement) {
    scrollable = window
    startX = window.scrollX || window.pageXOffset
    startY = window.scrollY || window.pageYOffset
    method = window.scroll
  } else {
    scrollable = el
    startX = el.scrollLeft
    startY = el.scrollTop
    method = (x, y) => {
      el.scrollLeft = x
      el.scrollTop = y
    }
  }

  // scroll looping over a frame
  step({
    scrollable: scrollable,
    method: method,
    startTime: startTime,
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
function scroll<T>(target, options) {
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
