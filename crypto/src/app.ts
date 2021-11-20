import NaCl from 'tweetnacl'
import { SHA256, enc as Encoding } from 'crypto-js'

export function getHash(input: string) {
  const hash = SHA256(input).toString(Encoding.Hex);
  return hash
}
