import type { SignedInUser } from '../types/auth.types'

/**
 * A permission key is "<module>.<page>:<action>", built from the menu the same way the Roles &
 * Permissions page builds it, so a new page in the menu creates its own keys on both sides.
 */
export type PermissionAction = 'view' | 'create' | 'edit' | 'delete'

export function permissionKey(moduleSlug: string, pageSlug: string | null, action: PermissionAction): string {
  return pageSlug ? `${moduleSlug}.${pageSlug}:${action}` : `${moduleSlug}:${action}`
}

/** A full-access role has every permission, including pages added after the role was made. */
export function hasPermission(session: SignedInUser | undefined, key: string): boolean {
  if (!session) return false
  return session.fullAccess || session.permissions.includes(key)
}

export function hasAnyPermission(session: SignedInUser | undefined, keys: string[]): boolean {
  if (!session) return false
  return session.fullAccess || keys.some((key) => session.permissions.includes(key))
}

/** Whether a menu page should be listed at all: it needs at least the "view" permission. */
export function canViewPage(session: SignedInUser | undefined, moduleSlug: string, pageSlug: string | null): boolean {
  return hasPermission(session, permissionKey(moduleSlug, pageSlug, 'view'))
}
