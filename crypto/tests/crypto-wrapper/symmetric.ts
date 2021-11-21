import { getRandomBytes } from '../../src/crypto-wrapper/random'
import { decryptObjSymmetric, encryptObjSymmetric } from '../../src/helpers/symmetric'
import { createTestSecret, createTestUser } from '../../src/test-helpers/user'

test('User encrypts secret with symmetric key and decrypts it', () => {
  const user = createTestUser()
  const secret = createTestSecret()
  const encryptedObj = encryptObjSymmetric(secret, user.crypto.sym)
  const decryptedObj = decryptObjSymmetric(encryptedObj, user.crypto.sym)

  expect(decryptedObj).toEqual(secret)
})

test('Alice sends data to Bob with public key encryption and Bob tries to read it but the nonce has changed', () => {
  const user = createTestUser()
  const secret = createTestSecret()
  const encryptedObj = encryptObjSymmetric(secret, user.crypto.sym)
  encryptedObj.nonce[0] = encryptedObj.nonce[0] ^ 0xff

  expect(() => decryptObjSymmetric(encryptedObj, user.crypto.sym)).toThrow(
    new TypeError('Unable to decrypt secret with given parameters'),
  )
})

test('Secret key has invalid length', () => {
  const secretKey = getRandomBytes(31)
  expect(() => encryptObjSymmetric({ foo: 5 }, secretKey)).toThrow(new TypeError('Key must be 32 bytes long'))
})
