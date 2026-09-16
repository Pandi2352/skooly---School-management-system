import { SetMetadata } from '@nestjs/common'

export const PERMISSIONS_KEY = 'permissions'

/**
 * Decorator to enforce granular permission requirements on route handlers or controllers.
 * Example: `@RequirePermissions('roles:read', 'roles:write')`
 */
export const RequirePermissions = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions)
