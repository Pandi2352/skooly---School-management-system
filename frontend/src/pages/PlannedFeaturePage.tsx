import { Link, Navigate, useParams } from 'react-router-dom'
import { paths } from '@/app/paths'
import { PageContainer } from '@/components/page/PageContainer'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { featurePath, findFeature, findModule } from '@/config/navigation'
import { NotFoundPage } from './NotFoundPage'

/** Stands in for each feature until it is built; routes replace it one feature at a time. */
export function PlannedFeaturePage() {
  const { moduleSlug = '', featureSlug = '' } = useParams()
  const module = findModule(moduleSlug)
  const feature = module && findFeature(module, featureSlug)
  if (!module || !feature) return <NotFoundPage />
  if (feature.alias) return <Navigate to={featurePath(module, feature)} replace />

  return (
    <PageContainer
      title={feature.label}
      eyebrow={
        <Link
          to={paths.module(module.slug)}
          className="text-[0.9375rem] text-ink-muted underline hover:text-ink"
        >
          {module.label}
        </Link>
      }
      status={<Badge tone="planned">Not built yet</Badge>}
    >
      <Card title="Planned for this page">
        {feature.capabilities.length > 0 ? (
          <ul className="list-disc columns-[18rem] gap-x-8 ps-5">
            {feature.capabilities.map((capability) => (
              <li key={capability} className="break-inside-avoid py-0.5">
                {capability}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-ink-muted">
            The feature list doesn’t name any sub-features for this page yet.
          </p>
        )}
      </Card>
    </PageContainer>
  )
}
