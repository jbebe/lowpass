import NaCl from 'tweetnacl'

export function getRandomBytes(length: number): Uint8Array {
  return NaCl.randomBytes(length)
}

export function createSymmetricKey(): Uint8Array {
  return NaCl.randomBytes(NaCl.secretbox.keyLength)
}
