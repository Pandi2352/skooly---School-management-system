import { useParams } from 'react-router-dom'
import { EmptyState } from '@/components/page/EmptyState'
import { LinkList } from '@/components/page/LinkList'
import { PageContainer } from '@/components/page/PageContainer'
import { Badge } from '@/components/ui/Badge'
import { featurePath, findModule } from '@/config/navigation'
import { NotFoundPage } from './NotFoundPage'

export function PlannedModulePage() {
  const { moduleSlug = '' } = useParams()
  const module = findModule(moduleSlug)
  if (!module) return <NotFoundPage />

  if (module.features.length === 0) {
    return (
      <PageContainer title={module.label} status={<Badge tone="planned">Not built yet</Badge>}>
        <EmptyState
          title="This page is planned"
          description="It will show its tools here once it's built."
        />
      </PageContainer>
    )
  }

  return (
    <PageContainer title={module.label} status={<Badge tone="planned">Not built yet</Badge>}>
      <LinkList
        items={module.features.map((item) => {
          const aliasModule = item.alias && findModule(item.alias.module)
          return {
            to: featurePath(module, item),
            label: item.label,
            meta: aliasModule
              ? `Opens in ${aliasModule.label}`
              : item.capabilities.length > 0
                ? `${item.capabilities.length} planned`
                : undefined,
          }
        })}
      />
    </PageContainer>
  )
}
