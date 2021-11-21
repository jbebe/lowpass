import { encryptAsymmetric } from '../src/crypto-wrapper/asymmetric'
import { getRandomBytes } from '../src/crypto-wrapper/random'
import { encryptObjAsymmetric } from '../src/helpers/asymmetric'
import { createUser } from '../src/test-helpers/user'

test('Alice sends data to Bob with public key encryption', () => {
  const alice = createUser()
  const bob = createUser()
  const message = {
    prop: 'value',
  }
  const nonce = getRandomBytes(24)

  const encryptedMessage = encryptObjAsymmetric(message, nonce, bob.crypto.asym.publicKey, alice.crypto.asym.secretKey)

  
  // expect(result).toEqual('b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9')
})
