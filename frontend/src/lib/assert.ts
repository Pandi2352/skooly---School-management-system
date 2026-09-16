export function invariant(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message)
}

/** Put in the `default` branch of a switch so TypeScript fails when a case is missing. */
export function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${String(value)}`)
}
