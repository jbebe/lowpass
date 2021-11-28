import { FlatObject } from '../common/type'
import { Secret } from './secret'
import { EncryptedObject, User } from './user'

export type KeyTable = {
  member: FlatObject<EncryptedObject>
  invited: FlatObject<EncryptedObject>
  removed: FlatObject<User>
}

export type EncryptedSecret = {
  secretId: string
  secret: EncryptedObject
  keyTable: KeyTable
}

export type SecretPackage = {
  secret: Secret
  encryptedSecret: EncryptedSecret
}
