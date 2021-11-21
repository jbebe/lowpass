import { createAsymmetricKeyPair } from '../crypto-wrapper/asymmetric'
import { getRandomString } from '../helpers/random'
import { User } from '../types/user'
import { Secret, Note } from '../types/secret'
import { createSymmetricKey } from '../crypto-wrapper/random'

export function createTestUser(): User {
  const email = `user${getRandomString(5)}@lowpass.local`
  return {
    email,
    crypto: {
      asym: createAsymmetricKeyPair(),
      sym: createSymmetricKey(),
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
