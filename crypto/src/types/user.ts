import { UserPubKey } from '../crypto-wrapper/asymmetric'
import { UserSymKey } from '../crypto-wrapper/symmetric'

export type User = {
  email: string
  id: string
  crypto: {
    asym: UserPubKey
    sym: UserSymKey
  }
}
