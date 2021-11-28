// TODO: this file needs to be moved to the wrapper as it contains NaCl implicitly

import NaCl from 'tweetnacl'

export const AsymmetricNonceLength = NaCl.box.nonceLength

export const SymmetricNonceLength = NaCl.secretbox.nonceLength
