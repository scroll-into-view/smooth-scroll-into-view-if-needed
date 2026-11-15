import { beforeEach, expect, test, vi } from 'vite-plus/test'

beforeEach(() => {
  vi.resetModules()
})

// https://github.com/scroll-into-view/smooth-scroll-into-view-if-needed/issues/822
test('smooth scrolling forwards skipOverflowHiddenElements', async () => {
  let received: any
  vi.doMock('scroll-into-view-if-needed', () => ({
    __esModule: true,
    default: (_target: Element, options: any) => {
      received = options
      return options.behavior([])
    },
  }))
  const scrollIntoView = (await import('../src')).default
  await scrollIntoView(document.body, {
    behavior: 'smooth',
    skipOverflowHiddenElements: true,
  })
  expect(received.skipOverflowHiddenElements).toBe(true)
})

// https://github.com/scroll-into-view/smooth-scroll-into-view-if-needed/issues/390
test('the ease option controls the animation curve', async () => {
  vi.doMock('scroll-into-view-if-needed', () => ({
    __esModule: true,
    default: (_target: Element, options: any) =>
      options.behavior([
        { el: { scrollTop: 0, scrollLeft: 0 }, top: 0, left: 1000 },
      ]),
  }))
  const scrollIntoView = (await import('../src')).default
  const frames: { elapsed: number; value: number; left: number }[] = []
  await scrollIntoView(document.body, {
    behavior: 'smooth',
    inline: 'center',
    duration: 100,
    ease: (t) => t,
    onScrollChange: ({ elapsed, value, left }) =>
      frames.push({ elapsed, value, left }),
  })
  expect(frames.length).toBeGreaterThan(1)
  for (const { elapsed, value, left } of frames) {
    expect(value).toBe(elapsed)
    expect(left).toBe(Math.ceil(1000 * elapsed))
  }
  expect(frames.at(-1)).toMatchObject({ elapsed: 1, left: 1000 })
})
