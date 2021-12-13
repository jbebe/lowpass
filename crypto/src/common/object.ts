import { FlatObject } from './type'

const serializeJson = (key: unknown, value: unknown) => {
  if (value instanceof Uint8Array) {
    return {
      type: Uint8Array.name,
      value: Array.from(value),
    }
  }
  return value
}

const deserializeJson = (key: string, value: unknown) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const uint8Type = value as any
  if (uint8Type?.type === Uint8Array.name) {
    return new Uint8Array(uint8Type.value)
  }
  return value
}

export function encodeJson(obj: object): string {
  return JSON.stringify(obj, serializeJson)
}

export function decodeJson<T>(str: string): T {
  return JSON.parse(str, deserializeJson) as T
}

export function createMap<T>(array: T[], selectKey: (key: T) => string): FlatObject<T> {
  return array.reduce((acc, curr) => {
    acc[selectKey(curr)] = curr
    return acc
  }, {} as FlatObject<T>)
}
