let counter = 0

export function createId(prefix: string): string {
  const n = ++counter
  if (typeof process !== 'undefined' && process.env['NODE_ENV'] === 'test') {
    return `${prefix}-test-${n}`
  }
  return `${prefix}-${n}`
}
