import NaCl from 'tweetnacl'

export type AsymmetricKeyPair = {
  publicKey: Uint8Array
  secretKey: Uint8Array
}

export function createAsymmetricKeyPair(secretKey?: Uint8Array): AsymmetricKeyPair {
  let keyPair: NaCl.BoxKeyPair
  if (secretKey) {
    keyPair = NaCl.box.keyPair.fromSecretKey(secretKey)
  } else {
    keyPair = NaCl.box.keyPair()
  }
  return keyPair
}

export function encryptAsymmetric(
  message: Uint8Array,
  nonce: Uint8Array,
  theirPubKey: Uint8Array,
  ownSecKey: Uint8Array,
) {
  const encData = NaCl.box(message, nonce, theirPubKey, ownSecKey)
  return encData
}
