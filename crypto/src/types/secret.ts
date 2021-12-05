export type UserSecretPair = {
  userId: string
  secretId: string
}

export type SecretInvite = {
  inviteeId: string
  secretId: string
  inviterId: string
}

export type SecretType = 'Password' | 'Note' | 'BankCard'

type SecretValueBase = {
  title: string
  note: string
}

export type Password = SecretValueBase & {
  url: string
  id: string
  password: string
}

export type Note = SecretValueBase

export type BankCard = SecretValueBase & {
  number: string
  securityCode: string
  expirationDate: string
}

export type Secret = {
  id: string
  type: SecretType
  value: Password | Note | BankCard
  group: string
}
