import { paths } from '@/app/paths'
import { LinkList } from '@/components/page/LinkList'
import { PageContainer } from '@/components/page/PageContainer'
import { modules, pageCount } from '@/config/navigation'

// TODO(api): add real figures (students, fees collected, attendance) once the API serves them.
// No placeholder numbers until then (antislop R-17).
export function DashboardPage() {
  return (
    <PageContainer
      title="Dashboard"
      description={`${modules.length} modules and ${pageCount} pages are planned. None are built yet, so each page lists what it will cover.`}
    >
      <LinkList
        items={modules.map((module) => ({
          to: paths.module(module.slug),
          label: module.label,
          meta: `${module.features.length} pages`,
        }))}
      />
    </PageContainer>
  )
}
