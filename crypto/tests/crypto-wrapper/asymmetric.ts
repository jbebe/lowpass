import { getRandomBytes } from '../../src/crypto-wrapper/random'
import { decryptObjAsymmetric, encryptObjAsymmetric } from '../../src/helpers/asymmetric'
import { createTestUser } from '../../src/test-helpers/user'

test('Alice sends data to Bob with public key encryption and Bob reads it', () => {
  const alice = createTestUser()
  const bob = createTestUser()
  const message = {
    prop: 'value',
  }
  const encryptedObj = encryptObjAsymmetric(message, bob.crypto.asym.publicKey, alice.crypto.asym.secretKey)
  const decryptedObj = decryptObjAsymmetric(encryptedObj, alice.crypto.asym.publicKey, bob.crypto.asym.secretKey)

  expect(decryptedObj).toEqual(message)
})

test('Alice sends data to Bob with public key encryption and Bob tries to read it but the nonce has changed', () => {
  const alice = createTestUser()
  const bob = createTestUser()
  const encryptedObj = encryptObjAsymmetric({ foo: 5 }, bob.crypto.asym.publicKey, alice.crypto.asym.secretKey)
  encryptedObj.nonce[0] = encryptedObj.nonce[0] ^ 0xff

  expect(() => decryptObjAsymmetric(encryptedObj, alice.crypto.asym.publicKey, bob.crypto.asym.secretKey)).toThrow(
    new TypeError('Unable to decrypt secret with given parameters'),
  )
})

test('Public key has invalid length', () => {
  const pubKey = getRandomBytes(31)
  const secretKey = getRandomBytes(32)
  expect(() => encryptObjAsymmetric({ foo: 5 }, pubKey, secretKey)).toThrow(
    new TypeError('Public key must be 32 bytes long'),
  )
})

test('Secret key has invalid length', () => {
  const pubKey = getRandomBytes(32)
  const secretKey = getRandomBytes(31)
  expect(() => encryptObjAsymmetric({ foo: 5 }, pubKey, secretKey)).toThrow(
    new TypeError('Secret key must be 32 bytes long'),
  )
})
