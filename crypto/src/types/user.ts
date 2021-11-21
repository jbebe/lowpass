import { AsymmetricKeyPair } from '../crypto-wrapper/asymmetric'

export type User = {
  email: string
  crypto: {
    asym: AsymmetricKeyPair
  }
}
