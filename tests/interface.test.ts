import scrollIntoView from '../src'

jest.mock('scroll-into-view-if-needed', () => () => [])

test('options is optional', async () => {
  expect.assertions(1)
  const result = await scrollIntoView(document.body)
  expect(result).toEqual([])
})
