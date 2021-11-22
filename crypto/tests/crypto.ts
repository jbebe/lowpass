import { createTestStore } from '../src/test-helpers/store'
import { createTestUser, createTestSecret } from '../src/test-helpers/user'

test('User lists all secrets, creates a new secret, lists all secrets again, accesses secret', () => {
  const secret = createTestSecret()
  const { storeService } = createTestStore()

  let secrets = storeService.getSecrets()
  expect(secrets.length).toEqual(0)

  storeService.createSecret(secret)
  secrets = storeService.getSecrets()
  expect(secrets.length).toEqual(1)

  expect(secrets[0]).toEqual(secret)
})

test('User A invites User B to its secret and User B accesses it', () => {
  const userB = createTestUser()
  const { storeService, secret } = createTestStore(true)

  // check that userB is not member of the secret

  // invite user to the secret
  //storeService.invite(userB, secret)

  // check that userB is a member of the secret

  // check that userB can read the secret and compare it to the generated secret
})
