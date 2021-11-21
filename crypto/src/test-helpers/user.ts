import { createAsymmetricKeyPair } from '../crypto-wrapper/asymmetric'
import { getRandomString } from '../helpers/random'
import { User } from '../types/user'

export function createUser(): User {
  const email = `user${getRandomString(5)}@lowpass.local`
  return {
    email,
    crypto: {
      asym: createAsymmetricKeyPair(),
    },
  }
}
