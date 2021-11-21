import NaCl from 'tweetnacl'

export const AsymmetricNonceLength = NaCl.box.nonceLength

export const SymmetricNonceLength = NaCl.secretbox.nonceLength
