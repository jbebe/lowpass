import { mapEncryptedToUser } from '../helpers/mappers'
import { IApiService } from '../types/api'
import { EncryptedSecret } from '../types/package'
import { SecretInvite, UserSecretPair } from '../types/secret'
import { DetailedUser, EncryptedUser, LoginData, User, UserQuery } from '../types/user'

export class MockApiService implements IApiService {
  private db = {
    users: [] as EncryptedUser[],
    secrets: [] as EncryptedSecret[],
    invites: [] as SecretInvite[],
    members: [] as UserSecretPair[],
  }

  public async registerAsync(encryptedUser: EncryptedUser): Promise<void> {
    await Promise.resolve()
    const hasUser = this.db.users.find(x => x.email === encryptedUser.email)
    if (hasUser) {
      throw new Error('User is already registered')
    }
    this.db.users.push(encryptedUser)
  }

  public async loginAsync(loginData: LoginData): Promise<EncryptedUser> {
    await Promise.resolve()
    const encryptedUser = this.db.users.find(x => x.email === loginData.email)
    if (!encryptedUser) {
      throw new Error('User is not available')
    }
    return encryptedUser
  }

  public async createSecretAsync(secretPackage: EncryptedSecret, owner: DetailedUser): Promise<void> {
    await Promise.resolve()
    const pkg = this.db.secrets.find(x => x.secretId === secretPackage.secretId)
    if (pkg) {
      throw new Error('Secret is already created')
    }
    this.db.secrets.push(secretPackage)

    const user = this.db.members.find(x => x.secretId === secretPackage.secretId && x.userId === owner.id)
    if (user) {
      throw new Error('User-secret connection already exists')
    }
    this.db.members.push({
      secretId: secretPackage.secretId,
      userId: owner.id,
    })
  }

  public async getUserAsync(query: UserQuery): Promise<User> {
    await Promise.resolve()
    if (query.email === query.id) {
      throw new Error('Only one query param must be filled')
    }
    const user = this.db.users.find(u => (query.id ? u.id === query.id : u.email === query.email))
    if (!user) {
      throw new Error('There is no user with this email')
    }
    return mapEncryptedToUser(user)
  }

  public async updateSecretAsync(secret: EncryptedSecret): Promise<void> {
    await Promise.resolve()
    const packageIndex = this.db.secrets.findIndex(x => x.secretId === secret.secretId)
    if (packageIndex === -1) {
      throw new Error('Secret not found')
    }
    this.db.secrets[packageIndex] = secret
  }

  public async inviteAsync(secret: EncryptedSecret, invitee: User, inviter: User): Promise<void> {
    await Promise.resolve()
    const packageIndex = this.db.secrets.findIndex(x => x.secretId === secret.secretId)
    if (packageIndex === -1) {
      throw new Error('Secret not found')
    }
    this.db.secrets[packageIndex].keyTable.invited = secret.keyTable.invited

    const inviteIndex = this.db.invites.findIndex(x => x.secretId === secret.secretId && x.inviteeId === invitee.id)
    if (inviteIndex !== -1) {
      throw new Error('Invite already exists')
    }
    this.db.invites.push({ secretId: secret.secretId, inviteeId: invitee.id, inviterId: inviter.id })
  }

  public async getSecretsAsync(owner: DetailedUser): Promise<EncryptedSecret[]> {
    await Promise.resolve()
    const ownSecretIds = this.db.members.filter(x => x.userId === owner.id).map(x => x.secretId)
    return ownSecretIds.map(ownId => {
      const pkg = this.db.secrets.find(pkg => pkg.secretId == ownId)
      if (!pkg) {
        throw new Error('Missing secret')
      }
      return pkg
    })
  }

  public async getInvitesAsync(owner: DetailedUser): Promise<SecretInvite[]> {
    await Promise.resolve()
    return this.db.invites.filter(x => x.inviteeId === owner.id)
  }

  public async getSecretAsync(secretId: string, userId: string): Promise<EncryptedSecret> {
    const secret = this.db.secrets.find(x => x.secretId === secretId)
    if (!secret) {
      throw new Error('Missing secret')
    }
    if (!(userId in { ...secret.keyTable.invited, ...secret.keyTable.member })) {
      throw new Error('Secret is not accessible for user')
    }
    return secret
  }

  public async acceptInviteAsync(secret: EncryptedSecret, invitee: User): Promise<void> {
    await this.updateSecretAsync(secret)
    this.db.members.push({ secretId: secret.secretId, userId: invitee.id })
  }
}
