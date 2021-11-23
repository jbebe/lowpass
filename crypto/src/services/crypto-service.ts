import { createAsymmetricKeyPair } from '../crypto-wrapper/asymmetric'
import {
  createSymmetricKey,
  createSymmetricKeyFromPassword,
  deriveSymmetricKeyFromPassword,
} from '../crypto-wrapper/random'
import { decryptCryptoData, decryptSecret } from '../helpers/crypto-misc'
import { getRandomString } from '../helpers/random'
import { decryptBytesSymmetric, encryptBytesSymmetric, encryptObjSymmetric } from '../helpers/symmetric'
import { KeyTable, EncryptedSecret } from '../types/package'
import { Secret } from '../types/secret'
import { CryptoData, DetailedUser, EncryptedUser, LoginData } from '../types/user'

export class CryptoService {
  public createUser(loginData: LoginData): { encryptedUser: EncryptedUser; detailedUser: DetailedUser } {
    const { key, salt } = createSymmetricKeyFromPassword(loginData.password)
    const { publicKey, secretKey } = createAsymmetricKeyPair()
    const userId = getRandomString(10)
    const cryptoData: CryptoData = {
      asym: { publicKey, secretKey },
      sym: { key, salt },
    }

    const encryptedUser: EncryptedUser = {
      id: userId,
      email: loginData.email,
      passwordSalt: salt,
      crypto: encryptObjSymmetric(cryptoData, key),
    }
    const detailedUser: DetailedUser = {
      id: userId,
      email: loginData.email,
      crypto: cryptoData,
    }
    return { encryptedUser, detailedUser }
  }

  public login(loginData: LoginData, encryptedUser: EncryptedUser): DetailedUser {
    const key = deriveSymmetricKeyFromPassword(loginData.password, encryptedUser.passwordSalt)
    const crypto = decryptCryptoData(encryptedUser.crypto, key)
    const detailedUser: DetailedUser = {
      id: encryptedUser.id,
      email: encryptedUser.email,
      crypto,
    }
    return detailedUser
  }

  public createPackage(secret: Secret, user: DetailedUser): EncryptedSecret {
    const secretKey = createSymmetricKey()
    const encSecret = encryptObjSymmetric(secret, secretKey)
    const encSecretKey = encryptBytesSymmetric(secretKey, user.crypto.sym.key)
    const keyTable: KeyTable = {
      member: {
        [user.id]: encSecretKey,
      },
      invited: {},
      removed: {},
    }
    return {
      secretId: secret.id,
      secret: encSecret,
      keyTable,
    }
  }

  public decryptPackage(pkg: EncryptedSecret, user: DetailedUser) {
    const encSecretKey = pkg.keyTable.member[user.id]
    const secretKey = decryptBytesSymmetric(encSecretKey, user.crypto.sym.key)
    const secret = decryptSecret(pkg.secret, secretKey)
    return secret
  }
}
