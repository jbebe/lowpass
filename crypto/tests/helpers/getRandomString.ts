import { getRandomString } from '../../src/helpers/random'

test('getRandomString: 0 length gives empty string', () => {
  const result = getRandomString(0)
  expect(result).toEqual('')
})

test('getRandomString: length 1000 gives 1000 characters long alphanumeric string', () => {
  const result = getRandomString(1000)
  expect(result.length).toEqual(1000)
  expect(result).toMatch(/^[a-z0-9]{1000}$/)
})
