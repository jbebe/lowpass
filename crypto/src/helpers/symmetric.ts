import { getRandomBytes } from '../crypto-wrapper/random'
import { decryptSymmetric, encryptSymmetric } from '../crypto-wrapper/symmetric'
import { SymmetricNonceLength } from '../crypto-wrapper/utils'
import { decodeJson, encodeJson } from './object'
import { decodeString, encodeString } from './string'

type EncryptedObject = {
  encryptedData: Uint8Array
  nonce: Uint8Array
}

export function encryptObjSymmetric(obj: object, symmetricKey: Uint8Array): EncryptedObject {
  const messageStr = encodeJson(obj)
  const messageBytes = encodeString(messageStr)
  const nonce = getRandomBytes(SymmetricNonceLength)
  return {
    encryptedData: encryptSymmetric(messageBytes, nonce, symmetricKey),
    nonce,
  }
}

export function decryptObjSymmetric(encryptedObj: EncryptedObject, symmetricKey: Uint8Array): object {
  const messageBytes = decryptSymmetric(encryptedObj.encryptedData, encryptedObj.nonce, symmetricKey)
  const messageStr = decodeString(messageBytes)
  return decodeJson(messageStr)
}
