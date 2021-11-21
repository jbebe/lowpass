import NaCl from 'tweetnacl'

export type AsymmetricKeyPair = {
  publicKey: Uint8Array
  secretKey: Uint8Array
}

/**
 * Optional secret key must be 64 bytes long
 */
export function createAsymmetricKeyPair(secretKey?: Uint8Array): AsymmetricKeyPair {
  let keyPair: NaCl.BoxKeyPair
  if (secretKey) {
    if (secretKey.byteLength !== NaCl.sign.secretKeyLength) {
      throw new RangeError('Secret key length must be 64 bytes')
    }
    keyPair = NaCl.box.keyPair.fromSecretKey(secretKey)
  } else {
    keyPair = NaCl.box.keyPair()
  }
  return keyPair
}

function validate(nonce: Uint8Array, pubKey: Uint8Array, privKey: Uint8Array) {
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

export function encryptAsymmetric(
  message: Uint8Array,
  nonce: Uint8Array,
  theirPubKey: Uint8Array,
  ownSecKey: Uint8Array,
) {
  validate(nonce, theirPubKey, ownSecKey)
  return NaCl.box(message, nonce, theirPubKey, ownSecKey)
}

export function decryptAsymmetric(
  message: Uint8Array,
  nonce: Uint8Array,
  theirPubKey: Uint8Array,
  ownSecKey: Uint8Array,
): Uint8Array {
  validate(nonce, theirPubKey, ownSecKey)
  const secret = NaCl.box.open(message, nonce, theirPubKey, ownSecKey)
  if (secret === null) {
    throw new TypeError('Unable to decrypt secret with given parameters')
  }
  return secret
}
