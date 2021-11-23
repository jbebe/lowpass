import { FlatObject } from './type'

const serializeJson = (key: unknown, value: unknown) => {
  // the replacer function is looking for some typed arrays.
  // If found, it replaces it by a trio
  if (
    value instanceof Int8Array ||
    value instanceof Uint8Array ||
    value instanceof Uint8ClampedArray ||
    value instanceof Int16Array ||
    value instanceof Uint16Array ||
    value instanceof Int32Array ||
    value instanceof Uint32Array ||
    value instanceof Float32Array ||
    value instanceof Float64Array
  ) {
    return Array.from(value)
  }
  return value
}

export function encodeJson(obj: object): string {
  return JSON.stringify(obj, serializeJson)
}

export function decodeJson(str: string): object {
  return JSON.parse(str)
}

export function createMap<T>(array: T[], selectKey: (key: T) => string): FlatObject<T> {
  return array.reduce((acc, curr) => {
    acc[selectKey(curr)] = curr
    return acc
  }, {} as FlatObject<T>)
}
