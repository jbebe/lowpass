import NaCl from 'tweetnacl'

export function getRandomBytes(length: number): Uint8Array {
  return NaCl.randomBytes(length)
}
