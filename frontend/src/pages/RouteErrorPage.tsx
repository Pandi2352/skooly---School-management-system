import { useEffect } from 'react'
import { isRouteErrorResponse, useRouteError } from 'react-router-dom'
import { ErrorState } from '@/components/page/ErrorState'
import { PageContainer } from '@/components/page/PageContainer'
import { env } from '@/config/env'
import { cn } from '@/lib/cn'
import { logger } from '@/lib/logger'
import { NotFoundPage } from './NotFoundPage'

/** `standalone` adds page padding when the app layout itself failed and isn't there to provide it. */
export function RouteErrorPage({ standalone = false }: { standalone?: boolean }) {
  const error = useRouteError()
  const isNotFound = isRouteErrorResponse(error) && error.status === 404

  useEffect(() => {
    if (!isNotFound) logger.error('Page failed to render', error)
  }, [error, isNotFound])

  if (isNotFound) return <NotFoundPage />

  const description =
    env.isDev && error instanceof Error
      ? error.message
      : 'Reload to try again. If it keeps happening, tell your administrator which page you were on.'

  return (
    <div className={cn(standalone && 'px-4 py-6 sm:px-8')}>
      <PageContainer title="Page failed to load">
        <ErrorState
          title="Something broke while showing this page"
          description={description}
          onRetry={() => {
            window.location.reload()
          }}
        />
      </PageContainer>
    </div>
  )
}
