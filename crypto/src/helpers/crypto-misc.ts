import { CryptoFunctions } from '../crypto-wrapper/crypto-functions'
import { Secret } from '../types/secret'
import { CryptoData, EncryptedObject } from '../types/user'

export function decryptCryptoData(
  cryptoFns: CryptoFunctions,
  cryptoData: EncryptedObject,
  key: Uint8Array,
): CryptoData {
  const pojo = cryptoFns.decryptObjSymmetric(cryptoData, key) as CryptoData
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

export function decryptSecret(cryptoFns: CryptoFunctions, cryptoData: EncryptedObject, key: Uint8Array): Secret {
  const pojo = cryptoFns.decryptObjSymmetric(cryptoData, key) as Secret
  return pojo
}
