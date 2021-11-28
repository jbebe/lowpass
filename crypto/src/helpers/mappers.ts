import { EncryptedUser, User } from '../types/user'

export function mapEncryptedToUser(encUser: EncryptedUser): User {
  return {
    id: encUser.id,
    email: encUser.email,
    crypto: encUser.crypto,
  }
}
