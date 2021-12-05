import { CryptoFunctions } from '../crypto-wrapper/crypto-functions'
import {
  createSymmetricKey,
  createSymmetricKeyFromPassword,
  deriveSymmetricKeyFromPassword,
} from '../crypto-wrapper/random'
import { decryptCryptoData, decryptSecret } from '../helpers/crypto-misc'
import { getRandomString } from '../helpers/random'
import { KeyTable, EncryptedSecret } from '../types/package'
import { Secret } from '../types/secret'
import { CryptoData, DetailedUser, EncryptedUser, LoginData, User } from '../types/user'

export class CryptoService {
  constructor(private cryptoFns: CryptoFunctions) {}

  public createUser(loginData: LoginData): { encryptedUser: EncryptedUser; detailedUser: DetailedUser } {
    const { key, salt } = createSymmetricKeyFromPassword(loginData.password)
    const { publicKey, secretKey } = this.cryptoFns.createAsymmetricKeyPair()
    const userId = getRandomString(10)
    const cryptoData: CryptoData = {
      asym: { publicKey, secretKey },
      sym: { key, salt },
    }

    const encryptedUser: EncryptedUser = {
      id: userId,
      email: loginData.email,
      passwordSalt: salt,
      encrypted: this.cryptoFns.encryptObjSymmetric(cryptoData, key),
      crypto: {
        asym: {
          publicKey,
        },
      },
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
    const crypto = decryptCryptoData(this.cryptoFns, encryptedUser.encrypted, key)
    const detailedUser: DetailedUser = {
      id: encryptedUser.id,
      email: encryptedUser.email,
      crypto,
    }
    return detailedUser
  }

  public createPackage(secret: Secret, user: DetailedUser): EncryptedSecret {
    const secretKey = createSymmetricKey()
    const encSecret = this.cryptoFns.encryptObjSymmetric(secret, secretKey)
    const encSecretKey = this.cryptoFns.encryptBytesSymmetric(secretKey, user.crypto.sym.key)
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
    const secretKey = this.cryptoFns.decryptBytesSymmetric(encSecretKey, user.crypto.sym.key)
    const secret = decryptSecret(this.cryptoFns, pkg.secret, secretKey)
    return secret
  }

  public invite(encSec: EncryptedSecret, invited: User, owner: DetailedUser): EncryptedSecret {
    if (invited.id in encSec.keyTable.member) {
      throw new Error('User already member of the secret')
    }
    if (invited.id in encSec.keyTable.invited) {
      throw new Error('User already invited to secret')
    }
    const encSecretKey = encSec.keyTable.member[owner.id]
    const secretKey = this.cryptoFns.decryptBytesSymmetric(encSecretKey, owner.crypto.sym.key)
    const encSecretKeyWithNewUserPubKey = this.cryptoFns.encryptBytesAsymmetric(
      secretKey,
      invited.crypto.asym.publicKey,
      owner.crypto.asym.secretKey,
    )
    encSec.keyTable.invited[invited.id] = encSecretKeyWithNewUserPubKey
    return encSec
  }

  public acceptInvite(secret: EncryptedSecret, invitee: DetailedUser, inviter: User): EncryptedSecret {
    const invitation = secret.keyTable.invited[invitee.id]
    delete secret.keyTable.invited[invitee.id]
    const secretKey = this.cryptoFns.decryptBytesAsymmetric(
      invitation,
      inviter.crypto.asym.publicKey,
      invitee.crypto.asym.secretKey,
    )
    const encSecretKey = this.cryptoFns.encryptBytesSymmetric(secretKey, invitee.crypto.sym.key)
    secret.keyTable.member[invitee.id] = encSecretKey
    return secret
  }
}
