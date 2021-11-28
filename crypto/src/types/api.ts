import { EncryptedSecret } from './package'
import { DetailedUser, EncryptedUser, LoginData, User } from './user'

export interface IApiService {
  registerAsync(encryptedUser: EncryptedUser): Promise<void>
  loginAsync(loginData: LoginData): Promise<EncryptedUser>
  createSecretAsync(secretPackage: EncryptedSecret, owner: DetailedUser): Promise<void>
  getUserAsync(email: string): Promise<User>
  updateSecretAsync(secret: EncryptedSecret): Promise<void>
  inviteAsync(secret: EncryptedSecret, invited: User): Promise<void>
  getSecretsAsync(owner: DetailedUser): Promise<EncryptedSecret[]>
}
