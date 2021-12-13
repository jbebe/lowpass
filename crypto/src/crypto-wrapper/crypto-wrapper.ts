import NaCl from 'tweetnacl'
import { UserPubKey } from '../types/user'

export const AsymmetricNonceLength = NaCl.box.nonceLength
export const SymmetricNonceLength = NaCl.secretbox.nonceLength
export const SymmetricKeyLength = NaCl.secretbox.keyLength

export interface IBaseCryptoWrapper {
  // base functions
  encryptSymmetric(secret: Uint8Array, nonce: Uint8Array, key: Uint8Array): Uint8Array
  decryptSymmetric(data: Uint8Array, nonce: Uint8Array, key: Uint8Array): Uint8Array
  decryptAsymmetric(secret: Uint8Array, nonce: Uint8Array, theirPubKey: Uint8Array, ownSecKey: Uint8Array): Uint8Array
  encryptAsymmetric(secret: Uint8Array, nonce: Uint8Array, theirPubKey: Uint8Array, ownSecKey: Uint8Array): Uint8Array

  // helpers
  getRandomBytes(length: number): Uint8Array
  createAsymmetricKeyPair(asymSecretKey?: Uint8Array): UserPubKey
  getHash(input: Uint8Array): Uint8Array
}

export class NaClCryptoWrapper implements IBaseCryptoWrapper {
  // Assymmetric
  public createAsymmetricKeyPair(asymSecretKey?: Uint8Array): UserPubKey {
    let keyPair: NaCl.BoxKeyPair
    if (asymSecretKey) {
      if (asymSecretKey.byteLength !== NaCl.box.secretKeyLength) {
        throw new RangeError(`Secret key must be ${NaCl.box.secretKeyLength} bytes long`)
      }
      keyPair = NaCl.box.keyPair.fromSecretKey(asymSecretKey)
    } else {
      keyPair = NaCl.box.keyPair()
    }
    return keyPair
  }

  validateAsym(nonce: Uint8Array, pubKey: Uint8Array, privKey: Uint8Array) {
    if (nonce.byteLength !== NaCl.box.nonceLength) {
      throw new RangeError(`Nonce must be ${NaCl.box.nonceLength} bytes long`)
    }
    if (pubKey.byteLength !== NaCl.box.publicKeyLength) {
      throw new RangeError(`Public key must be ${NaCl.box.publicKeyLength} bytes long`)
    }
    if (privKey.byteLength !== NaCl.box.secretKeyLength) {
      throw new RangeError(`Secret key must be ${NaCl.box.secretKeyLength} bytes long`)
    }
  }

  encryptAsymmetric(
    message: Uint8Array,
    nonce: Uint8Array,
    theirPubKey: Uint8Array,
    ownSecKey: Uint8Array,
  ): Uint8Array {
    this.validateAsym(nonce, theirPubKey, ownSecKey)
    return NaCl.box(message, nonce, theirPubKey, ownSecKey)
  }

  decryptAsymmetric(
    message: Uint8Array,
    nonce: Uint8Array,
    theirPubKey: Uint8Array,
    ownSecKey: Uint8Array,
  ): Uint8Array {
    this.validateAsym(nonce, theirPubKey, ownSecKey)
    const secret = NaCl.box.open(message, nonce, theirPubKey, ownSecKey)
    if (secret === null) {
      throw new TypeError('Unable to decrypt secret with given parameters')
    }
    return secret
  }

  // Symmetric

  private validateSym(nonce: Uint8Array, key: Uint8Array) {
    if (nonce.byteLength !== NaCl.secretbox.nonceLength) {
      throw new RangeError(`Nonce must be ${NaCl.secretbox.nonceLength} bytes long`)
    }
    if (key.byteLength !== NaCl.secretbox.keyLength) {
      throw new RangeError(`Key must be ${NaCl.secretbox.keyLength} bytes long`)
    }
  }

  public encryptSymmetric(secret: Uint8Array, nonce: Uint8Array, key: Uint8Array): Uint8Array {
    this.validateSym(nonce, key)
    return NaCl.secretbox(secret, nonce, key)
  }

  public decryptSymmetric(data: Uint8Array, nonce: Uint8Array, key: Uint8Array): Uint8Array {
    this.validateSym(nonce, key)
    const secret = NaCl.secretbox.open(data, nonce, key)
    if (secret === null) {
      throw new TypeError('Unable to decrypt secret with given parameters')
    }
    return secret
  }

  // Utils

  public getRandomBytes(length: number): Uint8Array {
    return NaCl.randomBytes(length)
  }

  public getHash(input: Uint8Array): Uint8Array {
    return NaCl.hash(input)
  }
}
