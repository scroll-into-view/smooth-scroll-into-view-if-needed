import scrollIntoView from '../src'

// This mock supports two scenarios:
// 1. Default smooth scrolling, return empty array to ensure no scrolling is attempted.
// 2. Falling back to scroll-into-view-if-needed, simulate an array over scroll actions
// This enables tests to know which of the two cases is in effect, and verify if it's correct.
jest.mock(
  'scroll-into-view-if-needed',
  () => (_target: Element, options: any) =>
    typeof options.behavior == 'function'
      ? options.behavior([])
      : [{ el: {}, top: 0, left: 0 }]
)

test('options is optional', () => {
  expect.assertions(1)
  return expect(scrollIntoView(document.body)).resolves.toEqual([])
})

test('behavior option is optional', () => {
  expect.assertions(1)
  return expect(
    scrollIntoView(document.body, { scrollMode: 'if-needed' })
  ).resolves.toEqual([])
})

test('behavior option set to smooth works correctly', () => {
  expect.assertions(1)
  return expect(
    scrollIntoView(document.body, { behavior: 'smooth' })
  ).resolves.toEqual([])
})

test('other behavior options still returns a promise', () => {
  expect.assertions(1)
  return expect(
    scrollIntoView(document.body, { behavior: 'auto' })
  ).resolves.toEqual([{ el: {}, top: 0, left: 0 }])
})
