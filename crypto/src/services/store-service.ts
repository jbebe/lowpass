import { createMap } from '../common/object'
import { FlatObject } from '../common/type'
import { IApiService } from '../types/api'
import { EncryptedSecret, SecretPackage } from '../types/package'
import { Secret, SecretInvite } from '../types/secret'
import { DetailedUser, User } from '../types/user'
import { CryptoService } from './crypto-service'

export class StoreService {
  constructor(private apiService: IApiService, private cryptoService: CryptoService) {}

  public async createSecretAsync(secret: Secret, user: DetailedUser): Promise<EncryptedSecret> {
    const secretPackage = this.cryptoService.createPackage(secret, user)
    this.apiService.createSecretAsync(secretPackage, user)
    return secretPackage
  }

  public async inviteAsync(encryptedSecret: EncryptedSecret, invitee: User, owner: DetailedUser): Promise<void> {
    encryptedSecret = this.cryptoService.invite(encryptedSecret, invitee, owner)
    this.apiService.inviteAsync(encryptedSecret, invitee, owner)
  }

  public async getIvitesAsync(owner: DetailedUser): Promise<SecretInvite[]> {
    return await this.apiService.getInvitesAsync(owner)
  }

  public async getSecretsAsync(owner: DetailedUser): Promise<FlatObject<SecretPackage>> {
    const encSecs = await this.apiService.getSecretsAsync(owner)
    const packages = encSecs.map(encSec => ({
      secret: this.cryptoService.decryptPackage(encSec, owner),
      encryptedSecret: encSec,
    }))
    return createMap(packages, pkg => pkg.secret.id)
  }

  public async acceptInviteAsync(secretId: string, owner: DetailedUser, inviter: User): Promise<void> {
    let secret = await this.apiService.getSecretAsync(secretId, owner.id)
    secret = this.cryptoService.acceptInvite(secret, owner, inviter)
    await this.apiService.acceptInviteAsync(secret, owner)
  }
}
