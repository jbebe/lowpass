import { createSymmetricKey } from '../crypto-wrapper/random'
import {
  decryptBytesSymmetric,
  decryptObjSymmetric,
  encryptBytesSymmetric,
  encryptObjSymmetric,
} from '../helpers/symmetric'
import { SecretPackage } from '../types/package'
import { Secret } from '../types/secret'
import { User } from '../types/user'

export class CryptoService {
  constructor(private user: User) {}

  public createPackage(secret: Secret): SecretPackage {
    const secretKey = createSymmetricKey()
    const encSecret = encryptObjSymmetric(secret, secretKey)
    const encSecretKey = encryptBytesSymmetric(secretKey, this.user.crypto.sym.key)
    const keyTable = { [this.user.id]: encSecretKey }
    return {
      secret: encSecret,
      keyTable,
    }
  }

  public decryptPackage(pkg: SecretPackage) {
    const encSecretKey = pkg.keyTable[this.user.id]
    const secretKey = decryptBytesSymmetric(encSecretKey, this.user.crypto.sym.key)
    const secret = decryptObjSymmetric(pkg.secret, secretKey) as Secret
    return secret
  }
}
