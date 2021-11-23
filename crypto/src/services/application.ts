import { FlatObject } from '../common/type'
import { EncryptedSecret, SecretPackage } from '../types/package'
import { Secret } from '../types/secret'
import { DetailedUser, LoginData } from '../types/user'
import { AccountService } from './account-service'
import { StoreService } from './store-service'

export type ApplicationServices = {
  accountService: AccountService
  storeService: StoreService
}

export class Application {
  private user: DetailedUser
  private secrets: FlatObject<SecretPackage>

  private accountService: AccountService
  private storeService: StoreService

  constructor(user: DetailedUser, state: ApplicationServices) {
    this.user = user
    this.secrets = {}

    this.accountService = state.accountService
    this.storeService = state.storeService
  }

  public static async registerAsync(loginData: LoginData, accountService: AccountService) {
    return await accountService.registerAsync(loginData)
  }

  public static async loginAsync(loginData: LoginData, getServices: () => ApplicationServices): Promise<Application> {
    const services = getServices()
    const user = await services.accountService.loginAsync(loginData)
    return new Application(user, services)
  }

  public async createSecretAsync(secret: Secret) {
    this.validateState()
    const encSec = await this.storeService.createSecretAsync(secret, this.user)
    this.updateSecrets(secret, encSec)
  }

  public getSecrets(): FlatObject<SecretPackage> {
    return this.secrets
  }

  //
  // Internal methods
  //

  private updateSecrets(secret: Secret, encryptedSecret: EncryptedSecret) {
    this.secrets[secret.id] = { secret, encryptedSecret }
  }

  private validateState() {
    if (!this.user) {
      throw new Error('User is not logged in!')
    }
  }
}
