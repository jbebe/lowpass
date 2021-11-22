import { SecretPackage } from '../types/package'
import { IStorage } from '../types/storage'

export class MockStorage implements IStorage {
  private db: { [collection: string]: unknown[] } = {}

  put(collection: string, secret: SecretPackage): void {
    this.db[collection] ??= []
    this.db[collection].push(secret)
  }

  getAll(collection: string): unknown[] {
    this.db[collection] ??= []
    return this.db[collection]
  }
}
