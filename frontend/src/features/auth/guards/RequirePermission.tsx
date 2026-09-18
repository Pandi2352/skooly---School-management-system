import { LockKeyIcon } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { paths } from '@/app/paths'
import { EmptyState } from '@/components/page/EmptyState'
import { LoadingState } from '@/components/page/LoadingState'
import { PageContainer } from '@/components/page/PageContainer'
import { buttonClasses } from '@/components/ui/buttonStyles'
import { useSession } from '../hooks/useSession'
import { hasPermission } from '../utils/permissions'
import type { ReactNode } from 'react'

type RequirePermissionProps = {
  /** A permission key, such as "core-setup-and-administration.user-accounts:view". */
  permission: string
  /** Named in the message, so the reader knows which page they can't open. */
  pageName: string
  children: ReactNode
}

/**
 * The menu already hides pages a role can't open; this catches the other ways in — a typed URL, an
 * old bookmark, a link from a colleague — with a plain explanation instead of an empty page.
 */
export function RequirePermission({ permission, pageName, children }: RequirePermissionProps) {
  const session = useSession()

  if (session.isPending) return <LoadingState label={`Loading ${pageName}`} />

  if (!hasPermission(session.data, permission)) {
    return (
      <PageContainer title={pageName}>
        <EmptyState
          icon={LockKeyIcon}
          title="You don’t have access to this page"
          description={`Your role doesn’t include ${pageName}. An administrator at your school can change that under Roles & Permissions.`}
          action={
            <Link to={paths.dashboard} className={buttonClasses({ variant: 'secondary' })}>
              Back to dashboard
            </Link>
          }
        />
      </PageContainer>
    )
  }

  return <>{children}</>
}
