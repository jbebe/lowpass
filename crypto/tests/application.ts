import { getRandomString } from '../src/helpers/random'
import { AccountService } from '../src/services/account-service'
import { Application } from '../src/services/application'
import { CryptoService } from '../src/services/crypto-service'
import { StoreService } from '../src/services/store-service'
import { MockApiService } from '../src/test-helpers/api'
import { createTestSecret } from '../src/test-helpers/user'
import { LoginData } from '../src/types/user'

test('Full test', async () => {
  // Init services
  const cryptoService = new CryptoService()
  const apiService = new MockApiService()
  const accountService = new AccountService(apiService, cryptoService)
  const storeService = new StoreService(apiService, cryptoService)

  // Register test user
  const loginData: LoginData = {
    email: `test+${getRandomString(5)}@lowpass.local`,
    password: getRandomString(5),
  }
  await Application.registerAsync(loginData, accountService)

  // Login
  const app = await Application.loginAsync(loginData, () => ({ accountService, storeService }))

  // Load secrets
  let secrets = Object.values(app.getSecrets())
  expect(secrets.length).toBe(0)

  // Create secret x2
  {
    const secret = createTestSecret()
    await app.createSecretAsync(secret)
  }
  {
    const secret = createTestSecret()
    await app.createSecretAsync(secret)
  }

  // Get all secrets
  secrets = Object.values(app.getSecrets())
  expect(secrets.length).toBe(2)

  // Invite user to secret
})
