import NaCl from 'tweetnacl'

function validate(nonce: Uint8Array, key: Uint8Array) {
  if (nonce.byteLength !== NaCl.secretbox.nonceLength) {
    throw new RangeError(`Nonce must be ${NaCl.secretbox.nonceLength} bytes long`)
  }
  if (key.byteLength !== NaCl.secretbox.keyLength) {
    throw new RangeError(`Key must be ${NaCl.secretbox.keyLength} bytes long`)
  }
}

export function encryptSymmetric(secret: Uint8Array, nonce: Uint8Array, key: Uint8Array) {
  validate(nonce, key)
  return NaCl.secretbox(secret, nonce, key)
}

export function decryptSymmetric(data: Uint8Array, nonce: Uint8Array, key: Uint8Array): Uint8Array {
  validate(nonce, key)
  const secret = NaCl.secretbox.open(data, nonce, key)
  if (secret === null) {
    throw new TypeError('Unable to decrypt secret with given parameters')
  }
  return secret
}
