import { MagnifyingGlassIcon } from '@phosphor-icons/react'
import { Link, useLocation } from 'react-router-dom'
import { paths } from '@/app/paths'
import { EmptyState } from '@/components/page/EmptyState'
import { PageContainer } from '@/components/page/PageContainer'
import { buttonClasses } from '@/components/ui/buttonStyles'

export function NotFoundPage() {
  const { pathname } = useLocation()

  return (
    <PageContainer title="Page not found">
      <EmptyState
        icon={MagnifyingGlassIcon}
        title="Nothing lives at this address"
        description={
          <>
            No page matches <code className="wrap-anywhere">{pathname}</code>. Check the address, or
            find the page in the sidebar.
          </>
        }
        action={
          <Link to={paths.dashboard} className={buttonClasses({ variant: 'secondary' })}>
            Back to dashboard
          </Link>
        }
      />
    </PageContainer>
  )
}
