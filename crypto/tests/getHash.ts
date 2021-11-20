import { getHash } from '../src/app'

test('getHash returns the right output', () => {
  const val = 'hello world'
  const result = getHash(val)

  expect(result).toEqual('b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9')
})
