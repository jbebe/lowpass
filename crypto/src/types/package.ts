import { FlatObject } from '../common/type'
import { EncryptedObject } from '../helpers/asymmetric'
import { Secret } from './secret'
import { User } from './user'

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
