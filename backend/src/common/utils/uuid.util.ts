import { randomUUID } from 'node:crypto'
import { validate as validateUuid, version as getUuidVersion } from 'uuid'

/**
 * Generates an RFC 4122 compliant UUID v4 string.
 * Uses native Node.js crypto.randomUUID() for high-performance, cryptographically secure generation.
 */
export function generateUuid(): string {
  return randomUUID()
}

/**
 * Validates if the given string is a syntactically valid UUID.
 * Optionally verifies a specific UUID version (e.g. 4).
 */
export function isValidUuid(value: unknown, expectedVersion: number = 4): boolean {
  if (typeof value !== 'string') {
    return false
  }
  if (!validateUuid(value)) {
    return false
  }
  return getUuidVersion(value) === expectedVersion
}
