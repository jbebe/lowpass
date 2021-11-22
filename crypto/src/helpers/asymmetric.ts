import { decryptAsymmetric, encryptAsymmetric } from '../crypto-wrapper/asymmetric'
import { getRandomBytes } from '../crypto-wrapper/random'
import { AsymmetricNonceLength } from '../crypto-wrapper/utils'
import { decodeJson, encodeJson } from './object'
import { decodeString, encodeString } from './string'

export type EncryptedObject = {
  encryptedData: Uint8Array
  nonce: Uint8Array
}

export function encryptObjAsymmetric(obj: object, theirPubKey: Uint8Array, ownSecKey: Uint8Array): EncryptedObject {
  const messageStr = encodeJson(obj)
  const messageBytes = encodeString(messageStr)
  const nonce = getRandomBytes(AsymmetricNonceLength)
  return {
    encryptedData: encryptAsymmetric(messageBytes, nonce, theirPubKey, ownSecKey),
    nonce,
  }
}

export function decryptObjAsymmetric(
  encryptedObj: EncryptedObject,
  theirPubKey: Uint8Array,
  ownSecKey: Uint8Array,
): object {
  const messageBytes = decryptAsymmetric(encryptedObj.encryptedData, encryptedObj.nonce, theirPubKey, ownSecKey)
  const messageStr = decodeString(messageBytes)
  return decodeJson(messageStr)
}
