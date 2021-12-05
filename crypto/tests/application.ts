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
  let secretsApp1 = Object.values(await app1.getSecretsAsync())
  expect(secretsApp1.length).toBe(0)

  // Create secret x2
  const secretOnly1App1 = createTestSecret()
  await app1.createSecretAsync(secretOnly1App1)
  const secretOnly2App1 = createTestSecret()
  await app1.createSecretAsync(secretOnly2App1)

  // Get all secrets
  secretsApp1 = Object.values(await app1.getSecretsAsync())
  expect(secretsApp1.length).toBe(2)
  const secret1App1 = secretsApp1[0]
  expect(secretsApp1[0].secret).toEqual(secretOnly1App1)
  expect(secretsApp1[1].secret).toEqual(secretOnly2App1)

  // Create another user
  const app2 = await createUserAsync()

  // Invite new user to secret
  const user2 = await app1.getUserAsync({ email: app2.user.email })
  expect(user2.id).toBe(app2.user.id)
  await app1.inviteAsync(secretOnly1App1.id, user2)

  // Check for invite
  const invitesMap = await app2.getInvitesAsync()
  const invites = Object.values(invitesMap)
  expect(invites.length).toBe(1)
  const [invite] = invites

  // Accept and access it
  await app2.acceptInviteAsync(invite)
  const secretsApp2Map = await app2.getSecretsAsync()
  const secretsApp2 = Object.values(secretsApp2Map)
  expect(secretsApp2.length).toBe(1)
  const [secret1App2] = secretsApp2
  expect(secret1App2.secret).toEqual(secretOnly1App1)
  expect(secret1App2.encryptedSecret.secret).toEqual(secret1App1.encryptedSecret.secret)
  expect(secret1App2.encryptedSecret.secretId).toEqual(secret1App1.encryptedSecret.secretId)
  expect(secret1App2.encryptedSecret.keyTable.invited).toEqual({})
  expect(secret1App2.encryptedSecret.keyTable.removed).toEqual({})
  expect(Object.keys(secret1App2.encryptedSecret.keyTable.member)).toContain(app1.user.id)
  expect(Object.keys(secret1App2.encryptedSecret.keyTable.member)).toContain(app2.user.id)
})
