import { useCallback } from 'react'
import { hasPermission } from '../utils/permissions'
import { useSession } from './useSession'

/**
 * What the signed-in person may do, for hiding buttons they can't use. The API checks the same keys
 * on every request: this is about not offering a dead control, never about security on its own.
 */
export function usePermissions() {
  const session = useSession()
  const can = useCallback((key: string) => hasPermission(session.data, key), [session.data])
  return { can, isLoading: session.isPending }
}
