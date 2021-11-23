import { IApiService } from '../types/api'
import { EncryptedSecret } from '../types/package'
import { EncryptedUser, LoginData } from '../types/user'

export class MockApiService implements IApiService {
  private db = {
    encryptedUser: [] as EncryptedUser[],
    packages: [] as EncryptedSecret[],
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

  public async createSecretAsync(secretPackage: EncryptedSecret): Promise<void> {
    await Promise.resolve()
    const pkg = this.db.packages.find(x => x.secretId === secretPackage.secretId)
    if (pkg) {
      throw new Error('Secret is already created')
    }
    this.db.packages.push(secretPackage)
  }
}
