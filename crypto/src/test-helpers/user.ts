import { getRandomString } from '../helpers/random'
import { DetailedUser } from '../types/user'
import { Secret, Note } from '../types/secret'
import { createSymmetricKeyFromPassword } from '../crypto-wrapper/random'
import { CryptoFunctions } from '../crypto-wrapper/crypto-functions'

export function createTestUser(cryptoFunctions: CryptoFunctions): DetailedUser {
  const email = `user${getRandomString(5)}@lowpass.local`
  const password = getRandomString(5)
  const id = getRandomString(32)
  return {
    email,
    id,
    crypto: {
      asym: cryptoFunctions.createAsymmetricKeyPair(),
      sym: createSymmetricKeyFromPassword(password),
    },
  }
}

export function createTestSecret() {
  const secretValue: Note = {
    title: getRandomString(5),
    note: getRandomString(50),
  }
  const secret: Secret = {
    type: 'Note',
    id: getRandomString(5),
    value: secretValue,
    group: getRandomString(5),
  }
  return secret
}
