import { decodeString, encodeString } from '../common/string'
import { decodeJson, encodeJson } from '../common/object'
import { AsymmetricNonceLength, IBaseCryptoWrapper, SymmetricKeyLength, SymmetricNonceLength } from './crypto-wrapper'
import { EncryptedObject, UserPubKey, UserSymKey } from '../types/user'
import { range } from '../common/iterable'

export class CryptoFunctions {
  constructor(private cryptoFns: IBaseCryptoWrapper) {}

  //
  // Symmetric
  //

  public encryptBytesSymmetric(bytes: Uint8Array, symmetricKey: Uint8Array): EncryptedObject {
    const nonce = this.cryptoFns.getRandomBytes(SymmetricNonceLength)
    return {
      encryptedData: this.cryptoFns.encryptSymmetric(bytes, nonce, symmetricKey),
      nonce,
    }
  }

  public encryptObjSymmetric(obj: object, symmetricKey: Uint8Array): EncryptedObject {
    const messageStr = encodeJson(obj)
    const messageBytes = encodeString(messageStr)
    return this.encryptBytesSymmetric(messageBytes, symmetricKey)
  }

  public decryptBytesSymmetric(encryptedObj: EncryptedObject, symmetricKey: Uint8Array): Uint8Array {
    const messageBytes = this.cryptoFns.decryptSymmetric(encryptedObj.encryptedData, encryptedObj.nonce, symmetricKey)
    return messageBytes
  }

  public decryptObjSymmetric(encryptedObj: EncryptedObject, symmetricKey: Uint8Array): object {
    const messageBytes = this.decryptBytesSymmetric(encryptedObj, symmetricKey)
    const messageStr = decodeString(messageBytes)
    return decodeJson(messageStr)
  }

  //
  // Asymmetric
  //

  public encryptBytesAsymmetric(data: Uint8Array, theirPubKey: Uint8Array, ownSecKey: Uint8Array): EncryptedObject {
    const nonce = this.cryptoFns.getRandomBytes(AsymmetricNonceLength)
    return {
      encryptedData: this.cryptoFns.encryptAsymmetric(data, nonce, theirPubKey, ownSecKey),
      nonce,
    }
  }

  public encryptObjAsymmetric(obj: object, theirPubKey: Uint8Array, ownSecKey: Uint8Array): EncryptedObject {
    const messageStr = encodeJson(obj)
    const messageBytes = encodeString(messageStr)
    return this.encryptBytesAsymmetric(messageBytes, theirPubKey, ownSecKey)
  }

  public decryptBytesAsymmetric(
    encryptedObj: EncryptedObject,
    theirPubKey: Uint8Array,
    ownSecKey: Uint8Array,
  ): Uint8Array {
    return this.cryptoFns.decryptAsymmetric(encryptedObj.encryptedData, encryptedObj.nonce, theirPubKey, ownSecKey)
  }

  public decryptObjAsymmetric(encryptedObj: EncryptedObject, theirPubKey: Uint8Array, ownSecKey: Uint8Array): object {
    const messageBytes = this.decryptBytesAsymmetric(encryptedObj, theirPubKey, ownSecKey)
    const messageStr = decodeString(messageBytes)
    return decodeJson(messageStr)
  }

  //
  // Extra functions
  //

  public createAsymmetricKeyPair(asymSecretKey?: Uint8Array): UserPubKey {
    return this.cryptoFns.createAsymmetricKeyPair(asymSecretKey)
  }

  static lowercaseAlphaNum = String.fromCharCode(...[...range(48, 57), ...range(97, 122)])

  public getRandomBytes(length: number): Uint8Array {
    return this.cryptoFns.getRandomBytes(length)
  }

  public getRandomString(length: number): string {
    const bytes = Array.from(this.getRandomBytes(length))
    return bytes.map(x => CryptoFunctions.lowercaseAlphaNum[x % CryptoFunctions.lowercaseAlphaNum.length]).join('')
  }

  public createSymmetricKey(): Uint8Array {
    return this.getRandomBytes(SymmetricKeyLength)
  }

  /**
   * Create hash from password
   * More specifically: hash('SHA-512', password + salt)
   */
  public createSymmetricKeyFromPassword(password: string): UserSymKey {
    const salt = this.cryptoFns.getRandomBytes(SymmetricKeyLength)
    const key = this.deriveSymmetricKeyFromPassword(password, salt)
    return { salt, key }
  }

  /**
   * Derive key from password and salt
   * More specifically: hash('SHA-512', password + salt)
   */
  public deriveSymmetricKeyFromPassword(password: string, salt: Uint8Array): Uint8Array {
    const passwordBytes = encodeString(password)

    // Concatenate password with salt
    const saltedPassword = new Uint8Array(passwordBytes.byteLength + salt.byteLength)
    saltedPassword.set(passwordBytes)
    saltedPassword.set(salt, passwordBytes.length)

    // Generate hash
    const passwordHash = this.cryptoFns.getHash(saltedPassword)
    // Chop to symmetric key bytes length
    const key = passwordHash.slice(0, SymmetricKeyLength)

    return key
  }
}
