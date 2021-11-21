import { Secret } from '../types/secret'
import { IStorage } from '../types/storage'

export class MockStorage implements IStorage {
  private db: { [collection: string]: unknown[] } = {}

  put(collection: string, secret: Secret): void {
    this.db[collection] ??= []
    this.db[collection].push(secret)
  }

  getAll(collection: string): unknown[] {
    this.db[collection] ??= []
    return this.db[collection]
  }
}
