export type LoginData = {
  email: string
  password: string
}

export type UserSymKey = {
  salt: Uint8Array
  key: Uint8Array
}

export type UserPubKey = {
  publicKey: Uint8Array
  secretKey: Uint8Array
}

export type EncryptedObject = {
  encryptedData: Uint8Array
  nonce: Uint8Array
}

export type PublicCrypto = {
  asym: {
    publicKey: Uint8Array
  }
}

// User object that represents the others
export type User = {
  email: string
  id: string
  crypto: PublicCrypto
}

// User object that belongs to me before login
export type EncryptedUser = {
  email: string
  id: string
  passwordSalt: Uint8Array
  crypto: PublicCrypto
  encrypted: EncryptedObject
}

// User object that belongs to me and accessible after login
export type DetailedUser = User & {
  crypto: CryptoData
}

export type CryptoData = {
  asym: UserPubKey
  sym: UserSymKey
}
