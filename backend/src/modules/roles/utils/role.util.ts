/** Trims and collapses inner whitespace: "  Transport   Manager " → "Transport Manager". */
export function cleanRoleName(name: string): string {
  return name.trim().replace(/\s+/g, ' ')
}

/** Case-insensitive uniqueness key stored as `nameKey`: "Transport Manager" → "transport manager". */
export function roleNameKey(name: string): string {
  return cleanRoleName(name).toLocaleLowerCase('en')
}

/** Removes duplicates and sorts, so equal permission sets are stored identically. */
export function normalizePermissions(permissions: string[]): string[] {
  return [...new Set(permissions.map((permission) => permission.trim()))].sort()
}
