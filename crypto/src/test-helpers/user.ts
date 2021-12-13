import { DetailedUser } from '../types/user'
import { Secret, Note } from '../types/secret'
import { CryptoFunctions } from '../crypto-wrapper/crypto-functions'

export function createTestUser(cryptoFunctions: CryptoFunctions): DetailedUser {
  const email = `user${cryptoFunctions.getRandomString(5)}@lowpass.local`
  const password = cryptoFunctions.getRandomString(5)
  const id = cryptoFunctions.getRandomString(32)
  return {
    email,
    id,
    crypto: {
      asym: cryptoFunctions.createAsymmetricKeyPair(),
      sym: cryptoFunctions.createSymmetricKeyFromPassword(password),
    },
  }
}

export function createTestSecret(cryptoFunctions: CryptoFunctions) {
  const secretValue: Note = {
    title: cryptoFunctions.getRandomString(5),
    note: cryptoFunctions.getRandomString(50),
  }
  const secret: Secret = {
    type: 'Note',
    id: cryptoFunctions.getRandomString(5),
    value: secretValue,
    group: cryptoFunctions.getRandomString(5),
  }
  return secret
}
