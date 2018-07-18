import scrollIntoView from '../src'

jest.mock(
  'scroll-into-view-if-needed',
  () => (_target: Element, options: any) => options.behavior([])
)

test('options is optional', () => {
  expect.assertions(1)
  return expect(scrollIntoView(document.body)).resolves.toEqual([])
})
