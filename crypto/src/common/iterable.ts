/**
 * Gets a range of numbers, [0, length)
 */
export function range(length: number, _?: number): number[]
/**
 * Gets a range of numbers, [from, to]
 */
export function range(from: number, to: number): number[]
export function range(a: number, b?: number): number[] {
  // normalize input
  let from = 0
  let to = a - 1
  const lengthOnly = b === undefined
  if (!lengthOnly) {
    from = a
    to = b
  }
  const length = to - from

  // check for invalid input
  if (lengthOnly && a === 0) {
    return []
  }
  if (length < 0) {
    throw new RangeError('Negative length is invalid')
  }

  // generate array
  const arr = new Array(length)
  for (let i = 0; i <= length; ++i) {
    arr[i] = from + i
  }

  return arr
}

export function assertTypedArrayEqual(arr1: Uint8Array, arr2: Uint8Array): boolean {
  if (arr1.byteLength !== arr2.byteLength) return false
  for (let i = 0; i < arr1.byteLength; ++i) {
    if (arr1[i] !== arr2[i]) {
      return false
    }
  }
  return true
}
