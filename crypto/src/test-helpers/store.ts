import { AccountService } from '../services/account-service'
import { StoreService } from '../services/store-service'
import { Secret } from '../types/secret'
import { User } from '../types/user'
import { createTestSecret, createTestUser } from './user'

export type TestUserEnvironment = {
  user: User
  secret: Secret
  storeService: StoreService
}
/*
export function createTestUserEnvironment(storage?: IStorage): TestUserEnvironment {
  const user = createTestUser()
  if (!storage) {
    storage = new MockStorage()
  }
  storage.put(CollectionType.User, user.id, user)
  const storeService = new StoreService(user, storage, new AccountService(user, storage))
  const secret = createTestSecret()
  storeService.createSecretAsync(secret)

  return {
    user,
    secret,
    storeService,
  }
}
*/