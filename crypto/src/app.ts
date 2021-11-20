import { createHash } from "crypto"

export function getHash(input: string) {
  const hasher = createHash('sha256')
  hasher.update(input)
  return hasher.digest('hex')
}
