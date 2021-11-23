import { IApiService } from '../types/api'
import { EncryptedSecret } from '../types/package'
import { Secret } from '../types/secret'
import { DetailedUser } from '../types/user'
import { CryptoService } from './crypto-service'

export class StoreService {
  constructor(private apiService: IApiService, private cryptoService: CryptoService) {}

  public async createSecretAsync(secret: Secret, user: DetailedUser): Promise<EncryptedSecret> {
    const secretPackage = this.cryptoService.createPackage(secret, user)
    this.apiService.createSecretAsync(secretPackage)
    return secretPackage
  }
  /*

  public getSecrets(): Secret[] {
    const packages = this.storage.getAll(CollectionType.Secret, '') as EncryptedSecret[]
    return packages.map(pkg => this.crypto.decryptPackage(pkg))
  }

  

  public getMembers(secret: Secret): FlatObject<User> {
    const pkg = this.storage.get(CollectionType.Secret, secret.id) as EncryptedSecret
    const memberIds = Object.keys(pkg.keyTable.member)
    return createMap(
      memberIds.map(id => this.accountService.getUser(id)),
      user => user.id,
    )
  }

  public invite(newUser: User, secret: Secret): void {
    // we should probably move this whole section to the crypto service
    const pkg = this.storage.get(CollectionType.Secret, secret.id) as EncryptedSecret
    if (newUser.id in pkg.keyTable.member) {
      throw new Error('User already member of the secret')
    }
    if (newUser.id in pkg.keyTable.invited) {
      throw new Error('User already invited to secret')
    }
    const encSecretKey = pkg.keyTable.member[this.user.id]
    const secretKey = decryptBytesSymmetric(encSecretKey, this.user.crypto.sym.key)
    const encSecretKeyWithNewUserPubKey = encryptBytesAsymmetric(
      secretKey,
      newUser.crypto.asym.publicKey,
      this.user.crypto.asym.secretKey,
    )
    pkg.keyTable.invited[newUser.id] = encSecretKeyWithNewUserPubKey
    this.storage.put(CollectionType.Secret, pkg.secretId, pkg)
  }*/
}
