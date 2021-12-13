/* eslint-disable @typescript-eslint/no-unused-vars */
import { assertTypedArrayEqual } from '../common/iterable'
import { decodeJson, encodeJson } from '../common/object'
import { decodeString, encodeString } from '../common/string'
import { IBaseCryptoWrapper } from '../crypto-wrapper/crypto-wrapper'
import { UserPubKey } from '../types/user'

type MockEncryptedObject = {
  secret: Uint8Array
  nonce: Uint8Array
  key?: Uint8Array
  theirPubKey?: Uint8Array
  ownSecKey?: Uint8Array
}

export class MockCryptoWrapper implements IBaseCryptoWrapper {
  encryptSymmetric(secret: Uint8Array, nonce: Uint8Array, key: Uint8Array): Uint8Array {
    if (key.byteLength !== 32) {
      throw new TypeError('Key must be 32 bytes long')
    }
    const obj: MockEncryptedObject = { secret, nonce, key }
    const str = encodeJson(obj)
    const bin = encodeString(str)
    return bin
  }

  decryptSymmetric(data: Uint8Array, nonce: Uint8Array, key: Uint8Array): Uint8Array {
    const str = decodeString(data)
    const obj = decodeJson<MockEncryptedObject>(str)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (!(assertTypedArrayEqual(obj.nonce, nonce) && assertTypedArrayEqual(obj.key!, key))) {
      throw new TypeError('Unable to decrypt secret with given parameters')
    }
    return obj.secret
  }

  decryptAsymmetric(
    message: Uint8Array,
    nonce: Uint8Array,
    theirPubKey: Uint8Array,
    ownSecKey: Uint8Array,
  ): Uint8Array {
    const str = decodeString(message)
    const obj = decodeJson<MockEncryptedObject>(str)
    if (!assertTypedArrayEqual(obj.nonce, nonce)) {
      throw new TypeError('Unable to decrypt secret with given parameters')
    }
    return obj.secret
  }

  encryptAsymmetric(secret: Uint8Array, nonce: Uint8Array, theirPubKey: Uint8Array, ownSecKey: Uint8Array): Uint8Array {
    if (ownSecKey.byteLength !== 32) {
      throw new TypeError('Secret key must be 32 bytes long')
    }
    if (theirPubKey.byteLength !== 32) {
      throw new TypeError('Public key must be 32 bytes long')
    }
    const obj: MockEncryptedObject = { secret, nonce, theirPubKey, ownSecKey }
    const str = encodeJson(obj)
    const bin = encodeString(str)
    return bin
  }

  createAsymmetricKeyPair(asymSecretKey?: Uint8Array): UserPubKey {
    if (asymSecretKey && asymSecretKey?.byteLength !== 32) {
      throw new TypeError('Secret key must be 32 bytes long')
    }
    return {
      publicKey: new Uint8Array(32),
      secretKey: asymSecretKey ?? new Uint8Array(32),
    }
  }

  getRandomBytes(length: number): Uint8Array {
    const getRandom6Bytes = () =>
      (new Array(12).fill('0').join('') + Math.random().toString(16).slice(2))
        .slice(-12)
        .replace(/(..)(?!$)/g, '$1,')
        .split(',')
        .map(x => +x)
    const multOfSix = Math.ceil(length / 6)
    const numbers = [...new Array(multOfSix)]
      .flatMap(() => getRandom6Bytes())
      .flatMap(x => x)
      .slice(0, length)
    return new Uint8Array(numbers)
  }

  getHash(input: Uint8Array): Uint8Array {
    return input.slice(0, 64)
  }
}
