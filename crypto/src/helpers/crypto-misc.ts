import { Secret } from '../types/secret'
import { CryptoData } from '../types/user'
import { EncryptedObject } from './asymmetric'
import { decryptObjSymmetric } from './symmetric'

export function decryptCryptoData(cryptoData: EncryptedObject, key: Uint8Array): CryptoData {
  const pojo = decryptObjSymmetric(cryptoData, key) as CryptoData
  return {
    ...pojo,
    asym: {
      publicKey: new Uint8Array(pojo.asym.publicKey),
      secretKey: new Uint8Array(pojo.asym.secretKey),
    },
    sym: {
      key: new Uint8Array(pojo.sym.key),
      salt: new Uint8Array(pojo.sym.salt),
    },
  }
}

export function decryptSecret(cryptoData: EncryptedObject, key: Uint8Array): Secret {
  const pojo = decryptObjSymmetric(cryptoData, key) as Secret
  return pojo
}
