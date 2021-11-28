import { mapEncryptedToUser } from '../helpers/mappers'
import { IApiService } from '../types/api'
import { EncryptedSecret } from '../types/package'
import { UserSecretPair } from '../types/secret'
import { DetailedUser, EncryptedUser, LoginData, User } from '../types/user'

export class MockApiService implements IApiService {
  private db = {
    encryptedUser: [] as EncryptedUser[],
    packages: [] as EncryptedSecret[],
    invited: [] as UserSecretPair[],
    member: [] as UserSecretPair[],
  }

  public async registerAsync(encryptedUser: EncryptedUser): Promise<void> {
    await Promise.resolve()
    const hasUser = this.db.encryptedUser.find(x => x.email === encryptedUser.email)
    if (hasUser) {
      throw new Error('User is already registered')
    }
    this.db.encryptedUser.push(encryptedUser)
  }

  public async loginAsync(loginData: LoginData): Promise<EncryptedUser> {
    await Promise.resolve()
    const encryptedUser = this.db.encryptedUser.find(x => x.email === loginData.email)
    if (!encryptedUser) {
      throw new Error('User is not available')
    }
    return encryptedUser
  }

  public async createSecretAsync(secretPackage: EncryptedSecret, owner: DetailedUser): Promise<void> {
    await Promise.resolve()
    const pkg = this.db.packages.find(x => x.secretId === secretPackage.secretId)
    if (pkg) {
      throw new Error('Secret is already created')
    }
    this.db.packages.push(secretPackage)

    const user = this.db.member.find(x => x.secretId === secretPackage.secretId && x.userId === owner.id)
    if (user) {
      throw new Error('User-secret connection already exists')
    }
    this.db.member.push({
      secretId: secretPackage.secretId,
      userId: owner.id,
    })
  }

  public async getUserAsync(email: string): Promise<User> {
    await Promise.resolve()
    const user = this.db.encryptedUser.find(x => x.email === email)
    if (!user) {
      throw new Error('There is no user with this email')
    }
    return mapEncryptedToUser(user)
  }

  public async updateSecretAsync(secret: EncryptedSecret): Promise<void> {
    await Promise.resolve()
    const packageIndex = this.db.packages.findIndex(x => x.secretId === secret.secretId)
    if (packageIndex === -1) {
      throw new Error('Secret not found')
    }
    this.db.packages[packageIndex] = secret
  }

  public async inviteAsync(secret: EncryptedSecret, invited: User): Promise<void> {
    await Promise.resolve()
    const packageIndex = this.db.packages.findIndex(x => x.secretId === secret.secretId)
    if (packageIndex === -1) {
      throw new Error('Secret not found')
    }
    this.db.packages[packageIndex].keyTable.invited = secret.keyTable.invited

    const inviteIndex = this.db.invited.findIndex(x => x.secretId === secret.secretId && x.userId === invited.id)
    if (inviteIndex !== -1) {
      throw new Error('Invite already exists')
    }
    this.db.invited.push({ secretId: secret.secretId, userId: invited.id })
  }

  public async getSecretsAsync(owner: DetailedUser): Promise<EncryptedSecret[]> {
    await Promise.resolve()
    const ownSecretIds = this.db.member.filter(x => x.userId === owner.id).map(x => x.secretId)
    return ownSecretIds.map(ownId => {
      const pkg = this.db.packages.find(pkg => pkg.secretId == ownId)
      if (!pkg) {
        throw new Error('Missing secret')
      }
      return pkg
    })
  }
}
