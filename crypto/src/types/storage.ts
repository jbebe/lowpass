import { Secret } from '../types/secret'

export interface IStorage {
  put(collection: string, secret: Secret): void
  getAll(collection: string): unknown[]
}
