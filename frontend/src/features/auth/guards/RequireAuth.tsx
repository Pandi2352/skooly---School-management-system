import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { paths } from '@/app/paths'
import { LoadingState } from '@/components/page/LoadingState'
import { useSession } from '../hooks/useSession'

/**
 * Wraps everything behind the sign-in page. A visitor without a session is sent to sign in, with
 * where they were heading kept in the URL so they land there afterwards.
 *
 * Someone using a temporary password can only reach the page that replaces it: until they do, every
 * other page would be a dead end anyway.
 */
export function RequireAuth() {
  const session = useSession()
  const location = useLocation()

  if (session.isPending) return <LoadingState label="Checking your sign-in" />

  if (!session.data) {
    const next = `${location.pathname}${location.search}`
    const to = next === paths.dashboard ? paths.login : `${paths.login}?next=${encodeURIComponent(next)}`
    return <Navigate to={to} replace />
  }

  if (session.data.mustChangePassword && location.pathname !== paths.accountPassword) {
    return <Navigate to={paths.accountPassword} replace />
  }

  return <Outlet />
}
