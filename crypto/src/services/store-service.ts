import { Secret } from '../types/secret'
import { IStorage } from '../types/storage'
import { User } from '../types/user'

enum CollectionType {
  Secret = 'secret',
}

export class StoreService {
  constructor(private user: User, private storage: IStorage) {}

  public getSecrets(): Secret[] {
    return this.storage.getAll(CollectionType.Secret) as Secret[]
  }

  public createSecret(secret: Secret) {
    this.storage.put(CollectionType.Secret, secret)
  }
}
