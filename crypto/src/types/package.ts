import { EncryptedObject } from '../helpers/asymmetric'

type KeyTable = { [userId: string]: EncryptedObject }

export type SecretPackage = {
  secret: EncryptedObject
  keyTable: KeyTable
}
