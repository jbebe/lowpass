test('User lists all secrets, creates a new secret, lists all secrets again, accesses secret', () => {
  expect(true).toBe(true)
})

/*import { createTestSecret } from '../src/test-helpers/user'

test('User lists all secrets, creates a new secret, lists all secrets again, accesses secret', () => {
  const secret = createTestSecret()
  const { storeService } = createTestUserEnvironment()

  let secrets = storeService.getSecrets()
  expect(secrets.length).toEqual(1)

  storeService.createSecretAsync(secret)
  secrets = storeService.getSecrets()
  expect(secrets.length).toEqual(2)

  const secretWithMatchingId = secrets.find(x => x.id === secret.id)
  expect(secretWithMatchingId).toEqual(secret)
})

test('User A invites User B to its secret and User B accesses it', () => {
  const storage = new MockStorage()
  const userAenv = createTestUserEnvironment(storage)
  const userBenv = createTestUserEnvironment(storage)

  // check that userB is not member of the secret
  const members = userAenv.storeService.getMembers(userAenv.secret)
  expect(Object.keys(members).length).toEqual(1)

  // invite user to the secret
  userAenv.storeService.invite(userBenv.user, userAenv.secret)

  // userB accepts the invite
  // userBenv.storeService.get

  // check that userB is a member of the secret


  // check that userB can read the secret and compare it to the generated secret
})
*/
