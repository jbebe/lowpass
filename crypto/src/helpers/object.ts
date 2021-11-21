export function encodeJson(obj: object): string {
  return JSON.stringify(obj)
}

export function decodeJson(str: string): object {
  return JSON.parse(str)
}
