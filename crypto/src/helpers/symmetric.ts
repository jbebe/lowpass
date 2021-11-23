import { getRandomBytes } from '../crypto-wrapper/random'
import { decryptSymmetric, encryptSymmetric } from '../crypto-wrapper/symmetric'
import { SymmetricNonceLength } from '../crypto-wrapper/utils'
import { decodeString, encodeString } from '../common/string'
import { decodeJson, encodeJson } from '../common/object'

type EncryptedObject = {
  encryptedData: Uint8Array
  nonce: Uint8Array
}

export function encryptBytesSymmetric(bytes: Uint8Array, symmetricKey: Uint8Array): EncryptedObject {
  const nonce = getRandomBytes(SymmetricNonceLength)
  return {
    encryptedData: encryptSymmetric(bytes, nonce, symmetricKey),
    nonce,
  }
}

export function encryptObjSymmetric(obj: object, symmetricKey: Uint8Array): EncryptedObject {
  const messageStr = encodeJson(obj)
  const messageBytes = encodeString(messageStr)
  return encryptBytesSymmetric(messageBytes, symmetricKey)
}

export function decryptBytesSymmetric(encryptedObj: EncryptedObject, symmetricKey: Uint8Array): Uint8Array {
  const messageBytes = decryptSymmetric(encryptedObj.encryptedData, encryptedObj.nonce, symmetricKey)
  return messageBytes
}

export function decryptObjSymmetric(encryptedObj: EncryptedObject, symmetricKey: Uint8Array): object {
  const messageBytes = decryptBytesSymmetric(encryptedObj, symmetricKey)
  const messageStr = decodeString(messageBytes)
  return decodeJson(messageStr)
}
