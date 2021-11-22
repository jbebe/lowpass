import { CryptoService } from '../services/crypto-service'
import { StoreService } from '../services/store-service'
import { Secret } from '../types/secret'
import { User } from '../types/user'
import { MockStorage } from './storage'
import { createTestSecret, createTestUser } from './user'

export type TestStorePack = {
  user: User
  secret?: Secret
  storeService: StoreService
}

export function createTestStore(withSecret?: boolean): TestStorePack {
  const user = createTestUser()
  const storeService = new StoreService(user, new MockStorage(), new CryptoService(user))
  let secret: Secret | undefined
  if (withSecret) {
    secret = createTestSecret()
    storeService.createSecret(secret)
  }

  return {
    user,
    secret,
    storeService,
  }
}
