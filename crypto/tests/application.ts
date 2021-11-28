import { CryptoFunctions } from '../src/crypto-wrapper/crypto-functions'
import { getRandomString } from '../src/helpers/random'
import { AccountService } from '../src/services/account-service'
import { Application } from '../src/services/application'
import { CryptoService } from '../src/services/crypto-service'
import { StoreService } from '../src/services/store-service'
import { MockApiService } from '../src/test-helpers/api'
import { MockCryptoWrapper } from '../src/test-helpers/crypto-wrapper'
import { createTestSecret } from '../src/test-helpers/user'
import { LoginData } from '../src/types/user'

test('Full test', async () => {
  // Init services
  const cryptoFns = new CryptoFunctions(new MockCryptoWrapper())
  const cryptoService = new CryptoService(cryptoFns)
  const apiService = new MockApiService()
  const accountService = new AccountService(apiService, cryptoService)
  const storeService = new StoreService(apiService, cryptoService)

  const createUserAsync = async () => {
    const loginData: LoginData = {
      email: `test+${getRandomString(5)}@lowpass.local`,
      password: getRandomString(5),
    }
    await Application.registerAsync(loginData, accountService)

    // Login
    return await Application.loginAsync(loginData, () => ({ accountService, storeService }))
  }

  // Register & login test user
  const app1 = await createUserAsync()

  // Load secrets
  let secrets = Object.values(await app1.getSecretsAsync())
  expect(secrets.length).toBe(0)

  // Create secret x2
  const secret = createTestSecret()
  await app1.createSecretAsync(secret)
  const secret2 = createTestSecret()
  await app1.createSecretAsync(secret2)

  // Get all secrets
  secrets = Object.values(await app1.getSecretsAsync())
  expect(secrets.length).toBe(2)
  expect(secrets[0].secret).toEqual(secret)
  expect(secrets[1].secret).toEqual(secret2)

  // Create another user
  const app2 = await createUserAsync()

  // Invite new user to secret
  const user2 = await app1.getUserAsync(app2.user.email)
  expect(user2.id).toBe(app2.user.id)
  await app1.inviteAsync(secret.id, user2)

  const invites = await app2.getInvitesAsync()
  expect(Object.values(invites).length).toBe(1)
  //await app2.acceptInviteAsync(invite)
})
