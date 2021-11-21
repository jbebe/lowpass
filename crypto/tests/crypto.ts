import { StoreService } from '../src/services/store-service'
import { MockStorage } from '../src/test-helpers/storage'
import { createTestUser, createTestSecret } from '../src/test-helpers/user'

test('User lists all secrets, creates a new secret, lists all secrets again, accesses secret', () => {
  const user = createTestUser()
  const secret = createTestSecret()
  const storeService = new StoreService(user, new MockStorage())

  let secrets = storeService.getSecrets()
  expect(secrets.length).toEqual(0)

  storeService.createSecret(secret)
  secrets = storeService.getSecrets()
  expect(secrets.length).toEqual(1)
  expect(secrets[0]).toEqual(secret)
})
