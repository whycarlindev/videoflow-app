/**
 * Typed assertion helper compatible with any test runner (Vitest, Bun, Jest).
 * Acts as a TypeScript `asserts` guard — narrows the type on the happy path.
 */
export function assert(condition: unknown, message?: string): asserts condition {
  if (!condition) {
    throw new Error(message ?? `Assertion failed: expected truthy, got ${String(condition)}`)
  }
}
