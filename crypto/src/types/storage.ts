import { SecretPackage } from './package'

export interface IStorage {
  put(collection: string, secret: SecretPackage): void
  getAll(collection: string): unknown[]
}
