import { beforeEach, expect, test, vi } from 'vite-plus/test'

let app: { scrollTop: number; scrollLeft: number }
let sidebar: { scrollTop: number; scrollLeft: number }

beforeEach(() => {
  vi.resetModules()
  app = { scrollTop: 0, scrollLeft: 0 }
  sidebar = { scrollTop: 0, scrollLeft: 0 }
  vi.doMock('scroll-into-view-if-needed', () => ({
    __esModule: true,
    default: (_target: Element, options: any) =>
      options.behavior([
        { el: sidebar, top: 40, left: 0 },
        { el: app, top: 200, left: 0 },
      ]),
  }))
})

test('can skip elements and still smooth scroll the rest', async () => {
  const scrollIntoView = (await import('../src')).default
  await expect(
    scrollIntoView(document.body, {
      duration: 0,
      beforeScroll: (actions) => actions.filter(({ el }) => el !== sidebar),
    })
  ).resolves.toEqual([{ el: app, top: [0, 200], left: [0, 0] }])
  expect(sidebar).toEqual({ scrollTop: 0, scrollLeft: 0 })
})

test('can offset where an element is scrolled to', async () => {
  const scrollIntoView = (await import('../src')).default
  const onScrollChange = vi.fn<(state: { target: unknown }) => void>()
  await expect(
    scrollIntoView(document.body, {
      duration: 1,
      onScrollChange,
      // Stay clear of a 50px sticky header
      beforeScroll: (actions) =>
        actions.map((action) =>
          action.el === app ? { ...action, top: action.top - 50 } : action
        ),
    })
  ).resolves.toEqual([
    { el: sidebar, top: [0, 40], left: [0, 0] },
    { el: app, top: [0, 150], left: [0, 0] },
  ])
  expect(app.scrollTop).toBe(150)
  expect(onScrollChange).toHaveBeenCalledWith(
    expect.objectContaining({ target: app })
  )
})
