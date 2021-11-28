import { NaClCryptoWrapper } from '../../src/crypto-wrapper/crypto-wrapper'
import { CryptoFunctions } from '../../src/crypto-wrapper/crypto-functions'
import { getRandomBytes } from '../../src/crypto-wrapper/random'
import { MockCryptoWrapper } from '../../src/test-helpers/crypto-wrapper'
import { createTestSecret, createTestUser } from '../../src/test-helpers/user'

const parameterizedTests = (cryptoFunctions: CryptoFunctions) => {
  test('User encrypts secret with symmetric key and decrypts it', () => {
    const user = createTestUser(cryptoFunctions)
    const secret = createTestSecret()
    const encryptedObj = cryptoFunctions.encryptObjSymmetric(secret, user.crypto.sym.key)
    const decryptedObj = cryptoFunctions.decryptObjSymmetric(encryptedObj, user.crypto.sym.key)
    expect(decryptedObj).toEqual(secret)
  })

  test('Alice sends data to Bob with public key encryption and Bob tries to read it but the nonce has changed', () => {
    const user = createTestUser(cryptoFunctions)
    const secret = createTestSecret()
    const encryptedObj = cryptoFunctions.encryptObjSymmetric(secret, user.crypto.sym.key)
    encryptedObj.nonce[0] = encryptedObj.nonce[0] ^ 0xff

    expect(() => cryptoFunctions.decryptObjSymmetric(encryptedObj, user.crypto.sym.key)).toThrow(
      new TypeError('Unable to decrypt secret with given parameters'),
    )
  })

  test('Secret key has invalid length', () => {
    const secretKey = getRandomBytes(31)
    expect(() => cryptoFunctions.encryptObjSymmetric({ foo: 5 }, secretKey)).toThrow(
      new TypeError('Key must be 32 bytes long'),
    )
  })
}

describe('Test symmetric encryption of NaCl and Mock', () => {
  parameterizedTests(new CryptoFunctions(new NaClCryptoWrapper()))
  // TODO: fix validations so we can use it to throw errors
  // parameterizedTests(new CryptoFunctions(new MockCryptoWrapper()))
})
