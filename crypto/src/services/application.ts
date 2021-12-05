import { FlatObject } from '../common/type'
import { SecretPackage } from '../types/package'
import { Secret, SecretInvite } from '../types/secret'
import { DetailedUser, LoginData, User, UserQuery } from '../types/user'
import { AccountService } from './account-service'
import { StoreService } from './store-service'

export type ApplicationServices = {
  accountService: AccountService
  storeService: StoreService
}

export class Application {
  private _user: DetailedUser
  private secrets: FlatObject<SecretPackage>
  private invites: SecretInvite[]

  private accountService: AccountService
  private storeService: StoreService

  constructor(user: DetailedUser, state: ApplicationServices) {
    this._user = user
    this.secrets = {}
    this.invites = []

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
    await this.storeService.createSecretAsync(secret, this._user)
  }

  public async getSecretsAsync(): Promise<FlatObject<SecretPackage>> {
    this.secrets = await this.storeService.getSecretsAsync(this.user)
    return this.secrets
  }

  public get user() {
    return this._user
  }

  public async getUserAsync(query: UserQuery): Promise<User> {
    const user = await this.accountService.getUserByEmailAsync(query)
    return user
  }

  public async inviteAsync(secretId: string, invitee: User): Promise<void> {
    const { encryptedSecret } = this.secrets[secretId]
    this.storeService.inviteAsync(encryptedSecret, invitee, this.user)
  }

  public async getInvitesAsync(): Promise<SecretInvite[]> {
    this.invites = await this.storeService.getIvitesAsync(this.user)
    return this.invites
  }

  public async acceptInviteAsync(secretInvite: SecretInvite): Promise<void> {
    const inviter = await this.getUserAsync({ id: secretInvite.inviterId })
    await this.storeService.acceptInviteAsync(secretInvite.secretId, this.user, inviter)
  }
}
