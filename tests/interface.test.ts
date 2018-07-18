import scrollIntoView from '../src'

test('options is optional', async () => {
  expect.assertions(1)
  const result = await scrollIntoView(document.body)
  expect(result).toBe([])
})
