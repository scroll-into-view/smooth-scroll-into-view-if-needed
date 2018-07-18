beforeEach(() => {
  jest.resetModules()
})

test('resolves after scroll is completed', () => {
  jest.doMock(
    'scroll-into-view-if-needed',
    () => (_target: Element, options: any) =>
      options.behavior([
        { el: { scrollTop: 0, scrollLeft: 0 }, top: 60, left: 60 },
      ])
  )
  const scrollIntoView = require('../src').default
  expect.assertions(1)
  return expect(scrollIntoView(document.body)).resolves.toEqual([
    { el: { scrollTop: 60, scrollLeft: 60 }, top: [0, 60], left: [0, 60] },
  ])
})

test('resolves right away if there is nothign to scroll', () => {
  jest.doMock(
    'scroll-into-view-if-needed',
    () => (_target: Element, options: any) =>
      options.behavior([
        { el: { scrollTop: 0, scrollLeft: 0 }, top: 0, left: 0 },
      ])
  )
  const scrollIntoView = require('../src').default
  expect.assertions(1)
  return expect(
    scrollIntoView(document.body, { duration: Number.MAX_VALUE })
  ).resolves.toEqual([])
})
