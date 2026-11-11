beforeEach(() => {
  jest.resetModules()
})

test('resolves after scroll is completed', () => {
  jest.doMock('scroll-into-view-if-needed', () => ({
    __esModule: true,
    default: (_target: Element, options: any) =>
      options.behavior([
        { el: { scrollTop: 0, scrollLeft: 0 }, top: 60, left: 60 },
      ]),
  }))
  const scrollIntoView =
    jest.requireActual<typeof import('../src')>('../src').default
  expect.assertions(1)
  return expect(scrollIntoView(document.body)).resolves.toEqual([
    { el: { scrollTop: 60, scrollLeft: 60 }, top: [0, 60], left: [0, 60] },
  ])
})

test('resolves right away if there is nothign to scroll', () => {
  jest.doMock('scroll-into-view-if-needed', () => ({
    __esModule: true,
    default: (_target: Element, options: any) =>
      options.behavior([
        { el: { scrollTop: 0, scrollLeft: 0 }, top: 0, left: 0 },
      ]),
  }))
  const scrollIntoView =
    jest.requireActual<typeof import('../src')>('../src').default
  expect.assertions(1)
  return expect(
    scrollIntoView(document.body, { duration: Number.MAX_VALUE })
  ).resolves.toEqual([])
})

test('zero duration completes immediately at the destination', () => {
  jest.doMock('scroll-into-view-if-needed', () => ({
    __esModule: true,
    default: (_target: Element, options: any) =>
      options.behavior([
        { el: { scrollTop: 0, scrollLeft: 0 }, top: 60, left: 60 },
      ]),
  }))
  const scrollIntoView =
    jest.requireActual<typeof import('../src')>('../src').default
  return expect(
    scrollIntoView(document.body, { duration: 0 })
  ).resolves.toEqual([
    { el: { scrollTop: 60, scrollLeft: 60 }, top: [0, 60], left: [0, 60] },
  ])
})

test('custom easing completes at the destination', () => {
  jest.doMock('scroll-into-view-if-needed', () => ({
    __esModule: true,
    default: (_target: Element, options: any) =>
      options.behavior([
        { el: { scrollTop: 0, scrollLeft: 0 }, top: 60, left: 60 },
      ]),
  }))
  const scrollIntoView =
    jest.requireActual<typeof import('../src')>('../src').default
  return expect(
    scrollIntoView(document.body, { duration: 0, ease: () => 0.5 })
  ).resolves.toEqual([
    { el: { scrollTop: 60, scrollLeft: 60 }, top: [0, 60], left: [0, 60] },
  ])
})

test('a disconnected target still returns a settled promise', () => {
  jest.doMock('scroll-into-view-if-needed', () => ({
    __esModule: true,
    default: () => undefined,
  }))
  const scrollIntoView =
    jest.requireActual<typeof import('../src')>('../src').default
  return expect(scrollIntoView(document.createElement('div'))).resolves.toEqual(
    []
  )
})

test('custom behavior return values pass through unchanged', () => {
  jest.doMock('scroll-into-view-if-needed', () => ({
    __esModule: true,
    default: (_target: Element, options: any) => options.behavior([]),
  }))
  const scrollIntoView =
    jest.requireActual<typeof import('../src')>('../src').default
  expect(scrollIntoView(document.body, { behavior: () => 42 })).toBe(42)
})

test('container is forwarded to the base ponyfill', () => {
  let container: string | undefined
  jest.doMock('scroll-into-view-if-needed', () => ({
    __esModule: true,
    default: (_target: Element, options: any) => {
      container = options.container
      return options.behavior([])
    },
  }))
  const scrollIntoView =
    jest.requireActual<typeof import('../src')>('../src').default
  return scrollIntoView(document.body, { container: 'nearest' }).then(() => {
    expect(container).toBe('nearest')
  })
})
