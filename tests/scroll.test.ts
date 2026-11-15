import { beforeEach, expect, test, vi } from 'vite-plus/test'

beforeEach(() => {
  vi.resetModules()
})

test('resolves after scroll is completed', async () => {
  vi.doMock('scroll-into-view-if-needed', () => ({
    __esModule: true,
    default: (_target: Element, options: any) =>
      options.behavior([
        { el: { scrollTop: 0, scrollLeft: 0 }, top: 60, left: 60 },
      ]),
  }))
  const scrollIntoView = (await import('../src')).default
  expect.assertions(1)
  return expect(scrollIntoView(document.body)).resolves.toEqual([
    { el: { scrollTop: 60, scrollLeft: 60 }, top: [0, 60], left: [0, 60] },
  ])
})

test('resolves right away if there is nothign to scroll', async () => {
  vi.doMock('scroll-into-view-if-needed', () => ({
    __esModule: true,
    default: (_target: Element, options: any) =>
      options.behavior([
        { el: { scrollTop: 0, scrollLeft: 0 }, top: 0, left: 0 },
      ]),
  }))
  const scrollIntoView = (await import('../src')).default
  expect.assertions(1)
  return expect(
    scrollIntoView(document.body, { duration: Number.MAX_VALUE })
  ).resolves.toEqual([])
})

const mockOneAction = () =>
  vi.doMock('scroll-into-view-if-needed', () => ({
    __esModule: true,
    default: (_target: Element, options: any) =>
      options.behavior([
        { el: { scrollTop: 0, scrollLeft: 0 }, top: 60, left: 60 },
      ]),
  }))

test('zero duration completes immediately at the destination', async () => {
  mockOneAction()
  const scrollIntoView = (await import('../src')).default
  const onScrollChange = vi.fn<(state: object) => void>()
  await expect(
    scrollIntoView(document.body, { duration: 0, onScrollChange })
  ).resolves.toEqual([
    { el: { scrollTop: 60, scrollLeft: 60 }, top: [0, 60], left: [0, 60] },
  ])
  expect(onScrollChange).toHaveBeenCalledTimes(1)
  expect(onScrollChange).toHaveBeenCalledWith(
    expect.objectContaining({ elapsed: 1, value: 1, left: 60, top: 60 })
  )
})

test('custom easing that never returns 1 still completes at the destination', async () => {
  mockOneAction()
  const scrollIntoView = (await import('../src')).default
  return expect(
    scrollIntoView(document.body, { duration: 1, ease: () => 0.5 })
  ).resolves.toEqual([
    { el: { scrollTop: 60, scrollLeft: 60 }, top: [0, 60], left: [0, 60] },
  ])
})

test('a disconnected target resolves to an empty array', async () => {
  vi.doMock('scroll-into-view-if-needed', () => ({
    __esModule: true,
    default: () => undefined,
  }))
  const scrollIntoView = (await import('../src')).default
  return expect(scrollIntoView(document.createElement('div'))).resolves.toEqual(
    []
  )
})

test('custom behavior return values pass through unchanged', async () => {
  vi.doMock('scroll-into-view-if-needed', () => ({
    __esModule: true,
    default: (_target: Element, options: any) => options.behavior([]),
  }))
  const scrollIntoView = (await import('../src')).default
  expect(scrollIntoView(document.body, { behavior: () => 42 })).toBe(42)
})

test('all options are forwarded to scroll-into-view-if-needed', async () => {
  let received: any
  vi.doMock('scroll-into-view-if-needed', () => ({
    __esModule: true,
    default: (_target: Element, options: any) => {
      received = options
      return options.behavior([])
    },
  }))
  const scrollIntoView = (await import('../src')).default
  const boundary = document.body
  await scrollIntoView(document.body, {
    block: 'center',
    inline: 'end',
    scrollMode: 'if-needed',
    boundary,
    skipOverflowHiddenElements: true,
    // Options added to scroll-into-view-if-needed later reach it too
    ...({ futureOption: 'nearest' } as {}),
  })
  expect(received).toMatchObject({
    block: 'center',
    inline: 'end',
    scrollMode: 'if-needed',
    boundary,
    skipOverflowHiddenElements: true,
    futureOption: 'nearest',
  })
  expect(typeof received.behavior).toBe('function')
})
