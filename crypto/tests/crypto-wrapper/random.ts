import { CryptoFunctions } from '../../src/crypto-wrapper/crypto-functions'
import { MockCryptoWrapper } from '../../src/test-helpers/crypto-wrapper'

describe('Test helper functions of crypto wrapper', () => {
  const crypto = new CryptoFunctions(new MockCryptoWrapper())

  test('getRandomString: 0 length gives empty string', () => {
    const result = crypto.getRandomString(0)
    expect(result).toEqual('')
  })

  test('getRandomString: length 1000 gives 1000 characters long alphanumeric string', () => {
    const result = crypto.getRandomString(1000)
    expect(result.length).toEqual(1000)
    expect(result).toMatch(/^[a-z0-9]{1000}$/)
  })
})
