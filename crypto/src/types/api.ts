import { EncryptedSecret } from './package'
import { SecretInvite } from './secret'
import { DetailedUser, EncryptedUser, LoginData, User, UserQuery } from './user'

export interface IApiService {
  registerAsync(encryptedUser: EncryptedUser): Promise<void>
  loginAsync(loginData: LoginData): Promise<EncryptedUser>
  createSecretAsync(secretPackage: EncryptedSecret, owner: DetailedUser): Promise<void>
  getUserAsync(email: UserQuery): Promise<User>
  updateSecretAsync(secret: EncryptedSecret): Promise<void>
  inviteAsync(secret: EncryptedSecret, invitee: User, inviter: User): Promise<void>
  getInvitesAsync(owner: DetailedUser): Promise<SecretInvite[]>
  getSecretsAsync(owner: DetailedUser): Promise<EncryptedSecret[]>
  getSecretAsync(secretId: string, userId: string): Promise<EncryptedSecret>
  acceptInviteAsync(secret: EncryptedSecret, invitee: User): Promise<void>
}
