import { range } from '../common/iterable'
import { getRandomBytes } from '../crypto-wrapper/random'

const lowercaseAlphaNum = String.fromCharCode(...[...range(48, 57), ...range(97, 122)])

export function getRandomString(length: number) {
  const bytes = Array.from(getRandomBytes(length))
  return bytes.map(x => lowercaseAlphaNum[x % lowercaseAlphaNum.length]).join('')
}
