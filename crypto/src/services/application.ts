import { FlatObject } from '../common/type'
import { EncryptedSecret, SecretPackage } from '../types/package'
import { Secret, UserSecretPair } from '../types/secret'
import { DetailedUser, LoginData, User } from '../types/user'
import { AccountService } from './account-service'
import { StoreService } from './store-service'

export type ApplicationServices = {
  accountService: AccountService
  storeService: StoreService
}

export class Application {
  private _user: DetailedUser
  private secrets: FlatObject<SecretPackage>
  private invites: FlatObject<EncryptedSecret>

  private accountService: AccountService
  private storeService: StoreService

  constructor(user: DetailedUser, state: ApplicationServices) {
    this._user = user
    this.secrets = {}
    this.invites = {}

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
    const encSec = await this.storeService.createSecretAsync(secret, this._user)
    this.updateSecrets(secret, encSec)
  }

  public async getSecretsAsync(): Promise<FlatObject<SecretPackage>> {
    this.secrets = await this.storeService.getSecretsAsync(this._user)
    return this.secrets
  }

  public get user() {
    return this._user
  }

  public async getUserAsync(email: string): Promise<User> {
    const user = await this.accountService.getUserAsync(email)
    return user
  }

  public async inviteAsync(secretId: string, user: User): Promise<void> {
    const { encryptedSecret } = this.secrets[secretId]
    this.storeService.inviteAsync(encryptedSecret, user, this._user)
  }

  public async getInvitesAsync(): Promise<FlatObject<EncryptedSecret>> {
    await Promise.resolve()
    return this.invites
  }

  //
  // Internal methods
  //

  private updateSecrets(secret: Secret, encryptedSecret: EncryptedSecret) {
    this.secrets[secret.id] = { secret, encryptedSecret }
  }

  private validateState() {
    if (!this._user) {
      throw new Error('User is not logged in!')
    }
  }
}
