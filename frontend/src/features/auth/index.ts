// Public API of the auth feature for the rest of the app.
export { RequireAuth } from './guards/RequireAuth'
export { RequirePermission } from './guards/RequirePermission'
export { useSession, useLogout } from './hooks/useSession'
export { useVisibleNavSections } from './hooks/useVisibleNavSections'
export { canViewPage, hasPermission, permissionKey } from './utils/permissions'
export type { SignedInUser } from './types/auth.types'
