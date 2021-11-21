import { getRandomBytes } from '../../src/crypto-wrapper/random'

test('getRandomBytes: 0 length returns empty array', () => {
  const randomNumbers = getRandomBytes(0)
  expect(randomNumbers).toEqual(new Uint8Array())
})

test('getRandomBytes: length 1 returns only one item', () => {
  const randomNumbers = getRandomBytes(10)
  expect(randomNumbers.length).toEqual(10)
})
