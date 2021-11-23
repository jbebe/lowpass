import { range } from '../../src/common/iterable'

test('range: [0,0] gives 0', () => {
  const result = range(0, 0)
  expect(result).toEqual([0])
})

test('range: [0, 5] gives 0,1,2,3,4,5', () => {
  const result = range(0, 5)
  expect(result).toEqual([0, 1, 2, 3, 4, 5])
})

test('range: [-5, 0] gives -5,-4,-3,-2,-1,0', () => {
  const result = range(-5, 0)
  expect(result).toEqual([-5, -4, -3, -2, -1, 0])
})

test('range: [10, 12] gives 10,11,12', () => {
  const result = range(10, 12)
  expect(result).toEqual([10, 11, 12])
})

test('range: 0 gives empty array', () => {
  const result = range(0)
  expect(result).toEqual([])
})

test('range: 5 gives 0,1,2,3,4', () => {
  const result = range(5)
  expect(result).toEqual([0, 1, 2, 3, 4])
})

test('range: -5 gives exception', () => {
  expect(() => range(-5)).toThrow(new RangeError('Negative length is invalid'))
})
