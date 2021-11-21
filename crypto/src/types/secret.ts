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
  type: SecretType
  value: Password | Note | BankCard
  group: string
}
