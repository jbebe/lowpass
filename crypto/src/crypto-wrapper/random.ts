// TODO: this file needs to be moved to the wrapper as it contains NaCl implicitly

import NaCl from 'tweetnacl'
import { encodeString } from '../common/string'
import { UserSymKey } from '../types/user'

export function getRandomBytes(length: number): Uint8Array {
  return NaCl.randomBytes(length)
}

export function createSymmetricKey(): Uint8Array {
  return NaCl.randomBytes(NaCl.secretbox.keyLength)
}

/**
 * Create hash from password
 * More specifically: hash('SHA-512', password + salt)
 */
export function createSymmetricKeyFromPassword(password: string): UserSymKey {
  const salt = NaCl.randomBytes(NaCl.secretbox.keyLength)
  const key = deriveSymmetricKeyFromPassword(password, salt)
  return { salt, key }
}

/**
 * Derive key from password and salt
 * More specifically: hash('SHA-512', password + salt)
 */
export function deriveSymmetricKeyFromPassword(password: string, salt: Uint8Array): Uint8Array {
  const passwordBytes = encodeString(password)

  // Concatenate password with salt
  const saltedPassword = new Uint8Array(passwordBytes.byteLength + salt.byteLength)
  saltedPassword.set(passwordBytes)
  saltedPassword.set(salt, passwordBytes.length)

  // Generate hash
  const passwordHash = NaCl.hash(saltedPassword)
  // Chop to symmetric key bytes length
  const key = passwordHash.slice(0, NaCl.secretbox.keyLength)

  return key
}
