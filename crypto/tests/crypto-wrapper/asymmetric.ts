import { NaClCryptoWrapper } from '../../src/crypto-wrapper/crypto-wrapper'
import { CryptoFunctions } from '../../src/crypto-wrapper/crypto-functions'
import { getRandomBytes } from '../../src/crypto-wrapper/random'
import { MockCryptoWrapper } from '../../src/test-helpers/crypto-wrapper'
import { createTestUser } from '../../src/test-helpers/user'

const parameterizedTests = (cryptoFunctions: CryptoFunctions) => {
  test('Alice sends data to Bob with public key encryption and Bob reads it', () => {
    const alice = createTestUser(cryptoFunctions)
    const bob = createTestUser(cryptoFunctions)
    const message = {
      prop: 'value',
    }
    const encryptedObj = cryptoFunctions.encryptObjAsymmetric(
      message,
      bob.crypto.asym.publicKey,
      alice.crypto.asym.secretKey,
    )
    const decryptedObj = cryptoFunctions.decryptObjAsymmetric(
      encryptedObj,
      alice.crypto.asym.publicKey,
      bob.crypto.asym.secretKey,
    )
    expect(decryptedObj).toEqual(message)
  })

  test('Alice sends data to Bob with public key encryption and Bob tries to read it but the nonce has changed', () => {
    const alice = createTestUser(cryptoFunctions)
    const bob = createTestUser(cryptoFunctions)
    const encryptedObj = cryptoFunctions.encryptObjAsymmetric(
      { foo: 5 },
      bob.crypto.asym.publicKey,
      alice.crypto.asym.secretKey,
    )
    encryptedObj.nonce[0] = encryptedObj.nonce[0] ^ 0xff

    expect(() =>
      cryptoFunctions.decryptObjAsymmetric(encryptedObj, alice.crypto.asym.publicKey, bob.crypto.asym.secretKey),
    ).toThrow(new TypeError('Unable to decrypt secret with given parameters'))
  })

  test('Public key has invalid length', () => {
    const pubKey = getRandomBytes(31)
    const secretKey = getRandomBytes(32)
    expect(() => cryptoFunctions.encryptObjAsymmetric({ foo: 5 }, pubKey, secretKey)).toThrow(
      new TypeError('Public key must be 32 bytes long'),
    )
  })

  test('Secret key has invalid length', () => {
    const pubKey = getRandomBytes(32)
    const secretKey = getRandomBytes(31)
    expect(() => cryptoFunctions.encryptObjAsymmetric({ foo: 5 }, pubKey, secretKey)).toThrow(
      new TypeError('Secret key must be 32 bytes long'),
    )
  })

  test('Create asymmetric keypair with given secret key', () => {
    const secretKey = getRandomBytes(32)
    const keyPair = cryptoFunctions.createAsymmetricKeyPair(secretKey)
    expect(keyPair.publicKey.byteLength).toBe(32)
    expect(keyPair.secretKey.byteLength).toBe(32)
  })

  test('Create asymmetric keypair with given secret key', () => {
    const secretKey = getRandomBytes(31)
    expect(() => cryptoFunctions.createAsymmetricKeyPair(secretKey)).toThrow(
      new TypeError('Secret key must be 32 bytes long'),
    )
  })
}

describe('Test asymmetric encryption of NaCl and Mock', () => {
  parameterizedTests(new CryptoFunctions(new NaClCryptoWrapper()))
  // TODO: fix validations so we can use it to throw errors
  // parameterizedTests(new CryptoFunctions(new MockCryptoWrapper()))
})
