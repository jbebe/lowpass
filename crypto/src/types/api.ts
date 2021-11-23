import { EncryptedSecret } from './package'
import { EncryptedUser, LoginData } from './user'

export interface IApiService {
  registerAsync(encryptedUser: EncryptedUser): Promise<void>

  loginAsync(loginData: LoginData): Promise<EncryptedUser>

  createSecretAsync(secretPackage: EncryptedSecret): Promise<void>
}
