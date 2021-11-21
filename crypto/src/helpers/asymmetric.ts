import { encryptAsymmetric } from '../crypto-wrapper/asymmetric'
import { encodeJson } from './object'
import { encodeString } from './string'

export function encryptObjAsymmetric(obj: object, nonce: Uint8Array, theirPubKey: Uint8Array, ownSecKey: Uint8Array) {
  const messageStr = encodeJson(obj)
  const messageBytes = encodeString(messageStr)
  return encryptAsymmetric(messageBytes, nonce, theirPubKey, ownSecKey)
}
