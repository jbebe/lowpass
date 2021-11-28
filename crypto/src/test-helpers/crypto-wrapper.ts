/* eslint-disable @typescript-eslint/no-unused-vars */
import { IBaseCryptoWrapper } from '../crypto-wrapper/crypto-wrapper'
import { UserPubKey } from '../types/user'

export class MockCryptoWrapper implements IBaseCryptoWrapper {
  encryptSymmetric(secret: Uint8Array, nonce: Uint8Array, key: Uint8Array): Uint8Array {
    return secret
  }

  decryptSymmetric(data: Uint8Array, nonce: Uint8Array, key: Uint8Array): Uint8Array {
    return data
  }

  decryptAsymmetric(
    message: Uint8Array,
    nonce: Uint8Array,
    theirPubKey: Uint8Array,
    ownSecKey: Uint8Array,
  ): Uint8Array {
    return message
  }

  encryptAsymmetric(
    message: Uint8Array,
    nonce: Uint8Array,
    theirPubKey: Uint8Array,
    ownSecKey: Uint8Array,
  ): Uint8Array {
    return message
  }

  createAsymmetricKeyPair(asymSecretKey?: Uint8Array): UserPubKey {
    return {
      publicKey: new Uint8Array(),
      secretKey: new Uint8Array(),
    }
  }
}
