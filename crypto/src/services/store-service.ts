import { SecretPackage } from '../types/package'
import { Secret } from '../types/secret'
import { IStorage } from '../types/storage'
import { User } from '../types/user'
import { CryptoService } from './crypto-service'

enum CollectionType {
  Secret = 'secret',
}

export class StoreService {
  constructor(private user: User, private storage: IStorage, private crypto: CryptoService) {}

  public getSecrets(): Secret[] {
    const packages = this.storage.getAll(CollectionType.Secret) as SecretPackage[]
    return packages.map(pkg => this.crypto.decryptPackage(pkg))
  }

  public createSecret(secret: Secret) {
    const secretPackage = this.crypto.createPackage(secret)
    this.storage.put(CollectionType.Secret, secretPackage)
  }
}
