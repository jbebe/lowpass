import { IApiService } from '../types/api'
import { EncryptedSecret } from '../types/package'
import { EncryptedUser, LoginData } from '../types/user'

export class ApiService implements IApiService {
  registerAsync(encryptedUser: EncryptedUser): Promise<void> {
    throw new Error('Method not implemented.')
  }
  loginAsync(loginData: LoginData): Promise<EncryptedUser> {
    throw new Error('Method not implemented.')
  }
  createSecretAsync(secretPackage: EncryptedSecret): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
