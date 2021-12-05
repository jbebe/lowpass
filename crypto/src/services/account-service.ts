import { IApiService } from '../types/api'
import { DetailedUser, LoginData, User, UserQuery } from '../types/user'
import { CryptoService } from './crypto-service'

export class AccountService {
  constructor(private apiService: IApiService, private cryptoService: CryptoService) {}

  public async registerAsync(loginData: LoginData): Promise<DetailedUser> {
    const { encryptedUser, detailedUser } = this.cryptoService.createUser(loginData)
    await this.apiService.registerAsync(encryptedUser)
    return detailedUser
  }

  public async loginAsync(loginData: LoginData): Promise<DetailedUser> {
    const encryptedUser = await this.apiService.loginAsync(loginData)
    const detailedUser = this.cryptoService.login(loginData, encryptedUser)
    return detailedUser
  }

  public async getUserByEmailAsync(query: UserQuery): Promise<User> {
    return await this.apiService.getUserAsync(query)
  }
}
