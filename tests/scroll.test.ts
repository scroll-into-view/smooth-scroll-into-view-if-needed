import scrollIntoView from '../src'

jest.mock(
  'scroll-into-view-if-needed',
  () => (_target: Element, options: any) =>
    options.behavior([
      { el: { scrollTop: 0, scrollLeft: 0 }, top: 60, left: 60 },
    ])
)

test('options is optional', () => {
  expect.assertions(1)
  return expect(scrollIntoView(document.body)).resolves.toEqual([
    { el: { scrollTop: 60, scrollLeft: 60 }, top: [0, 60], left: [0, 60] },
  ])
})
