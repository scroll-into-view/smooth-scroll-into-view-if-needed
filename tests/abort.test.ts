import { beforeEach, expect, test, vi } from 'vite-plus/test'

const nextFrame = () => new Promise((resolve) => requestAnimationFrame(resolve))

let el: { scrollTop: number; scrollLeft: number }
let computed: ReturnType<typeof vi.fn<() => void>>

beforeEach(() => {
  vi.resetModules()
  el = { scrollTop: 0, scrollLeft: 0 }
  computed = vi.fn<() => void>()
  vi.doMock('scroll-into-view-if-needed', () => ({
    __esModule: true,
    default: (_target: Element, options: any) => {
      computed()
      return options.behavior([{ el, top: 60, left: 60 }])
    },
  }))
})

test('an already aborted signal rejects without scrolling', async () => {
  const scrollIntoView = (await import('../src')).default
  const controller = new AbortController()
  const reason = new Error('stop')
  controller.abort(reason)
  await expect(
    scrollIntoView(document.body, { signal: controller.signal })
  ).rejects.toBe(reason)
  expect(computed).not.toHaveBeenCalled()
  expect(el).toEqual({ scrollTop: 0, scrollLeft: 0 })
})

test('aborting stops the animation and rejects with the abort reason', async () => {
  const scrollIntoView = (await import('../src')).default
  const controller = new AbortController()
  const promise = scrollIntoView(document.body, {
    duration: 60_000,
    signal: controller.signal,
  })
  await nextFrame()
  controller.abort()
  await expect(promise).rejects.toMatchObject({ name: 'AbortError' })
  const position = { ...el }
  expect(position.scrollTop).toBeLessThan(60)
  await nextFrame()
  await nextFrame()
  expect(el).toEqual(position)
})

test('rejects with an AbortError when the signal has no reason', async () => {
  const scrollIntoView = (await import('../src')).default
  const controller = new AbortController()
  controller.abort()
  const { signal } = controller
  Object.defineProperty(signal, 'reason', { value: undefined })
  await expect(scrollIntoView(document.body, { signal })).rejects.toMatchObject(
    { name: 'AbortError', message: 'The scroll was aborted' }
  )
})

test('resolves normally and stops listening when not aborted', async () => {
  const scrollIntoView = (await import('../src')).default
  const { signal } = new AbortController()
  const removeEventListener = vi.spyOn(signal, 'removeEventListener')
  await expect(
    scrollIntoView(document.body, { duration: 0, signal })
  ).resolves.toEqual([{ el, top: [0, 60], left: [0, 60] }])
  expect(removeEventListener).toHaveBeenCalledWith(
    'abort',
    expect.any(Function)
  )
})

test('aborting during the first frame rejects and stops listening', async () => {
  const scrollIntoView = (await import('../src')).default
  const controller = new AbortController()
  const removeEventListener = vi.spyOn(controller.signal, 'removeEventListener')
  await expect(
    scrollIntoView(document.body, {
      duration: 60_000,
      signal: controller.signal,
      onScrollChange: () => controller.abort(),
    })
  ).rejects.toMatchObject({ name: 'AbortError' })
  expect(removeEventListener).toHaveBeenCalledWith(
    'abort',
    expect.any(Function)
  )
})

test('stops listening when scrolling throws', async () => {
  vi.doMock('scroll-into-view-if-needed', () => ({
    __esModule: true,
    default: () => {
      throw new TypeError('Invalid target')
    },
  }))
  const scrollIntoView = (await import('../src')).default
  const { signal } = new AbortController()
  const removeEventListener = vi.spyOn(signal, 'removeEventListener')
  expect(() => scrollIntoView(document.body, { signal })).toThrow(
    'Invalid target'
  )
  expect(removeEventListener).toHaveBeenCalledWith(
    'abort',
    expect.any(Function)
  )
})
