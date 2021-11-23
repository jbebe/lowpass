import { UserPubKey } from '../crypto-wrapper/asymmetric'
import { UserSymKey } from '../crypto-wrapper/symmetric'
import { EncryptedObject } from '../helpers/asymmetric'

// User object that represents the others
export type User = {
  email: string
  id: string
  crypto: {
    asym: {
      publicKey: Uint8Array
    }
  }
}

// User object that belongs to me before login
export type EncryptedUser = {
  email: string
  id: string
  passwordSalt: Uint8Array
  crypto: EncryptedObject
}

// User object that belongs to me and accessible after login
export type DetailedUser = User & {
  crypto: CryptoData
}

export type CryptoData = {
  asym: UserPubKey
  sym: UserSymKey
}

export type LoginData = {
  email: string
  password: string
}
