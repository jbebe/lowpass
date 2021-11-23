import { decryptAsymmetric, encryptAsymmetric } from '../crypto-wrapper/asymmetric'
import { getRandomBytes } from '../crypto-wrapper/random'
import { AsymmetricNonceLength } from '../crypto-wrapper/utils'
import { decodeString, encodeString } from '../common/string'
import { decodeJson, encodeJson } from '../common/object'

export type EncryptedObject = {
  encryptedData: Uint8Array
  nonce: Uint8Array
}

export function encryptBytesAsymmetric(
  data: Uint8Array,
  theirPubKey: Uint8Array,
  ownSecKey: Uint8Array,
): EncryptedObject {
  const nonce = getRandomBytes(AsymmetricNonceLength)
  return {
    encryptedData: encryptAsymmetric(data, nonce, theirPubKey, ownSecKey),
    nonce,
  }
}

export function encryptObjAsymmetric(obj: object, theirPubKey: Uint8Array, ownSecKey: Uint8Array): EncryptedObject {
  const messageStr = encodeJson(obj)
  const messageBytes = encodeString(messageStr)
  return encryptBytesAsymmetric(messageBytes, theirPubKey, ownSecKey)
}

export function decryptBytesAsymmetric(
  encryptedObj: EncryptedObject,
  theirPubKey: Uint8Array,
  ownSecKey: Uint8Array,
): Uint8Array {
  return decryptAsymmetric(encryptedObj.encryptedData, encryptedObj.nonce, theirPubKey, ownSecKey)
}

export function decryptObjAsymmetric(
  encryptedObj: EncryptedObject,
  theirPubKey: Uint8Array,
  ownSecKey: Uint8Array,
): object {
  const messageBytes = decryptBytesAsymmetric(encryptedObj, theirPubKey, ownSecKey)
  const messageStr = decodeString(messageBytes)
  return decodeJson(messageStr)
}
