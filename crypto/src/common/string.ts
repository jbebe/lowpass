const encoder = new TextEncoder()
const decoder = new TextDecoder()

export function encodeString(input: string): Uint8Array {
  return encoder.encode(input)
}

export function decodeString(input: Uint8Array): string {
  return decoder.decode(input)
}
