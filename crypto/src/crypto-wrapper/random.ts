import NaCl from 'tweetnacl'
import { encodeString } from '../helpers/string'
import { UserSymKey } from './symmetric'

export function getRandomBytes(length: number): Uint8Array {
  return NaCl.randomBytes(length)
}

export function createSymmetricKey(): Uint8Array {
  return NaCl.randomBytes(NaCl.secretbox.keyLength)
}

export function createSymmetricKeyFromPassword(password: string): UserSymKey {
  const passwordBytes = encodeString(password)
  const salt = NaCl.randomBytes(NaCl.secretbox.keyLength)
  const saltedPassword = new Uint8Array(passwordBytes.byteLength + salt.byteLength)
  saltedPassword.set(passwordBytes)
  saltedPassword.set(salt, passwordBytes.length)
  const passwordHash = NaCl.hash(saltedPassword)
  const key = passwordHash.slice(0, NaCl.secretbox.keyLength)
  return { salt, key }
}
