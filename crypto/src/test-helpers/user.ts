import { createAsymmetricKeyPair } from '../crypto-wrapper/asymmetric'
import { getRandomString } from '../helpers/random'
import { User } from '../types/user'
import { Secret, Note } from '../types/secret'
import { createSymmetricKeyFromPassword } from '../crypto-wrapper/random'

export function createTestUser(): User {
  const email = `user${getRandomString(5)}@lowpass.local`
  const password = getRandomString(5)
  const id = getRandomString(32)
  return {
    email,
    id,
    crypto: {
      asym: createAsymmetricKeyPair(),
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
    value: secretValue,
    group: getRandomString(5),
  }
  return secret
}
